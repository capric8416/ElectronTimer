// Modules to control renderer life
const { ipcRenderer } = require('electron')
const path = require('path')



class Service {
    constructor() {
        this.refreshInterval = null

        this.style = 'Timer'

        this.frameInterval = 1000 / 60

        this.timestamp = 0
        this.lastTimestamp = 0

        this.title = document.getElementsByTagName('title')[0]
        this.body = document.getElementsByTagName('body')[0]
        this.tick = document.getElementById('tick')
        this.player = document.getElementById('player')

        this.tickPlaying = false
        this.videoPlaying = false

        this.tickSize = 0
        this.bodySize = 0
    }


    start(self) {
        self.handleMenuItemEvent(self)
        self.handleVideoPlayerEvent(self)
    }


    // Handle menu item click event
    handleMenuItemEvent(self) {
        ipcRenderer.on('menuItemClicked', function (event, message) {
            if (message.menu == 'Style') {
                self.style = message.item
                self.updateTick(self)
                self.resetTick(self)
            }
            else if (message.menu == 'frameRate') {
                self.frameInterval = 1000 / parseInt(message.item)
                if (self.tickPlaying) {
                    self.pauseTick(self)
                    self.playTick(self)
                }
            }
            else if (message.menu == 'fontSize') {
                if (message.item == 'Increase') {
                    self.increaseFontSize(self)
                }
                else if (message.item == 'Decrease') {
                    self.decreaseFontSize(self)
                }
                else if (message.item == 'Default') {
                    self.tick.style.fontSize = '5em'
                }
            }
            else if (message.menu == 'Video') {
                if (message.item == 'Play') {
                    self.playVideo(self)
                }
                else if (message.item == 'Pause') {
                    self.pauseVideo(self)
                }
                else if (message.item == 'Stop') {
                    self.clearVideo(self)
                }
                else {
                    self.playVideo(self, message.item)
                }
            }
            else if (message.menu == 'Tick') {
                if (message.item == 'Play') {
                    self.updateTick(self)
                    self.playTick(self)
                    self.playVideo(self)
                }
                else if (message.item == 'Pause') {
                    self.updateTick(self)
                    self.pauseTick(self)
                    self.pauseVideo(self)
                }
                else if (message.item == 'Clear') {
                    self.clearTick(self)
                    self.clearVideo(self)
                }
                else if (message.item == 'Hide') {
                    self.clearTick(self)
                    self.hideTick(self)
                }
            }
        })
    }


    handleVideoPlayerEvent(self) {
        self.player.onpause = function () {
            ipcRenderer.send('video', 'pause')
            self.videoPlaying = false
            self.updateTick(self)
            self.pauseTick(self)
        }

        self.player.onplay = function () {
            ipcRenderer.send('video', 'play')
            self.videoPlaying = true
            self.updateTick(self)
            self.playTick(self)
        }
    }


    getFontSize(self) {
        self.tickSize = window.getComputedStyle(self.tick).getPropertyValue('font-size')
        self.tickSize = parseInt(self.tickSize.substring(0, self.tickSize.indexOf('px')))

        self.bodySize = window.getComputedStyle(self.body).getPropertyValue('font-size')
        self.bodySize = parseInt(self.bodySize.substring(0, self.bodySize.indexOf('px')))
    }


    decreaseFontSize(self) {
        self.getFontSize(self)
        self.tick.style.fontSize = (self.tickSize / self.bodySize - .1) + 'em'
    }


    increaseFontSize(self) {
        self.getFontSize(self)
        self.tick.style.fontSize = (self.tickSize / self.bodySize + .1) + 'em'
    }


    updateTick(self) {
        self.now = (new Date()).valueOf()
        self.lastTimestamp = self.now - self.timestamp
    }


    playTick(self) {
        self.tickPlaying = true

        clearInterval(self.refreshInterval)

        self.tick.style.display = 'block'

        self.refreshInterval = setInterval(
            function () {
                if (self.style == 'Timer') {
                    self.now = (new Date()).valueOf()
                    self.timestamp = self.now - self.lastTimestamp

                    let temp = self.timestamp
                    let hours = parseInt(temp / 3600000)

                    temp %= 3600000
                    let minutes = parseInt(temp / 60000)

                    temp %= 60000
                    let seconds = parseInt(temp / 1000)

                    let milliseconds = parseInt(temp % 1000)

                    self.tick.value = `${self.hundredPadding(hours)}:${self.hundredPadding(minutes)}:${self.hundredPadding(seconds)}.${self.thousandPadding(milliseconds)}`
                }
                else if (self.style == 'Clock') {
                    self.now = new Date()
                    self.tick.value = `${self.hundredPadding(self.now.getHours())}:${self.hundredPadding(self.now.getMinutes())}:${self.hundredPadding(self.now.getSeconds())}.${self.thousandPadding(self.now.getMilliseconds())}`
                }
                else if (self.style == 'Timestamp') {
                    self.now = (new Date()).valueOf()
                    let seconds = parseInt(self.now / 1000)
                    let milliseconds = self.now % 1000
                    self.tick.value = `${seconds}.${self.thousandPadding(milliseconds)}`
                }

            },
            self.frameInterval
        )
    }


    pauseTick(self) {
        self.tickPlaying = false

        clearInterval(self.refreshInterval)
    }


    resetTick(self) {
        if (self.style == 'Timer' || self.style == 'Clock') {
            self.tick.value = '00:00:00.000'
            if (self.style == 'Timer') {
                self.title.textContent = 'Electron Timer'
            }
            else {
                self.title.textContent = 'Electron Clock'
            }
        }
        else if (self.style == 'Timestamp') {
            self.title.textContent = 'Electron Timestamp'
            self.tick.value = '0000000000.000'
        }
    }


    clearTick(self) {
        self.tickPlaying = false

        clearInterval(self.refreshInterval)

        self.resetTick(self)

        self.timestamp = 0
    }


    hideTick(self) {
        self.tick.style.display = 'none'
    }


    playVideo(self, name) {
        if (name) {
            self.player.setAttribute('src', self.player.getAttribute('data-src-' + name.replace(' ', '-')) || '')
        }
        if (self.player.getAttribute('src')) {
            self.tick.style.background = 'white'
            self.player.style.display = 'inline-block'
            self.player.loop = true
            self.player.play()
            self.videoPlaying = true
        }
    }


    pauseVideo(self) {
        self.player.pause()
        self.videoPlaying = false
    }


    clearVideo(self) {
        self.tick.style.background = 'transparent'
        self.player.setAttribute('src', '')
        self.player.style.display = 'none'
        self.videoPlaying = false
        ipcRenderer.send('video', 'stop')
    }


    hundredPadding(n) {
        return n < 10 ? '0' + n : '' + n
    }


    thousandPadding(n) {
        if (n < 10)
            return '00' + n
        else if (n < 100)
            return '0' + n
        else
            return '' + n
    }
}



// entry
var service = null
window.addEventListener('DOMContentLoaded', () => {
    service = new Service()
    service.start(service)
})
