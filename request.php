<?php

require_once './recaptcha/autoload.php';

$secret = 'TAKE_SECRET_KEY_FROM_ENV_FILE';
$expectedHostname = $_SERVER['HTTP_HOST'];

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$userIp = $_SERVER['REMOTE_ADDR'];

$history_file = 'FILENAME_FROM_ENV';
if (file_exists($history_file)) {
    $history = file_get_contents($history_file);
    $history = json_decode($history, true);
} else {
    $history = [];
}


$now = new DateTime();
foreach ($history as $key => $value) {
    $entry_time = new DateTime();
    $entry_time->setTimestamp($value['timestamp']);
    $diff = $now->diff($entry_time, true);
    if ($diff->d >= 1) {
        unset($history[$key]);
    }
}

if (isset($history[$userIp])) {
    if ($history[$userIp]['count'] >= 3) {
        die('{"ok": false, "error": "too-many-requests"}');
    } else {
        $history[$userIp]['count'] = $history[$userIp]['count'] + 1;
    }
} else {
    $history[$userIp] = [
        'timestamp' => $now->getTimestamp(),
        'count' => 1
    ];
}

file_put_contents($history_file, json_encode($history));


$recaptchaResponse = $_GET['recaptcha_token'];
if ($recaptchaResponse == '') {
    die('{"ok": false, "error": "no-captcha-token"}');
}

$recaptcha = new \ReCaptcha\ReCaptcha($secret);
$response = $recaptcha->setExpectedHostname($expectedHostname)
                      ->setExpectedAction('homepage')
                      ->setScoreThreshold(0.3)
                      ->verify($recaptchaResponse, $userIp);
if (!$response->isSuccess()) {
    die('{"ok": false, "error": "bad-captcha-solution"}');
}

	function email($message, $from = 'Расчет ТО', $reply_to = 'info@ya-service.ru') {
		$to = "info@ya-service.ru";
		$subject = "Новый лид с VK сервиса!";
    	$headers = "MIME-Version: 1.0\n" ;
    	$headers .= "Content-type: text/html; charset=utf-8; \r\n";
    	$headers .= "From: $from\r\n";
    	if(!empty($reply_to))
	    	$headers .= "reply-to: $reply_to\r\n";

    	$subject = "=?utf-8?B?".base64_encode($subject)."?=";

    	@mail($to, $subject, $message, $headers);
    }

    function convertArrayToHTMLTemplate($_array){
        $_string = '';
        foreach ($_array as $item) {
            $name = $item['name'];
            $price = $item['price'];
            $_string .='<div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: space-between;margin-bottom: 12px;">
            <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;margin-right: 7px;font-weight: 550;">'.$name.'</p>
            <p class="money" style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;white-space: nowrap;">'.$price.' руб</p>
        </div>';
        }
        return $_string;
    }

    function calculateSummaryPrice($_array){
        $result = 0;
        foreach ($_array as $item) {
            $result += $item['price'];
        }
        return $result;
    }



	function createMessage($car, $modification, $oldness, $works, $materials, $name, $phone)
	{
        $original_works =$works;
        $original_materials =$materials;
        $works = convertArrayToHTMLTemplate($works);
        $materials = convertArrayToHTMLTemplate($materials);
        $worksSummary = calculateSummaryPrice($original_works);
        $materialsSummary = calculateSummaryPrice($original_materials);
        $overallSummary = $worksSummary + $materialsSummary;
        $template = '<!DOCTYPE html>
        <html lang="ru" style="margin: 0;padding: 0;box-sizing: border-box;">

        <head style="margin: 0;padding: 0;box-sizing: border-box;">
            <meta charset="UTF-8" style="margin: 0;padding: 0;box-sizing: border-box;">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" style="margin: 0;padding: 0;box-sizing: border-box;">
            <meta http-equiv="X-UA-Compatible" content="ie=edge" style="margin: 0;padding: 0;box-sizing: border-box;">
            <title style="margin: 0;padding: 0;box-sizing: border-box;">Письмо</title>
            <style style="margin: 0;padding: 0;box-sizing: border-box;">
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    background-color: #edeef0;
                }

                main {
                    max-width: 760px;
                    margin: 0 auto;
                }

                header {
                    margin: 13px;
                }

                header.inner {
                    margin: 0 0 10px 0;
                    color: #6d6d6d;

                }

                h1 {
                    font-size: 1.5em;
                }

                h2 {
                    font-size: 1.3em;
                }

                h1,
                h2 {
                    text-align: center;
                }

                .container {
                    border: 1px solid black;
                    margin: 5px 5px 10px 5px;
                    padding: 8px;
                    background-color: #f5f3f3;
                    border-radius: 15px;
                }

                .param-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: start;
                    margin-bottom: 12px;
                }

                .param-container>p,
                .param-container>strong {
                    margin: auto 0;
                }

                .param-container>p:first-child,
                .param-container>strong:first-child {
                    margin-right: 7px;
                    font-weight: 550;
                }

                .calculations .param-container {
                    justify-content: space-between;
                }

                .money {
                    white-space: nowrap;
                }

                p {
                    margin-block-start: 0.5em;
                    margin-block-end: 0.5em;
                }

                button.call {
                    padding: 10px 5px;
                    border-radius: 5px;
                    background-color: #6464dc;
                    cursor: pointer;
                    border: 1px solid black;
                    width: 80%;
                    max-width: 300px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                    transition-duration: 200ms;
                }

                button.call>*,
                button.call>*:visited,
                button.call>*:active,
                button.call>*:hover {
                    text-decoration: none;
                    color: white;
                }

                button.call>a {
                    font-size: 1.3em;
                }

                button.call:hover,
                button.call:active {
                    background-color: #2b2be6;
                }

                i.icon-phone {
                    font-size: 1.5em;
                    margin-right: 10px;
                }

                @media screen and (min-width: 480px) {

                    .container {
                        margin: 10px 10px 15px 10px;
                        padding: 15px;
                    }

                    .param-container>p:first-child,
                    .param-container>strong:first-child {
                        margin-right: 15px;
                    }
                }

                @media screen and (min-width: 760px) {
                    .calculations {
                        display: flex;
                        flex-direction: column;
                        border: none;
                        background-color: inherit;
                        border-radius: 0;
                        justify-content: space-between;
                        padding: 0;
                    }

                    div.row {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        margin-top: 10px;
                    }

                    div.row.summary-row {
                        justify-content: flex-end;
                    }

                    .works,
                    .materials {
                        border: 1px solid black;
                        border-radius: 10px;
                        padding: 15px;
                    }

                    .works {
                        margin-right: 10px;
                    }
                }

                @media screen and (min-width: 1366px) {
                    button.call {
                        display: none;
                    }

                    main {
                        max-width: 1000px;
                    }
                }


                @font-face {
                    font-family: "fontello";
                    src: url("./font/fontello.eot?44217150");
                    src: url("./font/fontello.eot?44217150#iefix") format("embedded-opentype"),
                        url("./font/fontello.woff2?44217150") format("woff2"),
                        url("./font/fontello.woff?44217150") format("woff"),
                        url("./font/fontello.ttf?44217150") format("truetype"),
                        url("./font/fontello.svg?44217150#fontello") format("svg");
                    font-weight: normal;
                    font-style: normal;
                }

                [class^="icon-"]:before,
                [class*=" icon-"]:before {
                    font-family: "fontello";
                    font-style: normal;
                    font-weight: normal;

                    display: inline-block;
                    text-decoration: inherit;
                    width: 1em;
                    margin-right: 0.2em;
                    text-align: center;
                    /* opacity: .8; */

                    /* For safety - reset parent styles, that can break glyph codes*/
                    font-variant: normal;
                    text-transform: none;

                    /* fix buttons height, for twitter bootstrap */
                    line-height: 1em;

                    /* Animation center compensation - margins should be symmetric */
                    /* remove if not needed */
                    margin-left: 0.2em;

                    /* you can be more comfortable with increased icons size */
                    /* font-size: 120%; */

                    /* Font smoothing. That was taken from TWBS */
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;

                    /* Uncomment for 3D effect */
                    /* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */
                }

                .icon-phone:before {
                    content: "\e801";
                }

            </style>
        </head>

        <body style="margin: 0;padding: 0;box-sizing: border-box;background-color: #edeef0;">
            <header style="margin: 13px;padding: 0;box-sizing: border-box;">
                <h1 style="margin: 0;padding: 0;box-sizing: border-box;font-size: 1.5em;text-align: center;">Новый лид из сервиса ВКонтакте!</h1>
            </header>
            <main style="margin: 0 auto;padding: 0;box-sizing: border-box;max-width: 760px;">
                <div class="container" style="margin: 5px 5px 10px 5px;padding: 8px;box-sizing: border-box;border: 1px solid black;background-color: #f5f3f3;border-radius: 15px;">
                    <header class="inner" style="margin: 0 0 10px 0;padding: 0;box-sizing: border-box;color: #6d6d6d;">
                        <h2 style="margin: 0;padding: 0;box-sizing: border-box;font-size: 1.3em;text-align: center;">Параметры машины</h2>
                    </header>
                    <div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: start;margin-bottom: 12px;">
                        <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;margin-right: 7px;font-weight: 550;">Модель:</p>
                        <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;">'.$car.'</p>
                    </div>
                    <div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: start;margin-bottom: 12px;">
                        <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;margin-right: 7px;font-weight: 550;">Модификация:</p>
                        <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;">'.$modification.'</p>
                    </div>
                    <div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: start;margin-bottom: 12px;">
                        <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;margin-right: 7px;font-weight: 550;">Пробег или время:</p>
                        <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;">'.$oldness.'</p>
                    </div>
                </div>
                <div class="container calculations" style="margin: 5px 5px 10px 5px;padding: 8px;box-sizing: border-box;border: 1px solid black;background-color: #f5f3f3;border-radius: 15px;">
                    <div class="row" style="margin: 0;padding: 0;box-sizing: border-box;">
                        <div class="works" style="margin: 0;padding: 0;box-sizing: border-box;">
                            <header class="inner" style="margin: 0 0 10px 0;padding: 0;box-sizing: border-box;color: #6d6d6d;">
                                <h2 style="margin: 0;padding: 0;box-sizing: border-box;font-size: 1.3em;text-align: center;">Работы</h2>
                            </header>'.$works.'
                            <div class="param-container summary" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: space-between;margin-bottom: 12px;">
                                <strong style="margin: auto 0;padding: 0;box-sizing: border-box;margin-right: 7px;font-weight: 550;">Итого по работам</strong>
                                <strong class="money" style="margin: auto 0;padding: 0;box-sizing: border-box;white-space: nowrap;">'."$worksSummary".' руб</strong>
                            </div>
                        </div>
                        <div class="materials" style="margin: 0;padding: 0;box-sizing: border-box;">
                            <header class="inner" style="margin: 0 0 10px 0;padding: 0;box-sizing: border-box;color: #6d6d6d;">
                                <h2 style="margin: 0;padding: 0;box-sizing: border-box;font-size: 1.3em;text-align: center;">Материалы</h2>
                            </header>'.$materials.'
                            <div class="param-container summary" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: space-between;margin-bottom: 12px;">
                                <strong style="margin: auto 0;padding: 0;box-sizing: border-box;margin-right: 7px;font-weight: 550;">Итого по материалам</strong>
                                <strong class="money" style="margin: auto 0;padding: 0;box-sizing: border-box;white-space: nowrap;">'."$materialsSummary".' руб</strong>
                            </div>
                        </div>
                    </div>
                    <div class="row summary-row" style="margin: 0;padding: 0;box-sizing: border-box;">
                        <div class="param-container summary" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: space-between;margin-bottom: 12px;">
                            <strong style="margin: auto 0;padding: 0;box-sizing: border-box;margin-right: 7px;font-weight: 550;">Итого</strong>
                            <strong class="money" style="margin: auto 0;padding: 0;box-sizing: border-box;white-space: nowrap;">'."$overallSummary".' руб</strong>
                        </div>
                    </div>
                </div>
                <div class="container" style="margin: 5px 5px 10px 5px;padding: 8px;box-sizing: border-box;border: 1px solid black;background-color: #f5f3f3;border-radius: 15px;">
                    <div class="user-contacts" style="margin: 0;padding: 0;box-sizing: border-box;">
                        <div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: start;margin-bottom: 12px;">
                            <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;margin-right: 7px;font-weight: 550;">Имя</p>
                            <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;">'.$name.'</p>
                        </div>
                        <div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: start;margin-bottom: 12px;">
                            <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;margin-right: 7px;font-weight: 550;">Телефон</p>
                            <p style="margin: auto 0;padding: 0;box-sizing: border-box;margin-block-start: 0.5em;margin-block-end: 0.5em;">'.$phone.'</p>
                        </div>
                        <div class="param-container" style="margin: 0;padding: 0;box-sizing: border-box;display: flex;flex-direction: row;justify-content: start;margin-bottom: 12px;">
                            <button class="call" style="margin: 0 auto;padding: 10px 5px;box-sizing: border-box;border-radius: 5px;background-color: #6464dc;cursor: pointer;border: 1px solid black;width: 80%;max-width: 300px;display: flex;justify-content: center;transition-duration: 200ms;">
                                <i class="icon-phone" style="margin: 0;padding: 0;box-sizing: border-box;text-decoration: none;color: white;font-size: 1.5em;margin-right: 10px;"></i>
                                <a href="tel:'.$phone.'" style="margin: 0;padding: 0;box-sizing: border-box;text-decoration: none;color: white;font-size: 1.3em;">Позвонить</a>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </body>

        </html>';
		return $template;
    }
    $string_works = '[
        {
          "name": "Замена моторного масла (без снятия защиты ДВС)",
          "price": "600"
        },
        {
            "name":"Диагностика (всех система, включая компьютерную, а также осмотр дроссельной заслонки)",
            "price": "1490"
        }
      ]
      ';
    $string_materials = '[
        {
          "name": "Прокладка сливной пробки",
          "price": "1600"
        },
        {
            "name":"Фильтр вентиляции салона",
            "price": "1000"
        }
      ]
      ';
    $string_works = $_GET['works'];
    $string_materials = $_GET['materials'];
    $car = $_GET['model'];
    $modification = $_GET['modification'];
    $oldness = $_GET['oldness'];
    $name = htmlspecialchars($_GET['name']);
    $phone = $_GET['phone'];
    $works = json_decode($string_works, TRUE);
    $materials = json_decode($string_materials, TRUE);
    $content = createMessage($car, $modification, $oldness, $works, $materials, $name, $phone);
	email($content);
    echo('{"ok": true}');
