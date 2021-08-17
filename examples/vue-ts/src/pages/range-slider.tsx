import { defineComponent } from "@vue/runtime-core"
import { computed, h, Fragment } from "vue"
import { useMachine, normalizeProps } from "@ui-machines/vue"
import serialize from "form-serialize"
import { rangeSlider } from "@ui-machines/web"
import { StateVisualizer } from "../components/state-visualizer"
import { useMount } from "../hooks/use-mount"
import { css } from "@emotion/css"

const styles = css`
  .slider {
    --slider-thumb-size: 24px;
    --slider-track-height: 4px;
    height: var(--slider-thumb-size);
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 45px;
    max-width: 400px;
    position: relative;
  }

  .slider__thumb {
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    border-radius: 999px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: var(--slider-thumb-percent);
    background: lime;
  }

  .slider__thumb:focus {
    outline: 2px solid royalblue;
  }

  .slider__track {
    height: var(--slider-track-height);
    background: lightgray;
    border-radius: 24px;
  }

  .slider__track-inner {
    background: magenta;
    height: 100%;
    width: var(--slider-inner-track-width);
    position: relative;
    left: var(--slider-inner-track-start);
  }
`

export default defineComponent({
  name: "RangeSlider",
  setup() {
    const [state, send] = useMachine(
      rangeSlider.machine.withContext({
        uid: "slider-35",
        value: [10, 60],
      }),
    )

    const _ref = useMount(send)
    const mp = computed(() => rangeSlider.connect(state.value, send, normalizeProps))

    return () => {
      return (
        <div className={styles}>
          <form
            // ensure we can read the value within forms
            onChange={(e) => {
              const formData = serialize(e.currentTarget, { hash: true })
              console.log(formData)
            }}
          >
            <div className="slider" ref={_ref} {...mp.value.rootProps}>
              <div className="slider__track">
                <div className="slider__track-inner" {...mp.value.innerTrackProps} />
              </div>
              <div className="slider__thumb" {...mp.value.getThumbProps(0)}>
                <input name="min" {...mp.value.getInputProps(0)} />
              </div>
              <div className="slider__thumb" {...mp.value.getThumbProps(1)}>
                <input name="max" {...mp.value.getInputProps(1)} />
              </div>
            </div>
            <StateVisualizer state={state.value} />
          </form>
        </div>
      )
    }
  },
})
