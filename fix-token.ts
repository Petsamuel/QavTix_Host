import { Project, SyntaxKind, VariableStatement } from 'ts-morph';

async function fixTokens() {
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
    });

    const actionsDir = project.getDirectory("src/actions");
    if (!actionsDir) throw new Error("Could not find src/actions");

    const files = actionsDir.getSourceFiles("**/index.ts");

    for (const file of files) {
        let changed = false;
        file.getDescendantsOfKind(SyntaxKind.VariableStatement).forEach((stmt: VariableStatement) => {
            const decls = stmt.getDeclarations();
            if (decls.length === 1) {
                const decl = decls[0];
                if (decl.getName() === "token" && decl.getInitializer()?.getText() === "token") {
                    stmt.remove();
                    changed = true;
                }
            }
        });
        if (changed) {
            console.log(`Fixed ${file.getFilePath()}`);
        }
    }

    await project.save();
    console.log("Done fixing tokens.");
}

fixTokens().catch(console.error);
