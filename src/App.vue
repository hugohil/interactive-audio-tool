<template>
  <div id="app">
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
      <h2>mode</h2>
      <select v-model="mode">
        <option value="all">all</option>
        <option value="pan">pan</option>
        <option value="gain">gain</option>
      </select>
    </section>
  </div>
</template>

<script>
import * as audio from '@/lib/audio'
import debounce from 'lodash.debounce'

export default {
  name: 'App',
  data () {
    return {
      mode: 'all',
      pan: 0,
      gain: .5,
      sourceID: '',
      sources: []
    }
  },
  watch: {
    sourceID (value) {
      audio.connectUserMedia(value)
    }
  },
  mounted () {
    audio.getDeviceSources().then(sources => {
      this.sources = sources
    })

    const mouseHandler = debounce(({ clientX, clientY }) => {
      // if (audio.isActive()) {
      if (true) {
        this.gain = (1 - (clientY / window.innerHeight))
        this.pan = (((clientX / window.innerWidth) - .5) * 2)

        if (this.mode === 'all') {
          audio.setGain(this.gain)
          audio.setPanner(this.pan)
        } else if (this.mode === 'gain') {
          audio.setGain(this.gain)
        } else if (this.mode === 'pan') {
          audio.setPanner(this.pan)
        }
      }
    }, 32, { leading: true, trailing: false })

    document.body.addEventListener('mousemove', mouseHandler)
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
  border: 1px solid #FFFFFF;
}

section {
  color: #FFFFFF;
  text-align: center;
  border: 1px solid #FFFFFF;
  min-width: 250px;
  max-width: 400px;
  padding: 2em 0;
  margin: auto;

  h2 {
    margin: 1em 0 2em;
  }

  .mark {
    font-size: 64px;
  }
}

option, select {
  cursor: pointer;
}
</style>
