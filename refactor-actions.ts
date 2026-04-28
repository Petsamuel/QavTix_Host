import { Project, SyntaxKind, FunctionDeclaration, Identifier, CallExpression, StringLiteral } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

async function refactor() {
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
    });

    const actionsDir = project.getDirectory("src/actions");
    if (!actionsDir) throw new Error("Could not find src/actions");

    const directories = actionsDir.getDirectories();

    for (const dir of directories) {
        const indexFile = dir.getSourceFile("index.ts");
        if (!indexFile) continue;

        let hasGetters = false;
        const getters: FunctionDeclaration[] = [];

        // Find all exported async functions starting with 'get'
        for (const func of indexFile.getFunctions()) {
            if (func.isExported() && func.isAsync() && func.getName()?.startsWith("get")) {
                hasGetters = true;
                getters.push(func);
            }
        }

        if (!hasGetters) continue;

        console.log(`Processing ${dir.getBaseName()}/index.ts`);

        // Remove "use server" if present
        const statements = indexFile.getStatements();
        if (statements.length > 0 && statements[0].getKind() === SyntaxKind.ExpressionStatement) {
            const expr = statements[0].asKind(SyntaxKind.ExpressionStatement);
            if (expr?.getExpression().getText() === '"use server"' || expr?.getExpression().getText() === "'use server'") {
                expr.remove();
            }
        }

        // We will collect original signatures to recreate in client.ts
        const clientWrappers: string[] = [];

        for (const func of getters) {
            const funcName = func.getName()!;
            
            // Build wrapper for client.ts
            const params = func.getParameters();
            const paramStrings = params.map(p => p.getText());
            const argStrings = params.map(p => p.getName());
            
            clientWrappers.push(`export async function ${funcName}Client(${paramStrings.join(", ")}) {
    return ${funcName}(await getToken()${argStrings.length > 0 ? ", " + argStrings.join(", ") : ""});
}`);

            // Add token parameter to index.ts function
            func.insertParameter(0, {
                name: "token",
                type: "string | undefined"
            });

            // Replace await getToken() with token
            func.getDescendantsOfKind(SyntaxKind.CallExpression).forEach(call => {
                if (call.getExpression().getText() === "getToken") {
                    const parent = call.getParentIfKind(SyntaxKind.AwaitExpression);
                    if (parent) {
                        parent.replaceWithText("token");
                    } else {
                        call.replaceWithText("token");
                    }
                }
            });

            // Insert 'use cache' at the top of the function
            const body = func.getBody();
            if (body && body.getKind() === SyntaxKind.Block) {
                // Check if 'use cache' already exists
                const block = body.asKind(SyntaxKind.Block);
                const hasUseCache = block?.getStatements().some(s => s.getText() === "'use cache';");
                if (!hasUseCache) {
                    block?.insertStatements(0, "'use cache';");
                }
            }

            // Replace next: { tags: [...] } with cacheTag(...)
            func.getDescendantsOfKind(SyntaxKind.PropertyAssignment).forEach(prop => {
                try {
                    if (prop.getName() === "next") {
                        const init = prop.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
                        if (init) {
                            const tagsProp = init.getProperty("tags");
                            if (tagsProp && tagsProp.getKind() === SyntaxKind.PropertyAssignment) {
                                const tagsInit = tagsProp.asKind(SyntaxKind.PropertyAssignment)?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
                                if (tagsInit) {
                                    const elements = tagsInit.getElements().map(e => e.getText());
                                    // Insert cacheTag at top of function
                                    const block = func.getBody()?.asKind(SyntaxKind.Block);
                                    if (block) {
                                        // Make sure cacheTag is imported
                                        const sourceFile = func.getSourceFile();
                                        const hasCacheTagImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === "next/cache" && decl.getNamedImports().some(n => n.getName() === "unstable_cacheTag" || n.getName() === "cacheTag"));
                                        if (!hasCacheTagImport) {
                                            sourceFile.addImportDeclaration({
                                                moduleSpecifier: "next/cache",
                                                namedImports: [{ name: "unstable_cacheTag", alias: "cacheTag" }]
                                            });
                                        }
                                        elements.forEach(element => {
                                            block.insertStatements(1, `cacheTag(${element});`);
                                        });
                                    }
                                }
                            }
                        }
                        // Remove the next property
                        prop.remove();
                    }
                } catch (e) {}
            });

            // Remove cache: "force-cache"
            func.getDescendantsOfKind(SyntaxKind.PropertyAssignment).forEach(prop => {
                try {
                    if (prop.getName() === "cache" && prop.getInitializer()?.getText() === '"force-cache"') {
                        prop.remove();
                    }
                } catch (e) {}
            });
        }

        // Clean up getToken function and cookies import
        const getTokenFunc = indexFile.getFunction("getToken");
        if (getTokenFunc) getTokenFunc.remove();

        const cookiesImport = indexFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === "next/headers");
        if (cookiesImport && cookiesImport.getNamedImports().some(n => n.getName() === "cookies")) {
            // Only remove if it's the only import
            if (cookiesImport.getNamedImports().length === 1) {
                cookiesImport.remove();
            } else {
                const specifier = cookiesImport.getNamedImports().find(n => n.getName() === "cookies");
                if (specifier) specifier.remove();
            }
        }

        // Write client.ts
        if (clientWrappers.length > 0) {
            const clientFile = dir.createSourceFile("client.ts", "", { overwrite: true });
            clientFile.addStatements(`"use server";\n\nimport { cookies } from "next/headers";\nimport { ${getters.map(g => g.getName()).join(", ")} } from "./index";\n\nasync function getToken(): Promise<string | undefined> {\n    const cookieStore = await cookies();\n    return cookieStore.get("host_access_token")?.value;\n}\n\n${clientWrappers.join("\n\n")}`);
        }
    }

    await project.save();
    console.log("Done refactoring actions.");
}

refactor().catch(console.error);
