import { Project } from "@stackblitz/sdk";

export function getStackBlitzProjectConfig({
  packageName,
  packageVersion,
  functionName,
  isAsync,
  multiImport,
  functionToRunAfterImport,
  paramsConfig,
}: {
  packageName: string;
  packageVersion?: string;
  functionName: string;
  isAsync: boolean;
  multiImport?: string;
  functionToRunAfterImport?: string;
  paramsConfig?: any;
}): Project {
  const INDEX_HTML_TEMPLATE = () => `
<html>
  <head>
  <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-4">
    <div>
    <blockquote class="p-4 my-4 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
    <p class="text-xs font-medium leading-relaxed text-gray-900 dark:text-white">
    import { ${functionName} } from "${packageName}";
    <br/>
    <br/>
    const result = ${isAsync ? "await" : ""} ${
    functionToRunAfterImport ?? functionName
  }()</p>
</blockquote>
  <div>
    <h2 class="text-md mb-4 mt-4">result:</h2>
    <pre id="output" class="text-xs"></pre>
  </div>
        
  </div>
  </body>
</html>
`;

  const destructureImports = () => multiImport;
  const getFunctionToRun = () => {
    if (!multiImport) {
      return functionName;
    }

    if (
      functionToRunAfterImport &&
      multiImport.includes(functionToRunAfterImport)
    ) {
      return functionToRunAfterImport;
    }

    return multiImport.split(",").shift();
  };

  const INDEX_TS_TEMPLATE = () => `
// import function from package
import { ${functionName} } from "${packageName}";

async function runTest() {
  const outputContainer = document.getElementById("output");
  try {

    // run function
    // check params if needed
    const ${!multiImport ? "result" : destructureImports()} = ${
    isAsync ? "await " : ""
  }${getFunctionToRun()}(${paramsConfig ? JSON.stringify(paramsConfig) : ""});
  
    // display result in predefined container
    outputContainer.innerText = JSON.stringify(result, null, 2);


  } catch (error) {
    console.error('An error occured while running example: ', error);
    outputContainer.innerText = \`
An error occured.

Check the debug console to see the details.\`;
  }
}

runTest();
`;
  return {
    title: `${packageName} > ${functionName} example`,
    description: `Example of using ${packageName} > ${functionName} function`,
    template: "typescript",
    files: {
      "index.html": INDEX_HTML_TEMPLATE(),
      "index.ts": INDEX_TS_TEMPLATE(),
    },
    dependencies: {
      [packageName]: packageVersion || "latest",
    },
  };
}
