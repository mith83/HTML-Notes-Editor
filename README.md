# miniB-HTML-editor
Yet another fully featured WYSIWIG HTML editor...
by ColeNikol

A modern, feature-rich WYSIWYG HTML online editor that creates complete, standalone HTML documents. Built with Font Awesome, Tailwind CSS and vanilla JavaScript for maximum compatibility and performance.

## ✨ Features

### 🎨 **Rich Text Editing**
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1 through H6 with proper semantic markup
- **Lists**: Ordered and unordered lists
- **Alignment**: Left, center, right, and justify alignment
- **Colors**: Text color and background color pickers
- **Blockquotes**: Styled quote blocks

### 📎 **Content Insertion**
- **Links**: Insert links with custom text, new tab option, and rel attributes
- **Images**: Upload images or use external URLs with alt text and dimensions
- **Tables**: Create tables with customizable rows, columns, headers, and borders
- **Code Blocks**: Insert syntax-highlighted code with language selection

### 💾 **File Management**
- **Save HTML**: Generate standalone HTML documents with embedded CSS saved on server
- **Download**: Download generated HTML file
- **Open Files**: Load previously saved documents from server
- **Preview**: Preview documents in a new browser tab

### ⌨️ **Keyboard Shortcuts**
- `common keyboard shortcuts implemented for use

### 🧰 **Advanced Features**
- **Code Snippets Manager**: Add, edit, delete, filter, and copy code snippets for reuse. Snippets are stored in `assets/snippett.json` and can be managed from the toolbar or the admin panel.
- **Admin Panel**: Access `assets/admin.php` (password: `123`) to manage all code snippets and uploaded files. Add, edit, or delete snippets, view and delete uploaded files, delete by type, or empty the uploads folder (except `index.php`).
- **Improved Code Block Insertion**: Code blocks are always inserted at the caret position in the editor, never at the top. Each new code block is a separate block, not nested inside previous ones.
- **Dark Mode Enhancements**: All modal dialogs, buttons, and snippet lists have improved contrast and appearance in dark mode for better accessibility.
- **Uploads Management**: The admin panel allows you to preview, delete, or bulk-manage uploaded files in `assets/uploads`.

## 🚀 Installation

1. **Download** all files to your web server
2. **Ensure PHP is enabled** (for file operations and image uploads)
3. **Set permissions** for the `assets/uploads` directory (755 or 777)
4. **Open `index.php`** in your web browser

## 📁 File Structure

```
editor/
├── index.php          # Main editor interface
├── editor.js          # JavaScript functionality
├── editor.css         # Custom styles
├── save.php           # File saving and image upload
├── open.php           # File loading
├── assets/
    admin.php
│   └── uploads/       # Uploaded images
└── README.md          # This file
```

## 🎯 Usage

### Basic Editing
1. **Start typing** in the main editor area
2. **Use the toolbar** to format your text
3. **Select text** and apply formatting
4. **Use color pickers** to change text and background colors

### Code Snippets

1. Click the <i class="fas fa-scroll"></i> Snippets tab in the toolbar.
2. Add new snippets, filter or sort them, and click the copy icon to copy a snippet to your clipboard for pasting anywhere in the editor.
3. Snippets are saved in `assets/snippett.json` and can be managed from the admin panel as well.

### Admin Panel

1. Go to `assets/admin.php` and log in with password `123`.
2. Manage all code snippets and uploaded files from a single interface.
3. You can add, edit, or delete snippets, view and delete uploaded files, delete by type, or empty the uploads folder (except `index.php`).

### Inserting Content

#### Links
- Click the link button (🔗)
- Enter URL and optional text
- Choose to open in new tab
- Add rel attributes if needed

#### Images
- Click the image button 
- Upload an image or enter URL
- Add alt text for accessibility
- Set custom dimensions if needed

#### Tables
- Click the table button 
- Choose number of rows and columns
- Option to include header row
- Choose border styling

#### Code Blocks
- Click the code button 
- Select programming language
- Paste or type your code
- Code will be syntax-highlighted

### File Operations

#### Saving
- Click "Save" or use `Ctrl/Cmd + S`
- Choose filename and title
- Select "Complete HTML document" for standalone files
- Files are saved with embedded CSS styling

#### Opening
- Click "Open" or use `Ctrl/Cmd + O`
- Select from list of saved files
- Files load with proper formatting preserved

#### Preview
- Click "Preview" to see document in new tab
- Shows exactly how the saved HTML will look
- No need to save first

### HTML Mode
- Click "HTML" button to switch to code view
- Edit raw HTML directly
- Click "Update" to apply changes
- Click "Cancel" to discard changes

## 🎨 Generated HTML

When saving as a complete HTML document, the editor generates:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Document Title</title>
    <style>
        /* Embedded CSS for beautiful styling */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        /* ... more styles ... */
    </style>
</head>
<body>
    <!-- Your content here -->
</body>
</html>
```

## 🔧 Customization

### Styling
- Modify `editor.css` for custom editor styles
- Update Tailwind classes in `index.php`
- Customize the generated HTML CSS in `editor.js`

### Functionality
- Add new toolbar buttons in `index.php`
- Extend JavaScript functionality in `editor.js`
- Modify PHP backend in `save.php` and `open.php`

### Supported Languages for Code Blocks
- HTML, CSS, JavaScript
- PHP, Python, Java
- C++, C#, SQL
- Bash, JSON, XML
- Markdown, Plain Text

## 🌐 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## 🔒 Security Features

- **File type validation** for image uploads
- **File size limits** (5MB max for images)
- **Filename sanitization** for saved files
- **XSS protection** through proper HTML handling
- **Input validation** and sanitization

## 📱 Mobile Support

- **Responsive design** that works on all screen sizes
- **Touch-friendly** interface
- **Mobile-optimized** toolbar layout
- **Gesture support** for common actions

## 🚨 Troubleshooting

### Common Issues

1. **Images not uploading**
   - Check `assets/uploads` directory permissions (755 or 777)
   - Verify PHP file upload settings in `php.ini`
   - Check file size limits (max 5MB)

2. **Files not saving**
   - Ensure PHP is enabled on your server
   - Check directory write permissions
   - Verify file path is correct

3. **Styling issues**
   - Check if Tailwind CSS is loading properly
   - Verify `editor.css` is included
   - Clear browser cache

4. **Icons not showing**
   - Check internet connection for Font Awesome CDN
   - Try refreshing the page
   - Check browser console for errors

### Performance Tips

- **Large files**: Consider breaking content into smaller files
- **Images**: Optimize images before uploading
- **Auto-save**: Adjust the auto-save interval in `editor.js`
- **Browser**: Use modern browsers for best performance

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the editor.

## 🎉 What Makes This Editor Special

1. **Complete HTML Generation**: Creates standalone HTML files that work anywhere
2. **Modern Design**: Beautiful, responsive interface with Tailwind CSS
3. **Rich Features**: Tables, code blocks, image uploads, and more
4. **Keyboard Shortcuts**: Professional-grade shortcuts for power users
5. **Mobile Friendly**: Works perfectly on all devices
6. **No Dependencies**: Pure HTML, CSS, and JavaScript (except Tailwind CDN and Font Awesome)
7. **Easy to Customize**: Well-organized code for easy modification
8. **Production Ready**: Includes security features and error handling

---

**Start creating beautiful HTML content with your new professional editor!** 🚀 
