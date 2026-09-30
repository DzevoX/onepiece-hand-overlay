# One Piece Card Strips

A small, unofficial fan tool for the One Piece Card Game. It turns cards into compact colored "strips" (cost, name, set number, power, counter) and lets you build a hand overlay for streams, videos or screenshots.

It is a single HTML file with no build step, no server and no dependencies.

## Features

- **Card search** by name or set number. Type several words to narrow results, for example `luffy op14` shows every Luffy card from the OP14 set.
- **Hand builder:** click a card to add it to your hand, click a strip in the hand to remove it.
- **Card colors:** strips use the card's color, with a two-color gradient for dual-color cards.
- **Display options:** toggle the set number and the power/counter info, and set the strip width.
- **PNG export:** download your hand as a transparent PNG for use in an editor.
- **Overlay window:** open a separate window that mirrors your hand live. Set its background to transparent, green or black and capture it in OBS (use a chroma key with the green background).
- **Zero values shown:** cost 0 and power 0 are displayed as `0`. A counter of 0 is hidden.
- **Dark mode** support.

## How to use

1. Open [https://onepiece-hand-overlay.netlify.app](https://onepiece-hand-overlay.netlify.app/) in a browser.
2. Click **Load card data**. This downloads the card list once, which takes a minute or two.
3. Search for cards and click them to build your hand.
4. Use **Download PNG** or **Open overlay window** to get your hand out of the page.

Later, click **Check for updates** to fetch newer card data. Only changed files are downloaded.

## Card data and privacy

- Card data comes from the [punk-records](https://github.com/buhbbl/punk-records) project on GitHub. Nothing is downloaded until you click the button.
- Data is fetched from GitHub (`raw.githubusercontent.com`, `api.github.com`) and the jsDelivr CDN (`cdn.jsdelivr.net`, `data.jsdelivr.com`). Those services can see your IP address, as with any website.
- The card list, your hand and your settings are saved in your browser's localStorage only. Nothing is stored on a server.
- There are no accounts, cookies, analytics or tracking.
- **Clear data** removes everything the page has saved. The About section on the page shows how much storage is in use.

## Limitations

- Leaders and alternate-art or variant cards are left out on purpose.
- Card data comes straight from punk-records, so it can lag behind new sets or contain mistakes.
- Browsers usually allow about 5 MB of localStorage per site. The saved card data takes a large part of that.

## Feedback and bug reports

Suggestions and bug reports are welcome on the [Issues page](https://github.com/DzevoX/onepiece-hand-overlay/issues). A free GitHub account is needed to post. For bugs, please include the card ID, your browser, and what you expected to happen.

## Built with AI

This tool was built with help from an AI assistant (Claude).

## License and credits

- Card data is provided by [punk-records](https://github.com/buhbbl/punk-records), which is licensed under AGPL-3.0. This tool downloads that data at runtime and does not bundle it.
- This is an unofficial fan project. It is not affiliated with or endorsed by Bandai, Shueisha or Toei Animation.
- One Piece Card Game is &copy; Eiichiro Oda/Shueisha, Toei Animation, Bandai.
