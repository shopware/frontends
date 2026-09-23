const myExperimentFlag = useABTesting("myExperimentFlag");

const MyComponent = myExperimentFlag ? import("./MyComponentVariantA") : import("./MyComponentVariantB");

// later in the template

<MyComponent />
