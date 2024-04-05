const obsidian = require('obsidian');

class SoundboardPlugin extends obsidian.Plugin {
    onload() {
        this.audioObjects = [];

        this.registerMarkdownCodeBlockProcessor('soundboard', async (source, el, ctx) => {
            const soundboardData = this.parseSoundboard(source);
            const gridContainer = this.createSoundboardGrid(soundboardData);
            el.appendChild(gridContainer);

            this.registerEvent(this.app.workspace.on('file-open', (file) => {
                if (!file || file.path !== ctx.sourcePath) {
                    this.stopAllAudio();
                }
            }));

            ctx.addChild({
                onload: () => {},
                onunload: () => this.stopAllAudio(),
            });
        });
    }

    parseSoundboard(source) {
        const regex = /name:\s*(.*?)\s*url:\s*(.*?)\s*(image:\s*(.*?)\s*)?(?=(name:|$))/gs;
        let match;
        const sounds = [];
        while ((match = regex.exec(source)) !== null) {
            sounds.push({
                name: match[1].trim(),
                url: match[2].trim(),
                image: match[4] ? match[4].trim() : null,
            });
        }
        return sounds;
    }

    createSoundboardGrid(sounds) {
        const container = document.createElement('div');
        container.className = 'soundboard-grid';

        sounds.forEach(sound => {
            const soundElement = document.createElement('div');
            soundElement.className = 'soundboard-sound';
            soundElement.dataset.playing = "false";

            if (sound.image) {
                const image = document.createElement('img');
                image.src = sound.image;
                image.alt = sound.name;
                image.className = 'soundboard-image';
                soundElement.appendChild(image);
            }
            
            const text = document.createElement('span');
            text.textContent = sound.name;
            soundElement.appendChild(text);

            const audio = new Audio(sound.url);
            this.audioObjects.push(audio);

            soundElement.addEventListener('click', () => {
                if (soundElement.dataset.playing === "false") {
                    audio.play();
                    text.textContent = "Pause";
                    soundElement.dataset.playing = "true";
                    audio.addEventListener('ended', () => {
                        soundElement.dataset.playing = "false";
                        text.textContent = sound.name;
                    });
                } else {
                    audio.pause();
                    soundElement.dataset.playing = "false";
                    text.textContent = sound.name;
                }
            });

            container.appendChild(soundElement);
        });

        return container;
    }

    stopAllAudio() {
        this.audioObjects.forEach(audio => {
            audio.pause();
            audio.src = "";
        });
        this.audioObjects = [];
    }
}

module.exports = SoundboardPlugin;
