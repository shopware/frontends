Play a video uploaded to the Shopware media library, in the `video` block. YouTube and Vimeo videos have their own elements.

Every option of the element in the Administration is supported:

| Option                       | Behaviour                                                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Video                        | Static or mapped media. Nothing is rendered when it does not resolve.                                                                                                                              |
| Display mode                 | `standard` keeps the video's size, `stretch` makes it full width, `cover` fills the element and crops the video.                                                                                   |
| Minimum height               | Applies to `cover` only.                                                                                                                                                                           |
| Vertical / horizontal align  | Positions a `standard` or `stretch` video. Ignored for `cover`.                                                                                                                                    |
| Play automatically           | Also mutes the video, because browsers only autoplay muted videos.                                                                                                                                 |
| Play muted, Play in a loop   | Set `muted` and `loop`.                                                                                                                                                                            |
| Play inline on iOS devices   | Sets `playsinline`.                                                                                                                                                                                |
| Show controls                | Shows the native controls. Without them the whole element is a play/pause button with a play icon, operable by keyboard too.                                                                       |
| Load only after confirmation | Shows the cover image set for the video in the media module and loads nothing until playback starts. Turns autoplay off. Without a cover image, a `stretch` video keeps a 16:9 box until it loads. |
| Screen reader title          | Names the video, falling back to the media alt text (and title for the tooltip).                                                                                                                   |

Without controls, the button's name always says what it does: play or pause. The video's name is announced as its description. A video that cannot be loaded, for example in a format the browser does not play or with a missing file, shows an error in place of the play icon and names the button after the error.

The texts can be translated through `cmsTranslations`:

| Key                      | Default                                              |
| ------------------------ | ---------------------------------------------------- |
| `cms.video.playLabel`    | `Play video`                                         |
| `cms.video.pauseLabel`   | `Pause video`                                        |
| `cms.video.loadError`    | `The video could not be loaded.`                     |
| `cms.video.notSupported` | `Your browser does not support the HTML5 video tag.` |
