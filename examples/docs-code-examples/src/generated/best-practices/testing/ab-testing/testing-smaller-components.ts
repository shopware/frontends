const myExperimentFlag = useABTesting("myExperimentFlag");

// later in the template

<button :class={{
  "bg-color-red": myExperimentFlag,
  "bg-color-blue": !myExperimentFlag
}}> Click me </button>

// or more slear split using v-show/v-if

<button v-if="myExperimentFlag" class="bg-color-red"> Click me </button>
<button v-else class="bg-color-blue"> Click me please! </button>
