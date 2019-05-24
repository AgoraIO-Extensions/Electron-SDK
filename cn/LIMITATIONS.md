# ScreenShare Limitations

- videosourceStartScreenCaptureByWindow
  - Windows 10
    - when dpi is not 100%, the mouse cursor position could be different from original
    - this api does not work with Windows 10 App developed with Metro style, you will see black screen for these App when sharing
    
- videosourceStartScreenCaptureByScreen
  - Windows 10
    - when dpi is not 100%, the mouse cursor position could be different from original
    - when dpi is not 100%, the shared screen image could be cropped
