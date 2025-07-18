<?php
session_start();
$uploadsDir = __DIR__ . '/uploads';
$snipFile = __DIR__ . '/snippett.json';
$defaultPassword = '123';

// Handle login
if (isset($_POST['login'])) {
    if ($_POST['password'] === $defaultPassword) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $error = 'Incorrect password.';
    }
}
// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}
// Handle snippet actions
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in']) {
    // Add snippet
    if (isset($_POST['add_snippet'])) {
        $snippets = file_exists($snipFile) ? json_decode(file_get_contents($snipFile), true) : [];
        $snippets[] = [
            'name' => $_POST['snippet_name'],
            'code' => $_POST['snippet_code']
        ];
        file_put_contents($snipFile, json_encode($snippets, JSON_PRETTY_PRINT));
        header('Location: admin.php');
        exit;
    }
    // Edit snippet
    if (isset($_POST['edit_snippet'])) {
        $snippets = file_exists($snipFile) ? json_decode(file_get_contents($snipFile), true) : [];
        $idx = (int)$_POST['snippet_idx'];
        if (isset($snippets[$idx])) {
            $snippets[$idx]['name'] = $_POST['snippet_name'];
            $snippets[$idx]['code'] = $_POST['snippet_code'];
            file_put_contents($snipFile, json_encode($snippets, JSON_PRETTY_PRINT));
        }
        header('Location: admin.php');
        exit;
    }
    // Delete snippet
    if (isset($_POST['delete_snippet'])) {
        $snippets = file_exists($snipFile) ? json_decode(file_get_contents($snipFile), true) : [];
        $idx = (int)$_POST['snippet_idx'];
        if (isset($snippets[$idx])) {
            array_splice($snippets, $idx, 1);
            file_put_contents($snipFile, json_encode($snippets, JSON_PRETTY_PRINT));
        }
        header('Location: admin.php');
        exit;
    }
    // Delete file
    if (isset($_POST['delete_file'])) {
        $file = basename($_POST['delete_file']);
        if ($file !== 'index.php') {
            @unlink($uploadsDir . '/' . $file);
        }
        header('Location: admin.php');
        exit;
    }
    // Delete all by type
    if (isset($_POST['delete_type'])) {
        $type = $_POST['delete_type'];
        foreach (scandir($uploadsDir) as $file) {
            if ($file === 'index.php' || $file === '.' || $file === '..') continue;
            if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) === strtolower($type)) {
                @unlink($uploadsDir . '/' . $file);
            }
        }
        header('Location: admin.php');
        exit;
    }
    // Empty folder
    if (isset($_POST['empty_folder'])) {
        foreach (scandir($uploadsDir) as $file) {
            if ($file === 'index.php' || $file === '.' || $file === '..') continue;
            @unlink($uploadsDir . '/' . $file);
        }
        header('Location: admin.php');
        exit;
    }
}
function isImage($file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    return in_array($ext, ['jpg','jpeg','png','gif','webp','bmp','svg']);
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>miniB HTML editor Admin Panel</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 24px; }
        .login-center { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-box { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px 28px; max-width: 320px; width: 100%; }
        h2 { margin-top: 0; }
        form { margin-bottom: 1em; }
        input[type="text"], input[type="password"], textarea { width: 100%; padding: 6px; margin: 4px 0 10px; border: 1px solid #bbb; border-radius: 4px; }
        textarea { resize: both !important; min-height: 32px; }
        button, input[type="submit"] { background: #2563eb; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; margin-right: 6px; }
        button.danger, input[type="submit"].danger { background: #dc2626; }
        button.small, input[type="submit"].small { padding: 2px 8px; font-size: 0.9em; }
        .snippet-list, .file-list { margin-bottom: 2em; }
        .snippet-item, .file-item { border-bottom: 1px solid #eee; padding: 8px 0; display: flex; align-items: center; }
        .snippet-item:last-child, .file-item:last-child { border-bottom: none; }
        .snippet-actions, .file-actions { margin-left: auto; }
        .img-thumb { max-width: 80px; max-height: 60px; display: block; margin: 2px 0; border: 1px solid #ccc; border-radius: 4px; }
        .logout { float: right; color: #2563eb; text-decoration: underline; font-size: 0.95em; }
        .error { color: #dc2626; margin-bottom: 1em; }
        .file-url { font-size: 0.95em; color: #2563eb; text-decoration: underline; word-break: break-all; }
        .file-type-group { margin: 10px 0; }
    </style>
</head>
<body>
<?php if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']): ?>
<div class="login-center">
  <div class="login-box">
    <h2><i class="fas fa-user-shield" style="color:#2563eb;margin-right:8px;"></i>Admin Login:</h2>
    <?php if (!empty($error)) echo '<div class="error">'.$error.'</div>'; ?>
    <form method="post">
        <input type="password" name="password" placeholder="Password" autocomplete="off" required>
        <input type="submit" name="login" value="Login">
    </form>
  </div>
</div>
<?php else: ?>
<div class="container">
    <a href="?logout=1" class="logout">Logout</a>
    <h2>Snippets</h2>
    <div class="snippet-list">
        <?php $snippets = file_exists($snipFile) ? json_decode(file_get_contents($snipFile), true) : [];
        foreach ($snippets as $i => $snip): ?>
            <div class="snippet-item">
                <form method="post" style="flex:1;display:flex;gap:8px;align-items:center;">
                    <input type="hidden" name="snippet_idx" value="<?= $i ?>">
                    <input type="text" name="snippet_name" value="<?= htmlspecialchars($snip['name']) ?>" required style="max-width:160px;">
                    <textarea name="snippet_code" rows="1" required style="flex:1;min-width:120px;max-width:400px;resize:horizontal;"><?= htmlspecialchars($snip['code']) ?></textarea>
                    <input type="submit" name="edit_snippet" value="Save" class="small">
                    <input type="submit" name="delete_snippet" value="Delete" class="danger small" onclick="return confirm('Delete this snippet?')">
                </form>
            </div>
        <?php endforeach; ?>
        <form method="post" style="display:flex;gap:8px;align-items:center;margin-top:10px;">
            <input type="text" name="snippet_name" placeholder="New snippet name" required style="max-width:160px;">
            <textarea name="snippet_code" rows="1" required style="flex:1;min-width:120px;max-width:400px;resize:horizontal;" placeholder="Code..."></textarea>
            <input type="submit" name="add_snippet" value="Add" class="small">
        </form>
    </div>
    <h2>Uploads</h2>
    <div class="file-list">
        <?php $files = array_diff(scandir($uploadsDir), ['.','..','index.php']);
        $types = [];
        foreach ($files as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!isset($types[$ext])) $types[$ext] = 0;
            $types[$ext]++;
        }
        foreach ($files as $file): ?>
            <div class="file-item">
                <?php $url = 'uploads/' . rawurlencode($file); ?>
                <a href="<?= $url ?>" target="_blank" class="file-url"><?= htmlspecialchars($file) ?></a>
                <?php if (isImage($file)): ?>
                    <img src="<?= $url ?>" class="img-thumb" alt="img">
                <?php endif; ?>
                <form method="post" class="file-actions" style="display:inline;">
                    <input type="hidden" name="delete_file" value="<?= htmlspecialchars($file) ?>">
                    <input type="submit" value="Delete" class="danger small" onclick="return confirm('Delete this file?')">
                </form>
            </div>
        <?php endforeach; ?>
        <div class="file-type-group">
            <form method="post" style="display:inline;">
                <select name="delete_type">
                    <option value="">Delete all by type</option>
                    <?php foreach ($types as $ext => $count): ?>
                        <option value="<?= htmlspecialchars($ext) ?>"><?= strtoupper($ext) ?> (<?= $count ?>)</option>
                    <?php endforeach; ?>
                </select>
                <input type="submit" value="Delete" class="danger small" onclick="return confirm('Delete all files of this type?')">
            </form>
            <form method="post" style="display:inline;margin-left:10px;">
                <input type="hidden" name="empty_folder" value="1">
                <input type="submit" value="Empty Folder" class="danger small" onclick="return confirm('Delete ALL files in uploads?')">
            </form>
        </div>
    </div>
<?php endif; ?>
</div>
</body>
</html> 