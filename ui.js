import Slider from './ui/slider.js';
import ToggleButton from './ui/toggleButton.js';
import Button from './ui/button.js';
import { icons } from './ui/icons.js';
import { getRandomNum } from './helper.js';

// functions
function createEmptyPanel (label) {
    const ui = document.querySelector('#ui');
    const div = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = label;
    div.appendChild(p);
    ui.appendChild(div);

    return div;
}

function setRandomSliderValue (slider, min = slider.min, max = slider.max) {
    slider.input.value = getRandomNum(min, max, false);
    slider.eventHandler();
}

export function createControlPanel ({
    eraseFn, animationToggleFn, saveImgFn,
    atractors, particles, sketchState, updateFns
}) {
    const buttonsDiv = document.querySelector('#buttons');

    const erase = new Button({
        parent: buttonsDiv, fn: eraseFn, updateFn: null, label: icons.erase,
        title: 'erase', id: 'erase'
    });

    const toggleAnimation = new ToggleButton({
        parent: buttonsDiv, prop: 'toggle-animation-btn', value: true,
        labelTrue: icons.pause, labelFalse: icons.play,
        updateFn: animationToggleFn, title: 'play/pause'
    });

    const saveImg = new Button({
        parent: buttonsDiv, fn: saveImgFn, updateFn: null, label: icons.saveImg,
        title: 'download png', id: 'saveImg'
    });

    const div1 = createEmptyPanel('Atractors options');

    const atractorNumberSlider = new Slider({
        parent: div1, max: 8, min: 1, value: atractors.particleNumber,
        label: 'atractors # ', prop: 'particleNumber', scope: atractors,
        updateFn: updateFns.atractorNumberSlider
    });

    const gSlider = new Slider({
        parent: div1, max: 60, min: 1, value: atractors.particleOptions.G,
        label: 'atracton force strength', prop: 'G', scope: atractors.particleOptions,
        updateFn: _ => atractors.setup()
    });

    const minDistanceSlider = new Slider({
        parent: div1, max: 70, min: 1, value: atractors.particleOptions.minDistance,
        label: 'atraction force min. distance', prop: 'minDistance',
        scope: atractors.particleOptions,
        updateFn: _ => atractors.setup()
    });

    const maxDistanceSlider = new Slider({
        parent: div1, max: 100, min: 10, value: atractors.particleOptions.maxDistance,
        label: 'atraction force max. distance', prop: 'maxDistance',
        scope: atractors.particleOptions,
        updateFn: _ => atractors.setup()
    });

    const div2 = createEmptyPanel('Particles options');

    const particleNumberSlider = new Slider({
        parent: div2, max: 3000, min: 100, value: particles.particleNumber,
        label: 'particles #', prop: 'particleNumber', scope: particles,
        updateFn: updateFns.particleNumberSlider
    });

    const radiusSlider = new Slider({
        parent: div2, max: 2, min: .1, step: .01,
        value: particles.particleOptions.radius,
        label: 'particles radius', prop: 'radius', scope: particles.particleOptions,
        updateFn: _ => particles.setup()
    });

    const alphaSlider = new Slider({
        parent: div2, max: .5, min: .01, step: .01,
        value: .1, label: 'particle transparency',
        prop: 'a', scope: sketchState.color, updateFn: updateFns.alphaSlider
    });

    const initialRadiusSlider = new Slider({
        parent: div2, max: 300, min: 10, 
        value: sketchState.initialFormationRadius, label: 'initial formation radius',
        prop: 'initialFormationRadius', scope: sketchState,
        updateFn: updateFns.initialRadiusSlider
    });

    const randomOptions = new Button({
        parent: buttonsDiv, updateFn: null, label: icons.randomOptions,
        title: 'randomize values', id: 'randomOptions',
        fn: _ => {
            setRandomSliderValue(atractorNumberSlider);
            setRandomSliderValue(gSlider);
            setRandomSliderValue(minDistanceSlider);
            setRandomSliderValue(maxDistanceSlider);
            setRandomSliderValue(particleNumberSlider);
            setRandomSliderValue(radiusSlider);
            setRandomSliderValue(alphaSlider);
            setRandomSliderValue(initialRadiusSlider);
        }
    });

    return {
        erase, toggleAnimation, saveImg,
        atractorNumberSlider, gSlider, minDistanceSlider, maxDistanceSlider,
        particleNumberSlider, radiusSlider, alphaSlider, initialRadiusSlider
    };
}

export function createTogglePanelButton () {
    const panel = document.querySelector('#panel');
    const togglePanelDiv = document.querySelector('#toggle-panel');

    const toggleButton = new ToggleButton({
        parent: togglePanelDiv, prop: 'toggle-panel-btn', value: false,
        labelTrue: icons.circleSolid, labelFalse: icons.cross, title: 'open/close menu',
        updateFn: function () {
            if (this.value) panel.classList.add('hide'); 
            else panel.classList.remove('hide'); 
        }
    });

    return toggleButton;
}
