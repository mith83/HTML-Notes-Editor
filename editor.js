/*
MIT License

Copyright (c) 2025 ColeNikol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// ENFORCED POLICY: Only the specified modals (linkModal, imageModal) are used for inserting links and images. No prompt, alert, confirm, or legacy modal code is allowed for these actions. If this policy is violated, an error will be logged.
document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const htmlEditor = document.getElementById('htmlEditor');
    const htmlCode = document.getElementById('htmlCode');
    const showHtml = document.getElementById('showHtml');
    const updateContent = document.getElementById('updateContent');
    const cancelHtml = document.getElementById('cancelHtml');
    const saveFile = document.getElementById('saveFile');
    const openFile = document.getElementById('openFile');
    const previewFile = document.getElementById('previewFile');
    const textColorPicker = document.getElementById('textColor');
    const bgColorPicker = document.getElementById('bgColor');
    
    // Check if Font Awesome is loaded
    function checkFontAwesome() {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-check';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        document.body.appendChild(testIcon);
        
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        const content = computedStyle.getPropertyValue('content');
        
        document.body.removeChild(testIcon);
        
        // If Font Awesome is loaded, add class to body
        if (content && content !== 'none' && content !== 'normal') {
            document.body.classList.add('fontawesome-loaded');
        } else {
            document.body.classList.add('no-fontawesome');
        }
    }
    
    // Check Font Awesome after a short delay to ensure it's loaded
    setTimeout(checkFontAwesome, 1000);
    
    // Initialize editor with default content
    if (!editor.innerHTML.trim()) {
        editor.innerHTML = '<p>Welcome to miniB HTML Editor</p><p>Start typing your content here. Use the toolbar above to format your text, insert images, tables, and more.</p><p>You can save your work as a complete HTML document that can be opened in any web browser.</p>';
    }
    
    // Modal management functions
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    // Make closeModal globally available
    window.closeModal = closeModal;
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Toolbar button functionality
    document.querySelectorAll('.toolbar button[data-command]').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            // Remove active state from all buttons in the toolbar only
            this.closest('.toolbar').querySelectorAll('.toolbar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            if (command === 'createLink') {
                showLinkModal();
            } else if (command === 'insertImage') {
                showImageModal();
            } else if (command === 'insertTable') {
                showTableModal();
            } else if (command === 'insertCode') {
                showCodeModal();
            } else if (command === 'superscript' || command === 'subscript') {
                document.execCommand(command, false, null);
                editor.focus();
            } else if (["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"].includes(command)) {
                // If an image is selected, align the image instead of text
                if (selectedImg) {
                    let target = selectedImg.parentElement && selectedImg.parentElement.classList.contains('img-resize-wrapper') ? selectedImg.parentElement : selectedImg;
                    target.classList.remove('img-align-left', 'img-align-center', 'img-align-right');
                    if (command === 'justifyLeft') {
                        target.classList.add('img-align-left');
                    } else if (command === 'justifyCenter') {
                        target.classList.add('img-align-center');
                    } else if (command === 'justifyRight') {
                        target.classList.add('img-align-right');
                    }
                    editor.focus();
                } else {
                    document.execCommand(command, false, null);
                    editor.focus();
                }
            } else {
                // Add active state for formatting commands
                if (["bold", "italic", "underline", "strikeThrough"].includes(command)) {
                    this.classList.add('active');
                }
                document.execCommand(command, false, null);
                editor.focus();
            }
        });
    });
    
    // Format block dropdown
    document.querySelector('.toolbar select[data-command]').addEventListener('change', function() {
        const command = this.getAttribute('data-command');
        let value = this.value;
        const selection = window.getSelection();
        if (!value) return; // Ignore placeholder
        if (value === 'p') {
            // Try to convert heading to paragraph manually if needed
            if (selection.rangeCount > 0) {
                let range = selection.getRangeAt(0);
                let node = range.startContainer;
                // Find the closest block element
                while (node && node !== editor && !(node.nodeType === 1 && /^H[1-6]$/i.test(node.tagName))) {
                    node = node.parentNode;
                }
                if (node && /^H[1-6]$/i.test(node.tagName)) {
                    // Replace heading with <p>
                    const p = document.createElement('p');
                    p.innerHTML = node.innerHTML;
                    node.parentNode.replaceChild(p, node);
                    // Move caret to new <p>
                    range = document.createRange();
                    range.selectNodeContents(p);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    editor.focus();
                } else {
                    document.execCommand(command, false, 'P');
                    editor.focus();
                }
            }
        } else {
            document.execCommand(command, false, value);
            editor.focus();
        }
        // Reset dropdown to the placeholder
        setTimeout(() => {
            this.value = '';
        }, 0);
    });
    
    // Text color picker
    textColorPicker.addEventListener('input', function() {
        document.execCommand('foreColor', false, this.value);
        editor.focus();
    });
    
    // Background color picker
    bgColorPicker.addEventListener('change', function() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                const span = document.createElement('span');
                span.style.backgroundColor = this.value;
                range.surroundContents(span);
            }
        }
        editor.focus();
    });
    
    // Show HTML editor
    showHtml.addEventListener('click', function() {
        htmlCode.value = editor.innerHTML;
        editor.style.display = 'none';
        htmlEditor.classList.remove('hidden');
        htmlEditor.classList.add('block');
        htmlCode.focus();
    });
    
    // Update content from HTML editor
    updateContent.addEventListener('click', function() {
        editor.innerHTML = htmlCode.value;
        editor.style.display = 'block';
        htmlEditor.classList.add('hidden');
        htmlEditor.classList.remove('block');
        editor.focus();
    });
    
    // Cancel HTML editing
    cancelHtml.addEventListener('click', function() {
        editor.style.display = 'block';
        htmlEditor.classList.add('hidden');
        htmlEditor.classList.remove('block');
        editor.focus();
    });
    
    // Save file functionality
    saveFile.addEventListener('click', function() {
        const content = editor.innerHTML;
        const defaultFilename = 'document_' + new Date().toISOString().slice(0, 10);
        
        document.getElementById('saveFilename').value = defaultFilename;
        document.getElementById('saveTitle').value = 'My Document';
        document.getElementById('saveComplete').checked = true;
        
        showModal('saveModal');
    });
    
    // Confirm save
    document.getElementById('confirmSave').addEventListener('click', function() {
        const filename = document.getElementById('saveFilename').value.trim();
        const title = document.getElementById('saveTitle').value.trim();
        const saveComplete = document.getElementById('saveComplete').checked;
        const content = editor.innerHTML;
        
        if (!filename) {
            showNotification('Please enter a filename', 'error');
            return;
        }
        
        this.classList.add('loading');
        this.disabled = true;
        
        let htmlContent;
        if (saveComplete) {
            htmlContent = generateCompleteHTML(content, title);
        } else {
            htmlContent = content;
        }
        
            fetch('save.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            body: `filename=${encodeURIComponent(filename)}&content=${encodeURIComponent(htmlContent)}&title=${encodeURIComponent(title)}&complete=${saveComplete ? '1' : '0'}`
            })
            .then(response => response.text())
            .then(data => {
            showNotification(data, 'success');
            closeModal('saveModal');
            })
            .catch(error => {
                console.error('Error:', error);
            showNotification('Error saving file', 'error');
        })
        .finally(() => {
            this.classList.remove('loading');
            this.disabled = false;
        });
    });
    
    // Generate complete HTML document
    function generateCompleteHTML(content, title) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Document'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2d3748;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 { font-size: 2.25rem; }
        h2 { font-size: 1.875rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        h5 { font-size: 1.125rem; }
        h6 { font-size: 1rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.25rem; }
        a { color: #3182ce; text-decoration: underline; }
        a:hover { color: #2c5aa0; }
        img { max-width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 1rem 0; }
        blockquote {
            border-left: 4px solid #3182ce;
            padding-left: 1rem;
            font-style: italic;
            color: #4a5568;
            background-color: #f7fafc;
            padding: 1rem;
            margin: 1rem 0;
        }
        code {
            background-color: #f7fafc;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
        }
        pre {
            background-color: #2d3748;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
        }
        pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 0.75rem;
            text-align: left;
        }
        th {
            background-color: #f7fafc;
            font-weight: 600;
        }
        hr {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
    }
    
    // Open file functionality
    openFile.addEventListener('click', function() {
        this.classList.add('loading');
        this.disabled = true;
        
        fetch('open.php?action=list')
            .then(response => response.json())
            .then(files => {
                const fileList = document.getElementById('fileList');
                fileList.innerHTML = '';
                
                if (files.length === 0) {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No files found';
                    fileList.appendChild(option);
                } else {
                    files.forEach(file => {
                        const option = document.createElement('option');
                        option.value = file;
                        option.textContent = file;
                        fileList.appendChild(option);
                    });
                }
                
                showModal('fileModal');
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error loading file list', 'error');
            })
            .finally(() => {
                this.classList.remove('loading');
                this.disabled = false;
            });
    });
    
    // Load selected file
    document.getElementById('loadFile').addEventListener('click', function() {
        const filename = document.getElementById('fileList').value;
        
        if (filename) {
            this.classList.add('loading');
            this.disabled = true;
            
            fetch('open.php?action=load&filename=' + encodeURIComponent(filename))
                .then(response => response.text())
                .then(content => {
                    // Extract content from complete HTML if needed
                    if (content.includes('<!DOCTYPE html>')) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, 'text/html');
                        const bodyContent = doc.body.innerHTML;
                        editor.innerHTML = bodyContent;
                    } else {
                    editor.innerHTML = content;
                    }
                    
                    closeModal('fileModal');
                    showNotification('File loaded successfully', 'success');
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Error loading file', 'error');
                })
                .finally(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                });
        }
    });
    
    // Preview functionality
    previewFile.addEventListener('click', function() {
        let content = editor.innerHTML;
        // Fix image src for preview: convert relative src to absolute using /assets/uploads/
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        tempDiv.querySelectorAll('img').forEach(img => {
            let src = img.getAttribute('src');
            // If src is not absolute, make it absolute using window.location.origin
            if (src && !src.match(/^https?:\/\//)) {
                if (src.startsWith('/')) {
                    img.src = window.location.origin + src;
                } else {
                    // For relative paths, add current path
                    img.src = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + src;
                }
                console.log('[Preview Debug] Absolute img src:', img.src);
            } else {
                console.log('[Preview Debug] Already absolute img src:', img.src);
            }
        });
        console.log('[Preview Debug] Final preview HTML:', tempDiv.innerHTML);
        content = tempDiv.innerHTML;
        const title = 'Document Preview';
        const completeHTML = generateCompleteHTML(content, title);
        const blob = new Blob([completeHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    });
    
    // Modal functions
    function showLinkModal() {
        const selection = window.getSelection();
        // Save the current range for later restoration
        if (selection.rangeCount > 0) {
            savedLinkRange = selection.getRangeAt(0).cloneRange();
        } else {
            savedLinkRange = null;
        }
        const linkText = selection.toString();
        const linkTextInput = document.getElementById('linkText');
        const linkUrlInput = document.getElementById('linkUrl');
        const linkNewTab = document.getElementById('linkNewTab');
        if (linkTextInput) linkTextInput.value = linkText;
        if (linkUrlInput) linkUrlInput.value = '';
        if (linkNewTab) linkNewTab.checked = false;
        const relNoopener = document.getElementById('relNoopener');
        const relNoreferrer = document.getElementById('relNoreferrer');
        const relNofollow = document.getElementById('relNofollow');
        const relUgc = document.getElementById('relUgc');
        const relSponsored = document.getElementById('relSponsored');
        if (relNoopener) relNoopener.checked = false;
        if (relNoreferrer) relNoreferrer.checked = false;
        if (relNofollow) relNofollow.checked = false;
        if (relUgc) relUgc.checked = false;
        if (relSponsored) relSponsored.checked = false;
        showModal('linkModal');
        if (linkUrlInput) linkUrlInput.focus();
    }
    
    // Add this variable at the top-level scope (inside DOMContentLoaded)
    let savedImageRange = null;
    function showImageModal() {
        // Save the current range for later restoration
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            savedImageRange = selection.getRangeAt(0).cloneRange();
        } else {
            savedImageRange = null;
        }
        const imageUpload = document.getElementById('imageUpload');
        const imageUrl = document.getElementById('imageUrl');
        const imageAlt = document.getElementById('imageAlt');
        const imageWidth = document.getElementById('imageWidth');
        const imageHeight = document.getElementById('imageHeight');
        if (imageUpload) imageUpload.value = '';
        if (imageUrl) imageUrl.value = '';
        if (imageAlt) imageAlt.value = '';
        if (imageWidth) imageWidth.value = '';
        if (imageHeight) imageHeight.value = '';
        showModal('imageModal');
    }
    
    function showTableModal() {
        document.getElementById('tableRows').value = '3';
        document.getElementById('tableCols').value = '3';
        document.getElementById('tableHeader').checked = true;
        document.getElementById('tableBorder').checked = true;
        
        showModal('tableModal');
    }
    
    let savedCodeRange = null;
    function showCodeModal() {
        document.getElementById('codeContent').value = '';
        document.getElementById('codeLanguage').value = 'html';
        // Save the current selection if it's inside the editor
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            let container = range.commonAncestorContainer;
            while (container && container !== editor) {
                container = container.parentNode;
            }
            if (container === editor) {
                savedCodeRange = range.cloneRange();
            } else {
                savedCodeRange = null;
            }
        } else {
            savedCodeRange = null;
        }
        showModal('codeModal');
        document.getElementById('codeContent').focus();
    }
    
    // Insert link
    document.getElementById('insertLink').addEventListener('click', function() {
        const url = document.getElementById('linkUrl').value.trim();
        const text = document.getElementById('linkText').value.trim();
        const newTab = document.getElementById('linkNewTab').checked;
        // Collect checked rel attributes
        const rels = [];
        const relNoopener = document.getElementById('relNoopener');
        const relNoreferrer = document.getElementById('relNoreferrer');
        const relNofollow = document.getElementById('relNofollow');
        const relUgc = document.getElementById('relUgc');
        const relSponsored = document.getElementById('relSponsored');
        if (relNoopener && relNoopener.checked) rels.push('noopener');
        if (relNoreferrer && relNoreferrer.checked) rels.push('noreferrer');
        if (relNofollow && relNofollow.checked) rels.push('nofollow');
        if (relUgc && relUgc.checked) rels.push('ugc');
        if (relSponsored && relSponsored.checked) rels.push('sponsored');
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = text || url;
            if (newTab) {
                link.target = '_blank';
            }
            if (rels.length > 0) {
                link.rel = rels.join(' ');
            }
            // Restore the saved selection before inserting
            if (savedLinkRange) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(savedLinkRange);
            }
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (!range.collapsed) {
                    range.deleteContents();
                }
                range.insertNode(link);
            }
            closeModal('linkModal');
            editor.focus();
            savedLinkRange = null;
        }
    });
    
    // Insert image
    document.getElementById('insertImageBtn').addEventListener('click', function() {
        const imageUrl = document.getElementById('imageUrl').value.trim();
        const imageUpload = document.getElementById('imageUpload').files[0];
        const altText = document.getElementById('imageAlt').value.trim();
        const width = document.getElementById('imageWidth').value.trim();
        const height = document.getElementById('imageHeight').value.trim();
        // Restore the saved selection before inserting
        if (savedImageRange) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedImageRange);
        }
        if (imageUpload) {
            // Handle file upload
            const formData = new FormData();
            formData.append('image', imageUpload);
            fetch('save.php?action=upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    insertImage(data.url, altText, width, height);
                } else {
                    showNotification('Upload failed: ' + data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Upload failed', 'error');
            });
        } else if (imageUrl) {
            insertImage(imageUrl, altText, width, height);
        }
        savedImageRange = null;
    });
    
    function insertImage(src, alt, width, height) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || '';
        if (width) img.width = width;
        if (height) img.height = height;
        img.className = 'max-w-full h-auto rounded-lg shadow-md my-4 border border-gray-200';
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
        }
        
        closeModal('imageModal');
        editor.focus();
    }
    
    // Insert table
    document.getElementById('insertTableBtn').addEventListener('click', function() {
        const rows = parseInt(document.getElementById('tableRows').value);
        const cols = parseInt(document.getElementById('tableCols').value);
        const hasHeader = document.getElementById('tableHeader').checked;
        const hasBorder = document.getElementById('tableBorder').checked;
        
        if (rows > 0 && cols > 0) {
            const table = document.createElement('table');
            if (hasBorder) {
                table.style.border = '1px solid #e2e8f0';
                table.style.borderCollapse = 'collapse';
            }
            
            // Create header row if needed
            if (hasHeader) {
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                
                for (let i = 0; i < cols; i++) {
                    const th = document.createElement('th');
                    th.textContent = `Header ${i + 1}`;
                    th.style.padding = '0.75rem';
                    th.style.textAlign = 'left';
                    if (hasBorder) {
                        th.style.border = '1px solid #e2e8f0';
                        th.style.backgroundColor = '#f7fafc';
                    }
                    headerRow.appendChild(th);
                }
                
                thead.appendChild(headerRow);
                table.appendChild(thead);
            }
            
            // Create body rows
            const tbody = document.createElement('tbody');
            const startRow = hasHeader ? 0 : 1;
            
            for (let i = startRow; i < rows; i++) {
                const row = document.createElement('tr');
                
                for (let j = 0; j < cols; j++) {
                    const cell = document.createElement('td');
                    cell.textContent = `Cell ${i + 1}-${j + 1}`;
                    cell.style.padding = '0.75rem';
                    if (hasBorder) {
                        cell.style.border = '1px solid #e2e8f0';
                    }
                    row.appendChild(cell);
                }
                
                tbody.appendChild(row);
            }
            
            table.appendChild(tbody);
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(table);
            }
            
            closeModal('tableModal');
            editor.focus();
        }
    });
    
    // Insert code
    document.getElementById('insertCodeBtn').addEventListener('click', function() {
        const codeContent = document.getElementById('codeContent').value.trim();
        const language = document.getElementById('codeLanguage').value.trim();
        if (codeContent) {
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            if (language) {
                code.className = `language-${language}`;
            }
            code.textContent = codeContent;
            pre.appendChild(code);
            pre.className = 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4';
            let inserted = false;
            // Restore the saved selection if available
            if (savedCodeRange) {
                editor.focus();
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(savedCodeRange);
                const range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(pre);
                // Move caret after the inserted code block
                range.setStartAfter(pre);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                inserted = true;
                savedCodeRange = null;
            }
            if (!inserted) {
                editor.appendChild(pre);
            }
            closeModal('codeModal');
            editor.focus();
        }
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Mentions/autocomplete logic
    const mentionDropdown = document.getElementById('mentionDropdown');
    const mentionUsers = [
        { label: 'Alice', value: 'alice' },
        { label: 'Bob', value: 'bob' },
        { label: 'Carol', value: 'carol' },
        { label: 'Dave', value: 'dave' }
    ];
    const mentionTags = [
        { label: '#news', value: 'news' },
        { label: '#update', value: 'update' },
        { label: '#feature', value: 'feature' },
        { label: '#bug', value: 'bug' }
    ];
    let mentionActive = false;
    let mentionType = null;
    let mentionQuery = '';
    let mentionStartRange = null;
    let mentionItems = [];
    let mentionIndex = 0;

    function getCaretRect() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return null;
        const range = sel.getRangeAt(0).cloneRange();
        if (range.getClientRects) {
            range.collapse(false);
            const rects = range.getClientRects();
            if (rects.length > 0) return rects[0];
        }
        return null;
    }

    function showMentionDropdown(items) {
        mentionDropdown.innerHTML = '';
        items.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'mention-item' + (i === mentionIndex ? ' active' : '');
            div.textContent = item.label;
            div.addEventListener('mousedown', function(e) {
                e.preventDefault();
                insertMention(items[i]);
            });
            mentionDropdown.appendChild(div);
        });
        mentionDropdown.classList.remove('hidden');
        // Position dropdown near caret
        const rect = getCaretRect();
        if (rect) {
            mentionDropdown.style.left = rect.left + window.scrollX + 'px';
            mentionDropdown.style.top = rect.bottom + window.scrollY + 'px';
        } else {
            mentionDropdown.style.left = '20px';
            mentionDropdown.style.top = '20px';
        }
    }

    function hideMentionDropdown() {
        mentionDropdown.classList.add('hidden');
        mentionDropdown.innerHTML = '';
        mentionActive = false;
        mentionType = null;
        mentionQuery = '';
        mentionStartRange = null;
        mentionItems = [];
        mentionIndex = 0;
    }

    function insertMention(item) {
        if (!mentionStartRange) return;
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(mentionStartRange);
        let span;
        if (mentionType === '@') {
            span = document.createElement('span');
            span.className = 'mention';
            span.textContent = '@' + item.label;
            span.contentEditable = 'false';
        } else if (mentionType === '#') {
            span = document.createElement('span');
            span.className = 'tag';
            span.textContent = '#' + item.value;
            span.contentEditable = 'false';
        }
        if (span) {
            mentionStartRange.deleteContents();
            mentionStartRange.insertNode(span);
            // Move caret after the inserted span
            const range = document.createRange();
            range.setStartAfter(span);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        hideMentionDropdown();
        editor.focus();
    }

    editor.addEventListener('keydown', function(e) {
        if (mentionActive) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                mentionIndex = (mentionIndex + 1) % mentionItems.length;
                showMentionDropdown(mentionItems);
                return;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                mentionIndex = (mentionIndex - 1 + mentionItems.length) % mentionItems.length;
                showMentionDropdown(mentionItems);
                return;
            } else if (e.key === 'Enter') {
                e.preventDefault();
                insertMention(mentionItems[mentionIndex]);
                return;
            } else if (e.key === 'Escape') {
                hideMentionDropdown();
                return;
            } else if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
                // Update query
                setTimeout(() => {
                    const sel = window.getSelection();
                    if (!sel.rangeCount) return hideMentionDropdown();
                    const range = sel.getRangeAt(0);
                    const text = range.startContainer.textContent || '';
                    const before = text.slice(0, range.startOffset);
                    const match = before.match(/([@#])(\w*)$/);
                    if (match) {
                        mentionType = match[1];
                        mentionQuery = match[2];
                        let items = mentionType === '@' ? mentionUsers : mentionTags;
                        if (mentionQuery) {
                            items = items.filter(item => item.label.toLowerCase().includes(mentionQuery.toLowerCase()));
                        }
                        mentionItems = items;
                        mentionIndex = 0;
                        if (items.length) {
                            showMentionDropdown(items);
                        } else {
                            hideMentionDropdown();
                        }
                    } else {
                        hideMentionDropdown();
                    }
                }, 0);
                return;
            }
        } else {
            if (e.key === '@' || e.key === '#') {
                setTimeout(() => {
                    const sel = window.getSelection();
                    if (!sel.rangeCount) return;
                    const range = sel.getRangeAt(0).cloneRange();
                    mentionStartRange = range.cloneRange();
                    mentionType = e.key;
                    mentionQuery = '';
                    mentionActive = true;
                    mentionItems = e.key === '@' ? mentionUsers : mentionTags;
                    mentionIndex = 0;
                    showMentionDropdown(mentionItems);
                }, 0);
            }
        }
    });
    // Hide dropdown on blur
    editor.addEventListener('blur', function() {
        setTimeout(hideMentionDropdown, 100);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    document.execCommand('bold', false, null);
                    break;
                case 'i':
                    e.preventDefault();
                    document.execCommand('italic', false, null);
                    break;
                case 'u':
                    e.preventDefault();
                    document.execCommand('underline', false, null);
                    break;
                case 's':
                    e.preventDefault();
                    if (e.shiftKey) {
                        document.execCommand('strikeThrough', false, null);
                    } else {
                        saveFile.click();
                    }
                    break;
                case 'o':
                    e.preventDefault();
                    openFile.click();
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        document.execCommand('redo', false, null);
                    } else {
                        document.execCommand('undo', false, null);
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    document.execCommand('redo', false, null);
                    break;
            }
        }
    });
    
    // Auto-save functionality
    let autoSaveTimeout;
    editor.addEventListener('input', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            // Auto-save logic could be implemented here
            console.log('Content changed, auto-save would trigger here');
        }, 5000); // Auto-save after 5 seconds of inactivity
    });
    
    // Clean paste handler for editor
    editor.addEventListener('paste', function(e) {
        e.preventDefault();
        let html = '';
        if (e.clipboardData && e.clipboardData.getData) {
            html = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
        } else if (window.clipboardData && window.clipboardData.getData) {
            html = window.clipboardData.getData('Text');
        }
        if (!html) return;
        // Create a temp div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        // Remove unwanted tags and attributes
        function clean(node) {
            // Remove script/style tags
            if (node.nodeType === 1 && ['SCRIPT', 'STYLE'].includes(node.nodeName)) {
                node.remove();
                return;
            }
            // Remove class and style attributes
            if (node.nodeType === 1) {
                node.removeAttribute('class');
                node.removeAttribute('style');
                // Remove all event handler attributes
                Array.from(node.attributes).forEach(attr => {
                    if (attr.name.startsWith('on')) node.removeAttribute(attr.name);
                });
            }
            // Recursively clean children
            Array.from(node.childNodes).forEach(clean);
        }
        Array.from(tempDiv.childNodes).forEach(clean);
        // Insert cleaned HTML
        document.execCommand('insertHTML', false, tempDiv.innerHTML);
    });
    
    // Placeholder logic for editor
    function updateEditorPlaceholder() {
        if (editor.innerHTML.trim() === '' || editor.innerHTML === '<br>') {
            editor.classList.add('editor-placeholder');
            editor.setAttribute('data-has-placeholder', 'true');
            editor.innerHTML = '';
        } else {
            editor.classList.remove('editor-placeholder');
            editor.setAttribute('data-has-placeholder', 'false');
        }
    }
    // Show placeholder on load if empty
    updateEditorPlaceholder();
    // Update placeholder on input
    editor.addEventListener('input', updateEditorPlaceholder);
    // Update placeholder on blur (in case of manual HTML changes)
    editor.addEventListener('blur', updateEditorPlaceholder);
    
    // Initialize editor focus
    editor.focus();

    // Modal close and cancel button event listeners
    const modalCloseMap = [
        { closeId: 'closeLinkModal', cancelId: 'cancelLinkModal', modalId: 'linkModal' },
        { closeId: 'closeImageModal', cancelId: 'cancelImageModal', modalId: 'imageModal' },
        { closeId: 'closeTableModal', cancelId: 'cancelTableModal', modalId: 'tableModal' },
        { closeId: 'closeCodeModal', cancelId: 'cancelCodeModal', modalId: 'codeModal' },
        { closeId: 'closeFileModal', cancelId: 'cancelFileModal', modalId: 'fileModal' },
        { closeId: 'closeSaveModal', cancelId: 'cancelSaveModal', modalId: 'saveModal' }
    ];
    modalCloseMap.forEach(({ closeId, cancelId, modalId }) => {
        const closeBtn = document.getElementById(closeId);
        const cancelBtn = document.getElementById(cancelId);
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modalId);
                editor.focus();
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                closeModal(modalId);
                editor.focus();
            });
        }
    });

    // Drag & drop image upload for editor
    editor.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        editor.classList.add('drag-over');
    });
    editor.addEventListener('dragleave', function(e) {
        editor.classList.remove('drag-over');
    });
    editor.addEventListener('drop', function(e) {
        e.preventDefault();
        editor.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        if (!files.length) return;
        const imageFile = files.find(f => f.type.startsWith('image/'));
        if (!imageFile) {
            showNotification('Only image files can be dropped.', 'error');
            return;
        }
        const formData = new FormData();
        formData.append('image', imageFile);
        fetch('save.php?action=upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Insert image at drop position
                const img = document.createElement('img');
                img.src = data.url;
                img.alt = imageFile.name;
                img.className = 'max-w-full h-auto rounded-lg shadow-md my-4 border border-gray-200';
                // Insert at caret position
                const range = document.caretRangeFromPoint(e.clientX, e.clientY) || window.getSelection().getRangeAt(0);
                range.insertNode(img);
                showNotification('Image uploaded and inserted!', 'success');
            } else {
                showNotification('Upload failed: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Upload failed', 'error');
        });
    });

    // Table editing toolbar logic
    const tableToolbar = document.getElementById('tableToolbar');
    let currentCell = null;
    function showTableToolbar(cell) {
        if (!cell) return hideTableToolbar();
        currentCell = cell;
        const rect = cell.getBoundingClientRect();
        tableToolbar.style.left = (rect.left + window.scrollX) + 'px';
        tableToolbar.style.top = (rect.top + window.scrollY - tableToolbar.offsetHeight - 8) + 'px';
        tableToolbar.classList.remove('hidden');
    }
    function hideTableToolbar() {
        tableToolbar.classList.add('hidden');
        currentCell = null;
    }
    // Show toolbar on cell focus/click
    editor.addEventListener('mousedown', function(e) {
        const cell = e.target.closest('td,th');
        if (cell && editor.contains(cell)) {
            setTimeout(() => showTableToolbar(cell), 0);
        } else {
            hideTableToolbar();
        }
    });
    editor.addEventListener('keyup', function(e) {
        const sel = window.getSelection();
        if (sel.rangeCount) {
            const node = sel.anchorNode;
            const cell = node && node.nodeType === 1 ? node.closest('td,th') : node && node.parentElement ? node.parentElement.closest('td,th') : null;
            if (cell && editor.contains(cell)) {
                showTableToolbar(cell);
            } else {
                hideTableToolbar();
            }
        }
    });
    // Hide toolbar on blur
    editor.addEventListener('blur', function() {
        setTimeout(hideTableToolbar, 100);
    });
    // Table actions
    function getCellInfo(cell) {
        const row = cell.parentElement;
        const table = row.closest('table');
        const rowIndex = Array.from(table.rows).indexOf(row);
        const cellIndex = Array.from(row.cells).indexOf(cell);
        return { table, row, rowIndex, cellIndex };
    }
    document.getElementById('addRowAbove').addEventListener('click', function() {
        if (!currentCell) return;
        const { table, row, rowIndex } = getCellInfo(currentCell);
        const newRow = row.cloneNode(true);
        Array.from(newRow.cells).forEach(cell => cell.innerHTML = '');
        table.tBodies[0].insertBefore(newRow, table.rows[rowIndex]);
        hideTableToolbar();
    });
    document.getElementById('addRowBelow').addEventListener('click', function() {
        if (!currentCell) return;
        const { table, row, rowIndex } = getCellInfo(currentCell);
        const newRow = row.cloneNode(true);
        Array.from(newRow.cells).forEach(cell => cell.innerHTML = '');
        if (row.nextSibling) {
            table.tBodies[0].insertBefore(newRow, row.nextSibling);
        } else {
            table.tBodies[0].appendChild(newRow);
        }
        hideTableToolbar();
    });
    document.getElementById('removeRow').addEventListener('click', function() {
        if (!currentCell) return;
        const { table, row } = getCellInfo(currentCell);
        if (table.rows.length > 1) {
            row.parentElement.removeChild(row);
        }
        hideTableToolbar();
    });
    document.getElementById('addColLeft').addEventListener('click', function() {
        if (!currentCell) return;
        const { table, cellIndex } = getCellInfo(currentCell);
        Array.from(table.rows).forEach(row => {
            const newCell = row.cells[0].cloneNode(true);
            newCell.innerHTML = '';
            row.insertBefore(newCell, row.cells[cellIndex]);
        });
        hideTableToolbar();
    });
    document.getElementById('addColRight').addEventListener('click', function() {
        if (!currentCell) return;
        const { table, cellIndex } = getCellInfo(currentCell);
        Array.from(table.rows).forEach(row => {
            const newCell = row.cells[0].cloneNode(true);
            newCell.innerHTML = '';
            if (row.cells[cellIndex].nextSibling) {
                row.insertBefore(newCell, row.cells[cellIndex].nextSibling);
            } else {
                row.appendChild(newCell);
            }
        });
        hideTableToolbar();
    });
    document.getElementById('removeCol').addEventListener('click', function() {
        if (!currentCell) return;
        const { table, cellIndex } = getCellInfo(currentCell);
        Array.from(table.rows).forEach(row => {
            if (row.cells.length > 1) {
                row.removeChild(row.cells[cellIndex]);
            }
        });
        hideTableToolbar();
    });

    // Dark mode toggle logic
    const darkModeBtn = document.getElementById('toggleDarkMode');
    function setDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('editor-dark-mode', '1');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('editor-dark-mode', '0');
        }
    }
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            setDarkMode(!document.body.classList.contains('dark-mode'));
        });
    }
    // On load, apply saved preference
    if (localStorage.getItem('editor-dark-mode') === '1') {
        setDarkMode(true);
    }

    // Code lock/test: Prevent any prompt/alert/confirm for link/image insertion
    const originalPrompt = window.prompt;
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    window.prompt = function(msg, def) {
        if (msg && /link|image|url|img/i.test(msg)) {
            console.error('ENFORCED POLICY VIOLATION: prompt() called for link/image insertion. Use only the specified modals.');
        }
        return originalPrompt.apply(this, arguments);
    };
    window.alert = function(msg) {
        if (msg && /link|image|url|img/i.test(msg)) {
            console.error('ENFORCED POLICY VIOLATION: alert() called for link/image insertion. Use only the specified modals.');
        }
        return originalAlert.apply(this, arguments);
    };
    window.confirm = function(msg) {
        if (msg && /link|image|url|img/i.test(msg)) {
            console.error('ENFORCED POLICY VIOLATION: confirm() called for link/image insertion. Use only the specified modals.');
        }
        return originalConfirm.apply(this, arguments);
    };

    document.getElementById('downloadFile').addEventListener('click', function() {
        const content = editor.innerHTML;
        const title = 'Document';
        const completeHTML = generateCompleteHTML(content, title);
        const blob = new Blob([completeHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Drag & drop for image modal
    const imageDropArea = document.getElementById('imageDropArea');
    const imageUploadInput = document.getElementById('imageUpload');
    const imageDropText = document.getElementById('imageDropText');
    if (imageDropArea && imageUploadInput) {
        imageDropArea.addEventListener('click', function() {
            imageUploadInput.click();
        });
        imageDropArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            imageDropArea.classList.add('bg-blue-50', 'border-blue-400');
        });
        imageDropArea.addEventListener('dragleave', function(e) {
            imageDropArea.classList.remove('bg-blue-50', 'border-blue-400');
        });
        imageDropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            imageDropArea.classList.remove('bg-blue-50', 'border-blue-400');
            const files = Array.from(e.dataTransfer.files);
            if (!files.length) return;
            const imageFile = files.find(f => f.type.startsWith('image/'));
            if (!imageFile) {
                showNotification('Only image files can be dropped.', 'error');
                return;
            }
            // Set the file input for consistency
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(imageFile);
            imageUploadInput.files = dataTransfer.files;
            // Optionally update the drop text
            if (imageDropText) imageDropText.textContent = imageFile.name;
        });
        imageUploadInput.addEventListener('change', function() {
            if (imageUploadInput.files.length > 0) {
                if (imageDropText) imageDropText.textContent = imageUploadInput.files[0].name;
            } else {
                if (imageDropText) imageDropText.textContent = 'Drag & drop an image here, or click to select';
            }
        });
    }

    // === Code Snippets Modal Logic ===
    const openSnippetsBtn = document.getElementById('openSnippets');
    const snippetsModal = document.getElementById('snippetsModal');
    const closeSnippetsModal = document.getElementById('closeSnippetsModal');
    const addSnippetBtn = document.getElementById('addSnippetBtn');
    const snippetNameInput = document.getElementById('snippetName');
    const snippetCodeInput = document.getElementById('snippetCode');
    const snippetsList = document.getElementById('snippetsList');
    const filterSnippetInput = document.getElementById('filterSnippet');
    const sortAscBtn = document.getElementById('sortAsc');
    const sortDescBtn = document.getElementById('sortDesc');
    let snippets = [];
    let sortAsc = true;
    let filterText = '';

    function fetchSnippets() {
        fetch('assets/snippet.php?action=read')
            .then(r => r.json())
            .then(data => {
                snippets = Array.isArray(data) ? data : [];
                renderSnippets();
            })
            .catch(() => { snippets = []; renderSnippets(); });
    }
    function saveSnippets() {
        fetch('assets/snippet.php?action=write', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snippets)
        })
        .then(() => fetchSnippets());
    }
    function renderSnippets() {
        let filtered = snippets.filter(s => s.name.toLowerCase().includes(filterText.toLowerCase()));
        filtered.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        snippetsList.innerHTML = '';
        if (!filtered.length) {
            snippetsList.innerHTML = '<div class="text-gray-400 text-sm">No snippets found.</div>';
            return;
        }
        filtered.forEach((snippet, idx) => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between gap-2 border-b py-1';
            div.innerHTML = `<span class=\"font-mono text-xs flex-1\">${snippet.name}</span>` +
                `<button class=\"modal-btn-secondary copy-snippet p-1\" data-idx=\"${snippets.indexOf(snippet)}\" title=\"Copy\" aria-label=\"Copy\"><i class=\"fas fa-copy fa-sm\"></i></button>`;
            snippetsList.appendChild(div);
        });
        snippetsList.querySelectorAll('.copy-snippet').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                copySnippet(snippets[idx]);
            });
        });
    }
    function insertSnippet(snippet) {
        if (!snippet) return;
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = snippet.code;
        pre.appendChild(code);
        pre.className = 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4';
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(pre);
        }
        editor.focus();
    }
    function copySnippet(snippet) {
        if (!snippet) return;
        navigator.clipboard.writeText(snippet.code).then(function() {
            showNotification('Snippet copied to clipboard', 'success');
        }, function() {
            showNotification('Failed to copy snippet', 'error');
        });
    }
    openSnippetsBtn.addEventListener('click', function() {
        snippetNameInput.value = '';
        snippetCodeInput.value = '';
        filterSnippetInput.value = '';
        sortAsc = true;
        filterText = '';
        fetchSnippets();
        showModal('snippetsModal');
    });
    closeSnippetsModal.addEventListener('click', function() {
        closeModal('snippetsModal');
    });
    addSnippetBtn.addEventListener('click', function() {
        const name = snippetNameInput.value.trim();
        const code = snippetCodeInput.value;
        if (!name) { showNotification('Snippet name required', 'error'); return; }
        if (!code) { showNotification('Snippet code required', 'error'); return; }
        if (snippets.some(s => s.name === name)) {
            showNotification('Snippet name must be unique', 'error'); return;
        }
        snippets.push({ name, code });
        saveSnippets();
        snippetNameInput.value = '';
        snippetCodeInput.value = '';
    });
    filterSnippetInput.addEventListener('input', function() {
        filterText = this.value;
        renderSnippets();
    });
    sortAscBtn.addEventListener('click', function() {
        sortAsc = true;
        renderSnippets();
    });
    sortDescBtn.addEventListener('click', function() {
        sortAsc = false;
        renderSnippets();
    });

    let selectedImg = null;
    let imgResizeWrapper = null;
    let imgAspectRatio = 1;
    let isShiftResizing = false;
    editor.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            selectedImg = e.target;
            // Store aspect ratio
            imgAspectRatio = (selectedImg.naturalWidth || selectedImg.width || 1) / (selectedImg.naturalHeight || selectedImg.height || 1);
            // Wrap image in a resizable div
            if (!selectedImg.parentElement.classList.contains('img-resize-wrapper')) {
                imgResizeWrapper = document.createElement('div');
                imgResizeWrapper.contentEditable = false;
                imgResizeWrapper.className = 'img-resize-wrapper';
                imgResizeWrapper.style.display = 'inline-block';
                imgResizeWrapper.style.position = 'relative';
                imgResizeWrapper.style.resize = 'both';
                imgResizeWrapper.style.overflow = 'auto';
                imgResizeWrapper.style.minWidth = '40px';
                imgResizeWrapper.style.minHeight = '40px';
                imgResizeWrapper.style.maxWidth = '100%';
                imgResizeWrapper.style.maxHeight = '600px';
                selectedImg.parentNode.insertBefore(imgResizeWrapper, selectedImg);
                imgResizeWrapper.appendChild(selectedImg);
                // Set wrapper size to image size
                imgResizeWrapper.style.width = selectedImg.width ? selectedImg.width + 'px' : selectedImg.offsetWidth + 'px';
                imgResizeWrapper.style.height = selectedImg.height ? selectedImg.height + 'px' : selectedImg.offsetHeight + 'px';
            } else {
                imgResizeWrapper = selectedImg.parentElement;
            }
            // Sync image size on wrapper resize
            let lastWidth = imgResizeWrapper.offsetWidth;
            let lastHeight = imgResizeWrapper.offsetHeight;
            // Listen for Shift key
            window.addEventListener('keydown', function(e) { if (e.key === 'Shift') isShiftResizing = true; });
            window.addEventListener('keyup', function(e) { if (e.key === 'Shift') isShiftResizing = false; });
            imgResizeWrapper._resizeObserver = new ResizeObserver(() => {
                if (imgResizeWrapper && selectedImg) {
                    if (!isShiftResizing) {
                        let w = imgResizeWrapper.offsetWidth;
                        let h = imgResizeWrapper.offsetHeight;
                        // Lock aspect ratio
                        h = Math.round(w / imgAspectRatio);
                        imgResizeWrapper.style.height = h + 'px';
                    }
                    selectedImg.style.width = imgResizeWrapper.offsetWidth + 'px';
                    selectedImg.style.height = imgResizeWrapper.offsetHeight + 'px';
                    lastWidth = imgResizeWrapper.offsetWidth;
                    lastHeight = imgResizeWrapper.offsetHeight;
                }
            });
            imgResizeWrapper._resizeObserver.observe(imgResizeWrapper);
            // Highlight selected image
            selectedImg.classList.add('img-selected');
        } else {
            if (selectedImg) {
                selectedImg.classList.remove('img-selected');
                // Remove wrapper and observer
                if (selectedImg.parentElement && selectedImg.parentElement.classList.contains('img-resize-wrapper')) {
                    const wrapper = selectedImg.parentElement;
                    if (wrapper._resizeObserver) wrapper._resizeObserver.disconnect();
                    transferAlignmentClass(wrapper, selectedImg);
                    wrapper.parentNode.insertBefore(selectedImg, wrapper);
                    wrapper.remove();
                }
            }
            selectedImg = null;
            imgResizeWrapper = null;
        }
    });
    // On blur, clear selection and remove wrapper
    editor.addEventListener('blur', function() {
        if (selectedImg) {
            selectedImg.classList.remove('img-selected');
            if (selectedImg.parentElement && selectedImg.parentElement.classList.contains('img-resize-wrapper')) {
                const wrapper = selectedImg.parentElement;
                if (wrapper._resizeObserver) wrapper._resizeObserver.disconnect();
                transferAlignmentClass(wrapper, selectedImg);
                wrapper.parentNode.insertBefore(selectedImg, wrapper);
                wrapper.remove();
            }
        }
        selectedImg = null;
        imgResizeWrapper = null;
    });
    // When removing the wrapper, transfer alignment class back to the image
    function transferAlignmentClass(wrapper, img) {
        ['img-align-left', 'img-align-center', 'img-align-right'].forEach(cls => {
            if (wrapper.classList.contains(cls)) {
                img.classList.add(cls);
                wrapper.classList.remove(cls);
            } else {
                img.classList.remove(cls);
            }
        });
    }
});