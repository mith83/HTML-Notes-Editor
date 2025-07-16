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
header('Content-Type: text/plain');

// Create uploads directory if it doesn't exist
if (!file_exists('assets/uploads')) {
    mkdir('assets/uploads', 0777, true);
}

// Handle image upload
if (isset($_GET['action']) && $_GET['action'] === 'upload') {
    header('Content-Type: application/json');
    
    if (isset($_FILES['image'])) {
        $file = $_FILES['image'];
        
        // Validate file
        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowed)) {
            echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
            exit;
        }
        
        // Check file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            echo json_encode(['success' => false, 'error' => 'File too large. Maximum size is 5MB.']);
            exit;
        }
        
        // Use original filename (sanitize to prevent issues)
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', basename($file['name']));
        $destination = 'assets/uploads/' . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            echo json_encode(['success' => true, 'url' => $destination]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Upload failed']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    }
    exit;
}

// Handle file save
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $filename = isset($_POST['filename']) ? trim($_POST['filename']) : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
    $title = isset($_POST['title']) ? trim($_POST['title']) : 'Document';
    $complete = isset($_POST['complete']) ? $_POST['complete'] : '0';
    
    if (empty($filename)) {
        echo 'Filename is required';
        exit;
    }
    
    // Sanitize filename
    $filename = preg_replace('/[^a-zA-Z0-9-_]/', '', $filename);
    $filename .= '.html';
    
    // Set upload directory
    $uploadDir = 'assets/uploads/';
    $filepath = $uploadDir . $filename;
    
    // Clean and validate content
    $content = trim($content);
    if (empty($content)) {
        echo 'Content cannot be empty';
        exit;
    }
    
    // Save file in uploads directory
    if (file_put_contents($filepath, $content)) {
        $fileSize = filesize($filepath);
        $fileSizeKB = round($fileSize / 1024, 2);
        
        if ($complete === '1') {
            echo "Complete HTML document saved successfully as '$filepath' ($fileSizeKB KB)";
        } else {
            echo "Content saved successfully as '$filepath' ($fileSizeKB KB)";
        }
    } else {
        echo 'Error saving file. Please check directory permissions.';
    }
    exit;
}

echo 'Invalid request';
?>