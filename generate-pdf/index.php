<?php

require 'vendor/autoload.php';


$rootPath = $_SERVER['DOCUMENT_ROOT'];

use Dompdf\Dompdf;
use Dompdf\Options;

// Читаем содержимое файла CSS, если он существует
$cssFile = "$rootPath/style.css";
$cssContent = file_get_contents($cssFile);

// Читаем содержимое файла HTML, если он существует
$htmlFile = "$rootPath/pdf.html";
$htmlContent = file_get_contents($htmlFile);

$html = '
<html>
<head>
    <meta charset="utf-8">
    <style>' . $cssContent . '</style>
</head>
<body>
'. $htmlContent .'
</body>
</html>';




$options = new Options();
$options->set('isRemoteEnabled', true);
$options->set('enable_php', true);
$options->set('isHtml5ParserEnabled', true); // Включите поддержку HTML5
$options->set('enable_remote', true); // Включите поддержку внешних ресурсов (SVG)
$dompdf = new Dompdf($options);

$html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
$dompdf->loadHtml($html, 'UTF-8');
$dompdf->render();
$dompdf->stream("sample.pdf", array("Attachment" => 0));