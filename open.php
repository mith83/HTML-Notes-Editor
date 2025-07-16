<?php
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
header('Content-Type: application/json');

// List files
if (isset($_GET['action']) && $_GET['action'] === 'list') {
    $files = [];
    $uploadDir = 'assets/uploads/';
    
    if (is_dir($uploadDir)) {
        foreach (glob($uploadDir . '*.html') as $file) {
        $files[] = basename($file);
        }
    }
    
    echo json_encode($files);
    exit;
}

// Load file
if (isset($_GET['action']) && $_GET['action'] === 'load' && isset($_GET['filename'])) {
    $filename = $_GET['filename'];
    
    // Basic security check
    if (!preg_match('/^[a-zA-Z0-9-_]+\.html$/', $filename)) {
        http_response_code(400);
        echo 'Invalid filename';
        exit;
    }
    
    $uploadDir = 'assets/uploads/';
    $filepath = $uploadDir . $filename;
    
    if (file_exists($filepath)) {
        $content = file_get_contents($filepath);
        
        // Check if it's a complete HTML document
        if (strpos($content, '<!DOCTYPE html>') !== false) {
            // Extract body content from complete HTML
            $dom = new DOMDocument();
            @$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            $body = $dom->getElementsByTagName('body')->item(0);
            
            if ($body) {
                $bodyContent = '';
                foreach ($body->childNodes as $child) {
                    $bodyContent .= $dom->saveHTML($child);
                }
                echo $bodyContent;
            } else {
                echo $content;
            }
        } else {
            // Return content as-is if it's not a complete HTML document
            echo $content;
        }
    } else {
        http_response_code(404);
        echo 'File not found';
    }
    exit;
}

http_response_code(400);
echo 'Invalid request';
?>