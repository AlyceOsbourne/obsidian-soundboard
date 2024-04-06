const obsidian = require('obsidian');

class SoundboardPlugin extends obsidian.Plugin {
    onload() {
        this.audioStates = {};

        this.registerMarkdownCodeBlockProcessor('soundboard', async (source, el, ctx) => {
            const sourceChanged = this.audioStates[ctx.sourcePath] &&
                JSON.stringify(this.audioStates[ctx.sourcePath].map(({name, url, image, loop, volume}) => ({name, url, image, loop, volume}))) !== JSON.stringify(this.parseSoundboard(source).map(({name, url, image, loop, volume}) => ({name, url, image, loop, volume})));

            if (!this.audioStates[ctx.sourcePath] || sourceChanged) {
                if (sourceChanged) {
                    this.stopAudioByPath(ctx.sourcePath);
                }
                
                const parsedSounds = this.parseSoundboard(source);
                this.audioStates[ctx.sourcePath] = parsedSounds.map(sound => ({
                    ...sound,
                    playing: false,
                    audio: this.createConfiguredAudio(sound)
                }));
            }

            // Clear previous content
            el.innerHTML = '';
            const gridContainer = this.createSoundboardGrid(ctx.sourcePath);
            el.appendChild(gridContainer);
            
            ctx.addChild({
                onload: () => {},
                onunload: () => this.stopAudioByPath(ctx.sourcePath),
            });
        });
    }

    parseSoundboard(source) {
        const regex = /name:\s*(.*?)\s*url:\s*(.*?)\s*(image:\s*(.*?)\s*)?(loop:\s*(true|false)\s*)?(volume:\s*(\d+)%?\s*)?(?=(name:|$))/gs;
        let match;
        const sounds = [];
        while ((match = regex.exec(source)) !== null) {
            sounds.push({
                name: match[1].trim(),
                url: match[2].trim(),
                image: match[4] ? match[4].trim() : null,
                loop: match[6] ? match[6].trim() === 'true' : false,
                volume: match[8] ? parseInt(match[8], 10) / 100 : 1,
            });
        }
        return sounds;
    }

    createConfiguredAudio(sound) {
        let audioSource;
        if (sound.url.startsWith('[[') && sound.url.endsWith(']]')) {
            const relativePath = sound.url.slice(2, -2);
            audioSource = this.app.vault.getResourcePath(this.app.vault.getAbstractFileByPath(relativePath));
        } else {
            audioSource = sound.url;
        }

        const audio = new Audio(audioSource);
        audio.loop = sound.loop;
        audio.volume = sound.volume;
        return audio;
    }

    createSoundboardGrid(sourcePath) {
        const container = document.createElement('div');
        container.className = 'soundboard-grid';

        this.audioStates[sourcePath].forEach(sound => {
            const soundElement = document.createElement('div');
            soundElement.className = 'soundboard-sound';
            soundElement.dataset.playing = sound.playing ? "true" : "false";

          if (sound.image) {
                const imagePath = sound.image.startsWith('[[') && sound.image.endsWith(']]') ?
                  this.app.vault.getResourcePath(this.app.vault.getAbstractFileByPath(sound.image.slice(2, -2))) :
                  sound.image;
    
                const imageContainer = document.createElement('div');
                imageContainer.className = 'soundboard-image-container';
    
                const image = document.createElement('img');
                image.src = imagePath;
                image.alt = sound.name;
                image.className = 'soundboard-image';
    
                imageContainer.appendChild(image);
                soundElement.appendChild(imageContainer);
            }
            
            const text = document.createElement('span');
            text.className = 'soundboard-text';
            text.textContent = sound.playing ? "Pause" : sound.name;
            soundElement.appendChild(text);

            soundElement.addEventListener('click', () => {
                if (soundElement.dataset.playing === "false") {
                    sound.audio.play();
                    soundElement.dataset.playing = "true";
                    sound.playing = true;
                    text.textContent = "Pause";
                    if (!sound.loop) {
                        sound.audio.addEventListener('ended', () => {
                            soundElement.dataset.playing = "false";
                            sound.playing = false;
                            text.textContent = sound.name;
                        }, {once: true});
                    }
                } else {
                    sound.audio.pause();
                    soundElement.dataset.playing = "false";
                    sound.playing = false;
                    text.textContent = sound.name;
                }
            });

            container.appendChild(soundElement);
        });

        return container;
    }
    
    stopAudioByPath(sourcePath) {
        if (this.audioStates[sourcePath]) {
            this.audioStates[sourcePath].forEach(sound => {
                sound.audio.pause();
                sound.audio.src = "";
                sound.playing = false;
            });
            delete this.audioStates[sourcePath];
        }
    }
}

module.exports = SoundboardPlugin;
