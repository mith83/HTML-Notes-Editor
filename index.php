<!--
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
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>miniB HTML Editor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#eff6ff',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="editor.css">
</head>
<body class="bg-gray-50 h-screen flex flex-col">
    <div class="max-w-7xl mx-auto p-4 flex-1 flex flex-col">
        <!-- Header -->
        

        <div class="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
            <!-- Toolbar -->
            <div class="toolbar bg-gray-100 border-b border-gray-200 p-4">
                <div class="flex flex-wrap items-center gap-2">
                    <!-- History -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
                        <button data-command="undo" class="toolbar-btn" title="Undo (Ctrl+Z)">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button data-command="redo" class="toolbar-btn" title="Redo (Ctrl+Y)">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>

                    <!-- Headings -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
                        <select data-command="formatBlock" class="toolbar-select">
            <option value="" disabled selected>Paragraph</option>
            <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                            <option value="h4">Heading 4</option>
                            <option value="h5">Heading 5</option>
                            <option value="h6">Heading 6</option>
                <option value="blockquote">Quote</option>
            </select>
                    </div>

                    <!-- Text Formatting -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
                        <button data-command="bold" class="toolbar-btn" title="Bold (Ctrl+B)">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button data-command="italic" class="toolbar-btn" title="Italic (Ctrl+I)">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button data-command="underline" class="toolbar-btn" title="Underline (Ctrl+U)">
                            <i class="fas fa-underline"></i>
                        </button>
                        <button data-command="strikeThrough" class="toolbar-btn" title="Strikethrough">
                            <i class="fas fa-strikethrough"></i>
                        </button>
                        <button data-command="superscript" class="toolbar-btn" title="Superscript (Ctrl+.)">
                            <i class="fas fa-superscript"></i>
                        </button>
                        <button data-command="subscript" class="toolbar-btn" title="Subscript (Ctrl+,)">
                            <i class="fas fa-subscript"></i>
                        </button>
                    </div>

                    <!-- Lists -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
                        <button data-command="insertUnorderedList" class="toolbar-btn" title="Bullet List">
                            <i class="fas fa-list-ul"></i>
                        </button>
                        <button data-command="insertOrderedList" class="toolbar-btn" title="Numbered List">
                            <i class="fas fa-list-ol"></i>
                        </button>
                    </div>
            
                    <!-- Alignment -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
                        <button data-command="justifyLeft" class="toolbar-btn" title="Align Left">
                            <i class="fas fa-align-left"></i>
                        </button>
                        <button data-command="justifyCenter" class="toolbar-btn" title="Align Center">
                            <i class="fas fa-align-center"></i>
                        </button>
                        <button data-command="justifyRight" class="toolbar-btn" title="Align Right">
                            <i class="fas fa-align-right"></i>
                        </button>
                        <button data-command="justifyFull" class="toolbar-btn" title="Justify">
                            <i class="fas fa-align-justify"></i>
                        </button>
                    </div>

                    <!-- Colors -->
                    <div class="flex items-center gap-2 border-r border-gray-300 pr-3">
                        <div class="flex items-center gap-1">
                            <i class="fas fa-font text-gray-600"></i>
                            <input type="color" id="textColor" class="w-8 h-8 rounded border border-gray-300 cursor-pointer" title="Text Color" value="#000000">
                        </div>
                        <div class="flex items-center gap-1">
                            <i class="fas fa-highlighter text-gray-600"></i>
                            <input type="color" id="bgColor" class="w-8 h-8 rounded border border-gray-300 cursor-pointer" title="Background Color" value="#ffffff">
                        </div>
                    </div>

                    <!-- Insert Elements -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
                        <button data-command="createLink" class="toolbar-btn" title="Insert Link">
                            <i class="fas fa-link"></i>
                        </button>
                        <button data-command="insertImage" class="toolbar-btn" title="Insert Image">
                            <i class="fas fa-image"></i>
                        </button>
                        <button data-command="insertTable" class="toolbar-btn" title="Insert Table">
                            <i class="fas fa-table"></i>
                        </button>
                        <button data-command="insertCode" class="toolbar-btn" title="Insert Code Block">
                            <i class="fas fa-code"></i>
                        </button>
                    </div>
                    <!-- Code Snippets Tab -->
                    <div class="flex items-center gap-1 border-r border-gray-300 pr-3 ml-2 pl-2">
                        <button id="openSnippets" class="toolbar-btn" title="Code Snippets">
                            <i class="fas fa-scroll mr-1"></i><span>Snippets</span>
                        </button>
                        <button id="showHtml" class="action-btn ml-2" title="View HTML">
                            <i class="fas fa-code mr-2"></i><span>HTML</span>
                        </button>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <button id="saveFile" class="action-btn" title="Save (Ctrl+S)">
                            <i class="fas fa-save mr-2"></i><span>Save</span>
                        </button>
                        <button id="downloadFile" class="action-btn" title="Download HTML">
                            <i class="fas fa-download mr-2"></i><span>Download</span>
                        </button>
                        <button id="openFile" class="action-btn" title="Open (Ctrl+O)">
                            <i class="fas fa-folder-open mr-2"></i><span>Open</span>
                        </button>
                        <button id="previewFile" class="action-btn" title="Preview">
                            <i class="fas fa-eye mr-2"></i><span>Preview</span>
                        </button>
                        <button id="toggleDarkMode" class="action-btn" title="Toggle Dark Mode">
                            <i class="fas fa-moon mr-2"></i><span>Dark Mode</span>
                        </button>
                        <button id="openDocs" class="action-btn" title="Documentation" onclick="window.open('documentation.html', '_blank')">
                            <i class="fas fa-question-circle mr-2"></i><span>Docs</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Main Content Area (no sidebar) -->
            <div class="flex-1 flex flex-col min-h-0" style="min-height:0; height:100%;">
                <div id="editor" contenteditable="true" aria-label="Editor content area" data-placeholder="Start typing your content here..." class="flex-1 p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset prose max-w-none overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style="min-height:300px; height:500px; overflow-y:auto; white-space:normal;"></div>
                <div id="mentionDropdown" class="mention-dropdown hidden"></div>
                <div id="tableToolbar" class="table-toolbar hidden">
                    <button type="button" id="addRowAbove" title="Add row above">↑ Row</button>
                    <button type="button" id="addRowBelow" title="Add row below">↓ Row</button>
                    <button type="button" id="removeRow" title="Remove row">✕ Row</button>
                    <button type="button" id="addColLeft" title="Add column left">← Col</button>
                    <button type="button" id="addColRight" title="Add column right">→ Col</button>
                    <button type="button" id="removeCol" title="Remove column">✕ Col</button>
                </div>
            </div>
            
            <!-- License and Support Notice -->
            <div class="text-center text-xs text-gray-500 mt-8 mb-8 px-2">
                <p>© <script type="text/javascript">var year = new Date();document.write(year.getFullYear());</script> miniB HTML editor by <a href="https://github.com/ColeNikol" target="_blank"><u>ColeNikol</u></a>. Licensed under <a href="https://opensource.org/license/mit" target="_blank"><u>MIT license</u></a><br/>Before removing this line and using it in your projects please <a href="https://cwallet.com/t/JZWJW87H" target="_blank"><u>support</u></a> me</p>
            </div>
            
            <!-- HTML Editor -->
            <div id="htmlEditor" class="hidden flex-1 flex flex-col border-t border-gray-200">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800">HTML Code Editor</h3>
                    <div class="flex gap-2">
                        <button id="updateContent" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                            <i class="fas fa-check mr-1"></i>Update
                        </button>
                        <button id="cancelHtml" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                            <i class="fas fa-times mr-1"></i>Cancel
                        </button>
                    </div>
                </div>
                <textarea id="htmlCode" class="flex-1 p-4 font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none"></textarea>
            </div>
        </div>
        </div>
        
        <!-- Modal Dialogs -->
    <!-- Link Modal -->
        <div id="linkModal" class="modal">
            <div class="modal-content">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Insert Link</h3>
                <button class="modal-close" id="closeLinkModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input type="text" id="linkUrl" class="modal-input" placeholder="https://example.com">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Text</label>
                    <input type="text" id="linkText" class="modal-input" placeholder="Link text">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="linkNewTab" class="mr-2">
                    <label for="linkNewTab" class="text-sm text-gray-700">Open in new tab</label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rel Attributes</label>
                    <div class="flex flex-wrap gap-3" id="linkRelGroup">
                        <label class="flex items-center text-sm"><input type="checkbox" id="relNoopener" class="mr-1">noopener</label>
                        <label class="flex items-center text-sm"><input type="checkbox" id="relNoreferrer" class="mr-1">noreferrer</label>
                        <label class="flex items-center text-sm"><input type="checkbox" id="relNofollow" class="mr-1">nofollow</label>
                        <label class="flex items-center text-sm"><input type="checkbox" id="relUgc" class="mr-1">ugc</label>
                        <label class="flex items-center text-sm"><input type="checkbox" id="relSponsored" class="mr-1">sponsored</label>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button id="insertLink" class="modal-btn-primary">
                    <i class="fas fa-plus mr-1"></i>Insert
                </button>
                <button id="cancelLinkModal" class="modal-btn-secondary">Cancel</button>
            </div>
            </div>
        </div>
        
    <!-- Image Modal -->
        <div id="imageModal" class="modal">
        <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Insert Image</h3>
                <button class="modal-close" id="closeImageModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                    <div id="imageDropArea" class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 cursor-pointer mb-2 transition-colors">
                        <span id="imageDropText">Drag & drop an image here, or click to select</span>
                    </div>
                    <input type="file" id="imageUpload" accept="image/*" class="modal-input" style="display:none;">
                </div>
                <div class="text-center text-gray-500">- or -</div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="text" id="imageUrl" class="modal-input" placeholder="https://example.com/image.jpg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <input type="text" id="imageAlt" class="modal-input" placeholder="Image description">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                    <input type="number" id="imageWidth" class="modal-input" placeholder="Auto">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                    <input type="number" id="imageHeight" class="modal-input" placeholder="Auto">
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button id="insertImageBtn" class="modal-btn-primary">
                    <i class="fas fa-plus mr-1"></i>Insert
                </button>
                <button id="cancelImageModal" class="modal-btn-secondary">Cancel</button>
            </div>
            </div>
        </div>
        
    <!-- Table Modal -->
    <div id="tableModal" class="modal">
            <div class="modal-content">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Insert Table</h3>
                <button class="modal-close" id="closeTableModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                        <input type="number" id="tableRows" class="modal-input" value="3" min="1" max="20">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                        <input type="number" id="tableCols" class="modal-input" value="3" min="1" max="20">
                    </div>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="tableHeader" class="mr-2" checked>
                    <label for="tableHeader" class="text-sm text-gray-700">Include header row</label>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="tableBorder" class="mr-2" checked>
                    <label for="tableBorder" class="text-sm text-gray-700">Add borders</label>
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button id="insertTableBtn" class="modal-btn-primary">
                    <i class="fas fa-plus mr-1"></i>Insert
                </button>
                <button id="cancelTableModal" class="modal-btn-secondary">Cancel</button>
            </div>
            </div>
        </div>
        
    <!-- Code Modal -->
        <div id="codeModal" class="modal">
            <div class="modal-content">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Insert Code Block</h3>
                <button class="modal-close" id="closeCodeModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select id="codeLanguage" class="modal-input">
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="javascript">JavaScript</option>
                        <option value="php">PHP</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="sql">SQL</option>
                        <option value="bash">Bash</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="markdown">Markdown</option>
                        <option value="">Plain Text</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <textarea id="codeContent" class="modal-textarea" placeholder="Your code here..."></textarea>
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button id="insertCodeBtn" class="modal-btn-primary">
                    <i class="fas fa-plus mr-1"></i>Insert
                </button>
                <button id="cancelCodeModal" class="modal-btn-secondary">Cancel</button>
            </div>
            </div>
        </div>
        
    <!-- File Modal -->
        <div id="fileModal" class="modal">
            <div class="modal-content">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Open File</h3>
                <button class="modal-close" id="closeFileModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                    <select id="fileList" class="modal-input">
                        <option value="">Loading files...</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button id="loadFile" class="modal-btn-primary">
                    <i class="fas fa-folder-open mr-1"></i>Open
                </button>
                <button id="cancelFileModal" class="modal-btn-secondary">Cancel</button>
            </div>
        </div>
    </div>
    
    <!-- Save Modal -->
    <div id="saveModal" class="modal">
        <div class="modal-content">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Save File</h3>
                <button class="modal-close" id="closeSaveModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Filename</label>
                    <input type="text" id="saveFilename" class="modal-input" placeholder="my-document">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="saveTitle" class="modal-input" placeholder="Document Title">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="saveComplete" class="mr-2" checked>
                    <label for="saveComplete" class="text-sm text-gray-700">Save as complete HTML document</label>
                </div>
            </div>
            <div class="flex gap-2 mt-6">
                <button id="confirmSave" class="modal-btn-primary">
                    <i class="fas fa-save mr-1"></i>Save
                </button>
                <button id="cancelSaveModal" class="modal-btn-secondary">Cancel</button>
            </div>
        </div>
    </div>
    
    <!-- Code Snippets Modal -->
    <div id="snippetsModal" class="modal">
        <div class="modal-content max-h-[80vh] overflow-y-auto" style="max-width: 600px; max-height:80vh; overflow-y:auto;">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Code Snippets</h3>
                <button class="modal-close" id="closeSnippetsModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="flex gap-2 items-end">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Snippet Name</label>
                        <input type="text" id="snippetName" class="modal-input" placeholder="Name">
                    </div>
                    <button id="addSnippetBtn" class="modal-btn-primary">Add</button>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <textarea id="snippetCode" class="modal-textarea" placeholder="Enter code..."></textarea>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm">Sort by name:</label>
                    <button id="sortAsc" class="modal-btn-secondary p-1 text-xs" title="Sort A-Z"><i class="fas fa-arrow-down-a-z"></i></button>
                    <button id="sortDesc" class="modal-btn-secondary p-1 text-xs" title="Sort Z-A"><i class="fas fa-arrow-up-z-a"></i></button>
                </div>
                <div>
                    <input type="text" id="filterSnippet" class="modal-input" placeholder="Filter by name...">
                </div>
                <div id="snippetsList" class="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50" style="max-height:200px; overflow-y:auto;"></div>
            </div>
        </div>
    </div>
    
    <script src="editor.js"></script>
</body>
</html>