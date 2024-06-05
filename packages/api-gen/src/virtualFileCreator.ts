import ts from "typescript";

export function createVirtualFiles(
  files: Array<{
    name: string;
    content: string;
  }>,
) {
  const filesMap = new Map<string, ts.SourceFile>();

  files.forEach((fileDefinition) => {
    const filename = fileDefinition.name;

    const sourceFile = ts.createSourceFile(
      filename,
      fileDefinition.content,
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS,
    );

    filesMap.set(filename, sourceFile);
  });

  const defaultCompilerHost = ts.createCompilerHost({});

  const customCompilerHost: ts.CompilerHost = {
    getSourceFile: (name, languageVersion) => {
      if (filesMap.has(name)) {
        return filesMap.get(name);
      } else {
        return defaultCompilerHost.getSourceFile(name, languageVersion);
      }
    },
    writeFile: () => {},
    getDefaultLibFileName: () => "lib.d.ts",
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (filename) => filename,
    getCurrentDirectory: () => "",
    getNewLine: () => "\n",
    getDirectories: () => [],
    fileExists: () => true,
    readFile: () => "",
  };

  const program = ts.createProgram(
    // [filename, overridingFilename],
    Array.from(filesMap.keys()),
    {},
    customCompilerHost,
  );

  const typeChecker = program.getTypeChecker();

  const sourceFiles = files.map((file) => {
    return program.getSourceFile(file.name);
  });

  return {
    program,
    typeChecker,
    sourceFiles,
  };
}
