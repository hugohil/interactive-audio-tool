'use strict'

const context = new AudioContext()
const gain = context.createGain()
const panner = context.createStereoPanner()

let active = false

export function isActive () {
  return active
}

export function getDeviceSources () {
  return navigator.mediaDevices.enumerateDevices()
    .then(devices => devices.filter(device => /audioinput/i.test(device.kind)))
}

export function setGain (value) {
  gain.gain.value = value
}

export function setPanner (value) {
  panner.pan.value = value
}

export function connectUserMedia (deviceID) {
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: {
      deviceId: {
        exact: deviceID
      }
    }
  }).then((stream) => {
    const source = context.createMediaStreamSource(stream)

    source.channelCountMode = 'explicit'
    source.channelInterpretation = 'discrete'

    panner.connect(gain)
    source.connect(panner)
    gain.connect(context.destination)

    active = true
  }).catch((err) => {
    console.error(err)
  })
}
