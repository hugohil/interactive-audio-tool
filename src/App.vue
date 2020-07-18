<template>
  <div id="app">
    <div class="active-area"></div>

    <section>
      <h2>source</h2>
      <select v-model="sourceID">
        <option
        v-for="source in sources"
        :value="source.deviceId">
          {{ source.label }}
        </option>
      </select>
    </section>

    <section>
      <p>gain: {{ gain.toFixed(8) }}</p>
      <p class="mark">&#10012;</p>
      <p>pan: {{ pan.toFixed(8) }}</p>
    </section>

    <section>
      <div>
        <h2>mode</h2>
        <select v-model="mode">
          <option value="all">all</option>
          <option value="pan">pan</option>
          <option value="gain">gain</option>
        </select>
      </div>
      <div>
        <h2>area</h2>
        <div>
          <label for="width">x ({{ Number(width).toFixed(2) }}):</label>
          <input v-model="width" name="width" type="range" step=".01" min="0" max="1">
        </div>
        <div>
          <label for="height">y ({{ Number(height).toFixed(2) }}):</label>
          <input v-model="height" name="height" type="range" step=".01" min="0" max="1">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as audio from '@/lib/audio'
import throttle from 'lodash.throttle'

export default {
  name: 'App',
  data () {
    return {
      mode: 'all',
      width: 1,
      height: 1,
      pan: 0,
      gain: .5,
      sourceID: '',
      sources: []
    }
  },
  watch: {
    sourceID (value) {
      audio.connectUserMedia(value)
    },
    width (value) {
      document.querySelector('.active-area').style.width = `${(window.innerWidth * value)}px`
    },
    height (value) {
      document.querySelector('.active-area').style.height = `${(window.innerHeight * value)}px`
    }
  },
  mounted () {
    audio.getDeviceSources().then(sources => {
      this.sources = sources
    })

    const mouseHandler = throttle(({ target, clientX, clientY }) => {
      this.gain = (1 - ((clientY - target.offsetTop) / target.clientHeight))
      this.pan = ((((clientX - target.offsetLeft) / target.clientWidth) - .5) * 2)

      if (this.mode === 'all') {
        audio.setGain(this.gain)
        audio.setPanner(this.pan)
      } else if (this.mode === 'gain') {
        audio.setGain(this.gain)
      } else if (this.mode === 'pan') {
        audio.setPanner(this.pan)
      }
    }, 32, { leading: true, trailing: false })

    document.querySelector('.active-area').addEventListener('mousemove', mouseHandler)
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

body, html {
  background: #0A0A02;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  cursor: crosshair;
}

#app {
  font-family: monospace;
  text-align: center;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.active-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  border: 1px solid #FFFFFF;
  background: transparent;
  z-index: 10;
}

section {
  color: #FFFFFF;
  text-align: center;
  border: 1px solid #FFFFFF;
  min-width: 250px;
  max-width: 400px;
  padding: 2em 0;
  margin: auto;
  z-index: 10;
  pointer-events: none;

  h2 {
    margin: 1em 0 2em;
  }

  .mark {
    font-size: 64px;
  }
}

option, select, input {
  cursor: pointer;
  pointer-events: auto;
  z-index: 15;
}
</style>
