import debounce from "./debounce.js";

export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide)
        this.wrapper = document.querySelector(wrapper)
        this.dist = {
            finalPostion: 0,
            startX: 0,
            movement: 0
        }
        this.activeClass = 'active'
    }

    transitionSlide(active) {
        this.slide.style.transition = active ? 'transform .3s' : '';
    }

    moveSlide(distX) {
        this.dist.movePosition = distX
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    onStart(event) {
        console.log(event)
        let moveType
        if (event.type === 'mousedown') {
            event.preventDefault()
            console.log(this.dist.startX)
            this.dist.startX = event.clientX
            moveType = 'mousemove'
        } else {
            this.dist.startX = event.changedTouches[0].clientX
            moveType = 'touchmove'
        }
        this.wrapper.addEventListener(moveType, this.onMove)
        this.transitionSlide(false)
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6
        return this.dist.finalPostion - this.dist.movement
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
        const finallyPosition = this.updatePosition(pointerPosition)
        this.moveSlide(finallyPosition)
    }

    onEndMove(event) {
        const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove'
        this.dist.finalPostion = this.dist.movePosition
        this.wrapper.removeEventListener(moveType, this.onMove)
        this.transitionSlide(true)
        this.changeSlideOnEnd()
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
            console.log(this.dist.movement)
        } else if (this.dist.movement < 120 && this.index.prev !== undefined) {
            this.activePrevSlide()
        } else {
            this.changeSlide(this.index.active)
        }
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart)
        this.wrapper.addEventListener('mouseup', this.onEndMove)
        this.wrapper.addEventListener('touchstart', this.onEndMove)
        this.wrapper.addEventListener('touchend', this.onEndMove)
    }

    //Slides config

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2
        return -(slide.offsetLeft - margin)
    }

    slideConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element)
            return {
                position,
                element
            }
        })
    }

    slideIndex(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1
        }
    }

    changeSlide(index) {
        const slideActive = this.slideArray[index]
        this.moveSlide(slideActive.position)
        this.slideIndex(index)
        this.dist.finalPostion = slideActive.position
        this.changeActiveClass()
    }

    changeActiveClass() {
        this.slideArray.forEach(item => item.element.classList.remove(this.activeClass))
        this.slideArray[this.index.active].element.classList.add(this.activeClass)
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev)
        }
    }

    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.changeSlide(this.index.next)
        }
    }

    onResize(){
        setTimeout(() => {
            this.slideConfig()
            this.changeSlide(this.index.active)
        }, 1000)

    }

    addResizeEvent(){
        window.addEventListener('resize', this.onResize)
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onEndMove = this.onEndMove.bind(this)
        this.onResize = debounce(this.onResize.bind(this), 200)
    }

    init() {
        this.bindEvents()
        this.addSlideEvents()
        this.slideConfig()
        this.transitionSlide(true)
        this.addResizeEvent()
        return this;
    }
}