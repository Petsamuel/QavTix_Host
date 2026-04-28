import { Project, SyntaxKind, CallExpression } from 'ts-morph';

async function refactorCallers() {
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
    });

    const appDir = project.getDirectory("src/app");
    if (!appDir) throw new Error("Could not find src/app");

    // Process all page.tsx files
    const pageFiles = appDir.getSourceFiles("**/page.tsx");

    for (const pageFile of pageFiles) {
        // Find imports from @/actions/*
        const actionImports = pageFile.getImportDeclarations().filter(decl => {
            const mod = decl.getModuleSpecifierValue();
            return mod.startsWith("@/actions/") && !mod.endsWith("/client");
        });

        if (actionImports.length === 0) continue;

        let needsToken = false;
        const importedGetters = new Set<string>();

        actionImports.forEach(decl => {
            decl.getNamedImports().forEach(n => {
                if (n.getName().startsWith("get")) {
                    needsToken = true;
                    importedGetters.add(n.getName());
                }
            });
        });

        if (!needsToken) continue;

        console.log(`Updating ${pageFile.getFilePath()}`);

        // Ensure cookies import
        const cookiesImport = pageFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === "next/headers");
        if (!cookiesImport) {
            pageFile.addImportDeclaration({
                moduleSpecifier: "next/headers",
                namedImports: ["cookies"]
            });
        } else if (!cookiesImport.getNamedImports().some(n => n.getName() === "cookies")) {
            cookiesImport.addNamedImport("cookies");
        }

        // Add token extraction at the top of the default export function
        const defaultExport = pageFile.getDefaultExportSymbol()?.getValueDeclaration();
        if (defaultExport && defaultExport.getKind() === SyntaxKind.FunctionDeclaration) {
            const func = defaultExport.asKindOrThrow(SyntaxKind.FunctionDeclaration);
            const body = func.getBody();
            if (body && body.getKind() === SyntaxKind.Block) {
                const block = body.asKindOrThrow(SyntaxKind.Block);
                const hasToken = block.getStatements().some(s => s.getText().includes("cookieStore.get("));
                if (!hasToken) {
                    block.insertStatements(0, `const cookieStore = await cookies();\nconst token = cookieStore.get("host_access_token")?.value;`);
                }

                // Update calls to getters
                func.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(call => {
                    const expr = call.getExpression();
                    if (expr.getKind() === SyntaxKind.Identifier && importedGetters.has(expr.getText())) {
                        call.insertArgument(0, "token");
                    }
                });
            }
        }
    }

    // Process all Client components to update imports
    const allFiles = project.getSourceFiles();
    for (const file of allFiles) {
        const filePath = file.getFilePath();
        if (filePath.includes("src/app/") && filePath.endsWith("page.tsx")) continue; // Handled above
        
        const isClient = file.getStatements().some(s => s.getKind() === SyntaxKind.ExpressionStatement && (s.getText() === '"use client"' || s.getText() === "'use client'"));
        if (!isClient) continue;

        const actionImports = file.getImportDeclarations().filter(decl => {
            const mod = decl.getModuleSpecifierValue();
            return mod.startsWith("@/actions/") && !mod.endsWith("/client");
        });

        if (actionImports.length === 0) continue;

        console.log(`Updating client component ${filePath}`);

        actionImports.forEach(decl => {
            let hasGetter = false;
            decl.getNamedImports().forEach(n => {
                if (n.getName().startsWith("get")) hasGetter = true;
            });

            if (hasGetter) {
                // Change import path to /client
                const mod = decl.getModuleSpecifierValue();
                if (!mod.endsWith("/client")) {
                    decl.setModuleSpecifier(`${mod}/client`);
                }
                
                // Update imported names to use Client suffix
                decl.getNamedImports().forEach(n => {
                    const name = n.getName();
                    if (name.startsWith("get") && !name.endsWith("Client")) {
                        n.replaceWithText(`${name}Client as ${name}`);
                    }
                });
            }
        });
    }

    await project.save();
    console.log("Done refactoring callers.");
}

refactorCallers().catch(console.error);
