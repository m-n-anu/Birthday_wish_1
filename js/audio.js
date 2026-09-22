/**
 * Realistic Acoustic Party Popper Sound Synthesizer
 * Uses physical acoustics:
 * 1. Compressed pneumatic pop transient (sharp air burst crack)
 * 2. Realistic acoustic cavity resonance body thump
 * 3. Fluttering rustle of metallic confetti foil flakes falling through air
 * Zero external dependencies, pure Web Audio API, completely natural and professional.
 */

class BirthdayAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.hasInteracted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        this.hasInteracted = true;
        if (!this.ctx) return Promise.resolve(null);
        if (this.ctx.state === 'suspended') {
            return this.ctx.resume().then(() => this.ctx).catch(() => null);
        }
        return Promise.resolve(this.ctx);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Physically accurate party popper acoustic sound (realistic, punchy, not game-like)
     */
    async playPopperSound() {
        if (this.isMuted) return;
        const ctx = await this.init();
        if (!ctx || ctx.state !== 'running') return;

        const now = this.ctx.currentTime;

        // 1. High-Pressure Pneumatic Air Burst (Sharp Transient Crack)
        const burstDuration = 0.08;
        const burstBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * burstDuration, this.ctx.sampleRate);
        const burstData = burstBuffer.getChannelData(0);
        for (let i = 0; i < burstData.length; i++) {
            // Decaying pinkish noise burst
            burstData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
        }

        const burstSource = this.ctx.createBufferSource();
        burstSource.buffer = burstBuffer;

        const highPass = this.ctx.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.setValueAtTime(800, now);

        const burstGain = this.ctx.createGain();
        burstGain.gain.setValueAtTime(1.8, now);
        burstGain.gain.exponentialRampToValueAtTime(0.01, now + burstDuration);

        burstSource.connect(highPass);
        highPass.connect(burstGain);
        burstGain.connect(this.ctx.destination);
        burstSource.start(now);

        // 2. Resonant Body Thump (Acoustic cavity pop, NOT a synth beep)
        const bodyOsc = this.ctx.createOscillator();
        const bodyGain = this.ctx.createGain();

        // Rapid downward frequency sweep characteristic of a pressurized container opening
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(320, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(65, now + 0.12);

        bodyGain.gain.setValueAtTime(1.3, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(this.ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.17);

        // 3. Subtle Fluttering Rustle of Confetti Foil (Air dispersion)
        const rustleDuration = 0.55;
        const rustleBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * rustleDuration, this.ctx.sampleRate);
        const rustleData = rustleBuffer.getChannelData(0);
        for (let i = 0; i < rustleData.length; i++) {
            rustleData[i] = (Math.random() * 2 - 1) * 0.25;
        }

        const rustleSource = this.ctx.createBufferSource();
        rustleSource.buffer = rustleBuffer;

        const rustleFilter = this.ctx.createBiquadFilter();
        rustleFilter.type = 'bandpass';
        rustleFilter.frequency.setValueAtTime(2800, now + 0.04);
        rustleFilter.Q.setValueAtTime(2.0, now);

        const rustleGain = this.ctx.createGain();
        rustleGain.gain.setValueAtTime(0, now);
        rustleGain.gain.linearRampToValueAtTime(0.35, now + 0.06);
        rustleGain.gain.exponentialRampToValueAtTime(0.001, now + rustleDuration);

        rustleSource.connect(rustleFilter);
        rustleFilter.connect(rustleGain);
        rustleGain.connect(this.ctx.destination);
        rustleSource.start(now + 0.03);

        // Micro-offset secondary pop for spatial depth
        setTimeout(() => {
            if (this.isMuted || !this.ctx) return;
            const t = this.ctx.currentTime;
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(240, t);
            osc2.frequency.exponentialRampToValueAtTime(70, t + 0.1);
            gain2.gain.setValueAtTime(0.7, t);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(t);
            osc2.stop(t + 0.11);
        }, 65);
    }

    /**
     * Subtle acoustic pendulum swinging whoosh & gallery settle sound
     */
    playSwingingFrameSound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Gentle acoustic air displacement as frame swings across
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.8);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.95);

        // Gentle subtle wooden wall contact tap as it settles
        setTimeout(() => {
            if (!this.ctx || this.isMuted) return;
            const tapNow = this.ctx.currentTime;
            const tapOsc = this.ctx.createOscillator();
            const tapGain = this.ctx.createGain();

            tapOsc.type = 'triangle';
            tapOsc.frequency.setValueAtTime(110, tapNow);
            tapOsc.frequency.exponentialRampToValueAtTime(45, tapNow + 0.12);

            tapGain.gain.setValueAtTime(0.25, tapNow);
            tapGain.gain.exponentialRampToValueAtTime(0.001, tapNow + 0.12);

            tapOsc.connect(tapGain);
            tapGain.connect(this.ctx.destination);
            tapOsc.start(tapNow);
            tapOsc.stop(tapNow + 0.13);
        }, 950);
    }

    /**
     * Gentle acoustic peg & paper sway sound when sliding polaroids
     */
    playPegSwaySound() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.08);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }
}

window.birthdayAudio = new BirthdayAudioEngine();
