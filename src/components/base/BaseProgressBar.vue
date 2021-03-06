<!-- *************************************************************************
     TEMPLATE
     ************************************************************************* -->

<template lang="pug">
div(
  :class=`[
    "gb-base-progress-bar",
    "gb-base-progress-bar--" + color,
    "gb-base-progress-bar--" + computedTheme,
    {
      "gb-base-progress-bar--with-details-hover": detailsHover
    }
  ]`
)
  span(
    v-if="title || details"
    class="gb-base-progress-bar__content"
  )
    span(
      v-if="title"
      class="gb-base-progress-bar__title"
    ) {{ title }}

    span(
      v-if="details"
      class="gb-base-progress-bar__details"
    ) {{ details }}

    span(
      v-if="detailsHover"
      class="gb-base-progress-bar__details-hover"
    ) {{ detailsHover }}

  .gb-base-progress-bar__bar
    div(
      :style=`{
        width: safeProgress + "%"
      }`
      class="gb-base-progress-bar__progress"
    )
</template>

<!-- *************************************************************************
     SCRIPT
     ************************************************************************* -->

<script>
// PROJECT: MIXINS
import ThemeMixin from "../../mixins/ThemeMixin.js"

export default {
  mixins: [ThemeMixin],

  props: {
    color: {
      type: String,
      default: "blue",
      validator(x) {
        return ["black", "blue", "green", "grey", "orange", "purple", "red", "turquoise", "white", "yellow"].includes(x)
      }
    },
    details: {
      type: String,
      default: null
    },
    detailsHover: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    progress: {
      type: Number,
      default: 0,

      validator(x) {
        return x >= 0 && x <= 100
      }
    }
  },

  computed: {
    safeProgress() {
      if (this.progress < 0) {
        return 0
      } else if (this.progress <= 100) {
        return this.progress
      } else {
        return 100
      }
    }
  }
}
</script>

<!-- *************************************************************************
     STYLE
     ************************************************************************* -->

<style lang="scss">
// IMPORTS
@import "node_modules/@growthbunker/stylesheets/settings/_colors.scss";
@import "node_modules/@growthbunker/stylesheets/settings/_themes.scss";
@import "node_modules/@growthbunker/stylesheets/tools/_functions.scss";

// VARIABLES
$c: ".gb-base-progress-bar";
$colors: "black", "blue", "green", "grey", "orange", "purple", "red", "turquoise", "white", "yellow";

#{$c} {
  text-align: left;
  font-size: 14px;
  font-family: "Heebo", "Helvetica Neue", Helvetica, Arial, sans-serif;
  user-select: none;

  #{$c}__content {
    display: flex;
    margin-bottom: 10px;

    #{$c}__title,
    #{$c}__details,
    #{$c}__details-hover {
      flex: 1;
      line-height: 22px;
    }

    #{$c}__title {
      text-transform: uppercase;
      font-weight: 700;
    }

    #{$c}__details,
    #{$c}__details-hover {
      text-align: right;
    }
  }

  #{$c}__bar {
    overflow: hidden;
    height: 6px;
    border-radius: 10px;

    #{$c}__progress {
      width: 0;
      height: 100%;
      border-radius: 10px;
      transition: width 0.5s linear;
      animation: fillUp 0.5s linear 0s 1;
    }
  }

  // --> BOOLEANS <--

  &--with-details-hover {
    #{$c}__content {
      #{$c}__details-hover {
        display: none;
      }
    }

    &:hover {
      #{$c}__content {
        #{$c}__details {
          display: none;
        }

        #{$c}__details-hover {
          display: block;
        }
      }
    }
  }

  // --> THEMES <--

  @each $theme in $themes {
    $themeName: map-get($theme, "name");

    &--#{$themeName} {
      #{$c}__content {
        color: mdg($theme, "fonts", "default", "primary");
      }

      #{$c}__bar {
        #{$c}__progress {
          box-shadow: 0 1px 5px 0 mdg($theme, "shadows", "default", "primary");
        }
      }

      // --> COLORS <--

      @each $color in $colors {
        &#{$c}--#{$color} {
          #{$c}__bar {
            #{$c}__progress {
              background-color: mdg($theme, "colors", $color);
            }
          }
        }
      }
    }
  }
}

// --> ANIMATIONS <--

@keyframes fillUp {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
