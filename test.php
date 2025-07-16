<?php
// Test file to verify PHP functionality
echo "<h1>PHP Test</h1>";
echo "<p>PHP is working correctly!</p>";

// Test directory permissions
$uploadDir = 'assets/uploads';
if (!file_exists($uploadDir)) {
    if (mkdir($uploadDir, 0777, true)) {
        echo "<p style='color: green;'>✓ Upload directory created successfully</p>";
    } else {
        echo "<p style='color: red;'>✗ Failed to create upload directory</p>";
    }
} else {
    if (is_writable($uploadDir)) {
        echo "<p style='color: green;'>✓ Upload directory exists and is writable</p>";
    } else {
        echo "<p style='color: red;'>✗ Upload directory exists but is not writable</p>";
    }
}

// Test current directory permissions
if (is_writable('.')) {
    echo "<p style='color: green;'>✓ Current directory is writable</p>";
} else {
    echo "<p style='color: red;'>✗ Current directory is not writable</p>";
}

// List existing HTML files
echo "<h2>Existing HTML Files:</h2>";
$htmlFiles = glob('*.html');
if (empty($htmlFiles)) {
    echo "<p>No HTML files found.</p>";
} else {
    echo "<ul>";
    foreach ($htmlFiles as $file) {
        echo "<li>$file</li>";
    }
    echo "</ul>";
}

// Test save functionality
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['test'])) {
    $testContent = '<h1>Test Document</h1><p>This is a test document created by PHP.</p>';
    $testFile = 'test_document.html';
    
    if (file_put_contents($testFile, $testContent)) {
        echo "<p style='color: green;'>✓ Test file created successfully: $testFile</p>";
    } else {
        echo "<p style='color: red;'>✗ Failed to create test file</p>";
    }
}

echo "<h2>Test Save Functionality:</h2>";
echo "<form method='post'>";
echo "<input type='hidden' name='test' value='1'>";
echo "<button type='submit'>Create Test File</button>";
echo "</form>";

echo "<h2>PHP Information:</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Current Directory: " . getcwd() . "</p>";
?> 