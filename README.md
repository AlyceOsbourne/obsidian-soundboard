# SoundboardPlugin for Obsidian

The SoundboardPlugin adds an interactive soundboard to your Obsidian notes, allowing you to play audio clips directly from your markdown files. This plugin is perfect for language learners, musicians, podcasters, and anyone who wants to embed audio directly into their notes for quick reference.

## Features

- **Embeddable Soundboard**: Easily create a soundboard grid in your markdown files using a simple code block syntax.
- **Customizable**: Add names, URLs, and optional images to personalize your sound clips.
- **Interactive UI**: Click to play/pause sounds directly from your note. The plugin provides a seamless audio experience within Obsidian.
- **Automatic Cleanup**: Audio is automatically stopped and cleaned up when you navigate away from the note, ensuring no unwanted background play.

## Installation

This plugin can be installed using the BRAT (Beta Reviewer’s Auto-update Tool), which allows you to install and keep up to date with beta plugins not yet available in the official community plugins list.

### Prerequisites

Ensure you have BRAT installed in Obsidian:
1. Go to `Settings > Third-party plugins > Community plugins`, disable `Safe mode`, and click `Browse`.
2. Search for `BRAT` and install it.

### Installing SoundboardPlugin

1. Open Obsidian and access the BRAT settings from `Settings > BRAT`.
2. In the `Beta plugins` tab, paste the URL of this repository into the `Add beta plugin by URL` field and click `Add`.
3. BRAT will now handle the installation and updates for SoundboardPlugin.

**Note:** If this is your first time using BRAT, you might need to restart Obsidian for the plugin to appear in your installed plugins list.

## Usage

To add a soundboard to your note, use the following code block format in your markdown file:

\`\`\`soundboard
name: Example Sound 1
url: https://example.com/sound1.mp3
image: https://example.com/image1.jpg

name: Example Sound 2
url: https://example.com/sound2.mp3
\`\`\`

- `name`: The name of the sound clip (required).
- `url`: The URL of the sound clip (required).
- `image`: An optional URL to an image to display alongside the sound.

## Contributing

Contributions to the SoundboardPlugin are welcome! Here's how you can help:

- **Report Issues**: If you find a bug or have a suggestion for improving the plugin, please open an issue.
- **Submit Pull Requests**: Feel free to fork the repository and submit pull requests with bug fixes or new features.

Enjoy using SoundboardPlugin? Consider starring this repository to show your support!

## License
Do what you want with it, just credit me mmmmmkay?