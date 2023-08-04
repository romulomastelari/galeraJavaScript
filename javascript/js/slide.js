export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide)
        this.wrapper = document.querySelector(wrapper)
    }

    onStart(event) {
        event.preventDefault()
        console.log('mousedown')
        this.wrapper.addEventListener('mousemove', this.onMove())
    }

    onMove(event) {
        console.log('moveu')
    }

    onEndMove(event) {
        console.log('acabou o clique')
        this.wrapper.removeEventListener('mousemove', this.onMove)

    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart)
        this.wrapper.addEventListener('mouseup', this.onEndMove)
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onEndMove = this.onEndMove.bind(this)
    }

    init() {
        this.bindEvents()
        this.addSlideEvents()
        return this;
    }
}