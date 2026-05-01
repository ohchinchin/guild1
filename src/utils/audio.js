/**
 * Guild Master - Audio Engine
 */

export const GeminiAudio = {
    ctx: null,
    masterGain: null,
    currentBgm: null,
    bgmLoop: null,
    isInitialized: false,

    notes: {
        'C2': 65.41, 'G2': 98.00, 'A2': 110.00, 'F2': 87.31, 'E2': 82.41, 'D2': 73.42,
        'A3': 220.00, 'C4': 261.63, 'E4': 329.63, 'G4': 392.00, 'B4': 493.88,
        'D4': 293.66, 'F4': 349.23, 'Ab4': 415.30, 'Bb4': 466.16
    },

    init() {
        if (this.isInitialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.3;
            this.isInitialized = true;
        } catch (e) { console.error("Audio init failed", e); }
    },

    createOsc(freq, type = 'triangle', duration = 0.5, volume = 0.2) {
        if (!this.isInitialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playSE(type) {
        if (!this.isInitialized || this.masterGain.gain.value === 0) return;
        switch(type) {
            case 'click': this.createOsc(440, 'sine', 0.1, 0.1); break;
            case 'success': 
                this.createOsc(523.25, 'triangle', 0.3, 0.2);
                setTimeout(() => this.createOsc(659.25, 'triangle', 0.3, 0.2), 100);
                break;
            case 'gacha_s':
                [523, 659, 783, 1046].forEach((f, i) => {
                    setTimeout(() => this.createOsc(f, 'sine', 0.8, 0.1), i * 100);
                });
                break;
            case 'danger': this.createOsc(110, 'sawtooth', 0.5, 0.2); break;
        }
    },

    playBGM(type) {
        if (!this.isInitialized) this.init();
        if (this.currentBgm === type) return;
        this.stopBGM();
        this.currentBgm = type;

        let step = 0;
        const sequence = this.getSequence(type);
        
        this.bgmLoop = setInterval(() => {
            if (!this.isInitialized || this.masterGain.gain.value === 0) return;
            const note = sequence[step % sequence.length];
            if (note) {
                const freq = this.notes[note.key];
                this.createOsc(freq, note.type || 'triangle', note.dur || 0.8, note.vol || 0.1);
            }
            step++;
        }, 400);
    },

    stopBGM() {
        if (this.bgmLoop) clearInterval(this.bgmLoop);
        this.currentBgm = null;
    },

    getSequence(type) {
        switch(type) {
            case 'boss':
                return [
                    {key:'D2', vol:0.2, type:'sawtooth'}, null, {key:'D2', vol:0.15}, {key:'Ab4', dur:0.2},
                    {key:'E2', vol:0.2, type:'sawtooth'}, null, {key:'E2', vol:0.15}, {key:'Bb4', dur:0.2}
                ];
            case 'ending':
                return [
                    {key:'C4'}, {key:'E4'}, {key:'G4'}, {key:'C4'},
                    {key:'F4'}, {key:'A3'}, {key:'C4'}, {key:'F4'}
                ];
            default: // home
                return [
                    {key:'A2', vol:0.2}, null, {key:'E4', dur:1.2}, null,
                    {key:'F2', vol:0.2}, null, {key:'C4', dur:1.2}, null,
                    {key:'G2', vol:0.2}, null, {key:'B4', dur:1.2}, null,
                    {key:'E2', vol:0.2}, null, {key:'G4', dur:1.2}, null
                ];
        }
    },

    setMute(isMuted) {
        if (!this.isInitialized) this.init();
        this.masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.3, this.ctx.currentTime, 0.1);
    }
};
