---
head:
  - - meta
    - name: og:title
      content: "Best practices: A/B testing"
  - - meta
    - name: og:description
      content: "Collection of good practices to help you provide a reliable application."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**A/B%20Testing**.png"
nav:
  position: 10
---

# A/B Testing practices

A/B testing is a method of comparing two versions of a webpage or app against each other to determine which one performs better. It is a way to compare two versions of a single variable, typically by testing a subject's response to variant A against variant B, and determining which of the two variants is more effective.

## Providers

There are planty of A/B testing providers available. Here are some of the most popular ones:

- [AB Tasty](https://www.abtasty.com/)
- [Optimizely](https://www.optimizely.com/)
- [VWO](https://vwo.com/)
- [Split.io](https://www.split.io/)
- [Kameleoon](https://www.kameleoon.com/)
- [PostHog](https://posthog.com/)

You need to pick the right one for your needs. Depending on the size of your company, the complexity of your tests, and the budget you have available. There are generous free plans available in that list, so in most cases, you can start with that.

## Best practices

### Start with a hypothesis

Before you start your A/B test, you should have a clear hypothesis. What do you want to test? What do you expect to happen? What is the goal of the test?

### Split components dynamically to avoid enlagred bundle sizes

You should split your components dynamically. This will help you to avoid enlarged bundle sizes. You can use the `import()` function to load components on demand. Example:

```ts
const myExperimentFlag = useABTesting("myExperimentFlag");

const MyComponent = myExperimentFlag ? import("./MyComponentVariantA") : import("./MyComponentVariantB");

// later in the template

<MyComponent />
```

### Testing smaller components

While dynamic splitting is very effective to avoid loading too much code to the client's browser, this would not be efficient with some very small components. For example if you only want to test a different button variant, then in most cases it could be done in a single component. Example:

```ts
const myExperimentFlag = useABTesting("myExperimentFlag");

// later in the template

<button :class={{
  "bg-color-red": myExperimentFlag,
  "bg-color-blue": !myExperimentFlag
}}> Click me </button>

// or more slear split using v-show/v-if

<button v-if="myExperimentFlag" class="bg-color-red"> Click me </button>
<button v-else class="bg-color-blue"> Click me please! </button>
```

### Clean your code

After the test is finished, you should clean your code. Remove all the unused code and components. This will help you to keep your codebase clean and maintainable. Not removing unused variants will cost you many maintenance problems, especially while refactoring your application.
