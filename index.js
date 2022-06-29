document.addEventListener('DOMContentLoaded', function(){
    var timer = null;

    var last_ts = 0;
    var tickcount = 0;

    var tick_input = document.getElementById('tick');
    var interval_input = document.getElementById('inverval');
    var play_button = document.getElementById('play');
    var font_value = document.getElementById('size_value');
    var width_value = document.getElementById('width_value');
    var tick = document.getElementById('tick');
    var doc = document.getElementsByTagName('body')[0];
    var video_stop = document.getElementById('video_stop')
    var video_play_pause = document.getElementById('video_play_pause')

    var playing = false;

    var history_index = 0;

    var tick_size = 0;
    var player_size = 0;
    var body_size = 0;
    function get_font_size() {
        tick_size = window.getComputedStyle(tick).getPropertyValue('font-size');
        tick_size = parseInt(tick_size.substring(0, tick_size.indexOf('px')));

        var player = document.getElementById('player');
        player_size = window.getComputedStyle(player).getPropertyValue('width');
        if (player_size == 'auto') {
            player_size = window.getComputedStyle(tick).getPropertyValue('width');
        }
        player_size = parseInt(player_size.substring(0, player_size.indexOf('px')));

        body_size = window.getComputedStyle(doc).getPropertyValue('font-size');
        body_size = parseInt(body_size.substring(0, body_size.indexOf('px')));
    }

    get_font_size();
    font_value.textContent = tick_size / body_size;

    function sub_font_size() {
        get_font_size();
        var em = tick_size / body_size - 1;

        font_value.textContent = em;
        tick.style.fontSize = em + 'em';

        width_value.textContent = parseInt(player_size / body_size);
    }
    document.sub_font_size = sub_font_size;

    function add_font_size() {
        get_font_size();
        var em = tick_size / body_size + 1;
        font_value.textContent = em;
        tick.style.fontSize = em + 'em';
    }
    document.add_font_size = add_font_size;

    function sub_player_width() {
        get_font_size();
        var em = player_size / body_size - 1;
        player.style.fontSize = em + 'em';
    }

    function play_video(target) {
        var player = document.getElementById('player');
        var name = target.value;
        if (name == '停止') {
            player.style.display = 'none';
            player.pause();
            playing = false;
            document.getElementById('options').style.removeProperty('background-color');
            video_stop.disabled = true
            video_play_pause.disabled = true;
        }
        else if (name == '继续') {
            target.value = '暂停'
            player.play();
            start_stop();

        }
        else if (name == '暂停') {
            target.value = '继续'
            player.pause();
            start_stop();
        }
        else {
            var prefix = window.location.hostname.length == 0 ? 'file:///D:/Downloads/' : '/static/video/';
            player.setAttribute('src', prefix + player.getAttribute('data-src-' + name));
            player.style.display = 'inline-block';
            player.play();
            playing = true;
            video_stop.disabled = false
            video_play_pause.disabled = false;
            video_play_pause.value = '暂停';

            if (play_button.value === '开始') {
                var ts = (new Date()).valueOf();
                last_ts = ts - tickcount;
                play_button.value = '停止';
                start();
            }
        }
    }
    document.play_video = play_video;

    document.getElementById('option_container').addEventListener('mouseover', function (event) {
        if (playing) {
            document.getElementById('options').style.backgroundColor = 'white';
            document.getElementById('dummy_options').style.backgroundColor = 'white';
        }
        else {
            document.getElementById('options').style.removeProperty('background-color');
            document.getElementById('dummy_options').style.removeProperty('background-color');
        }
    }, false);

    document.getElementById('option_container').addEventListener('mouseleave', function (event) {
        document.getElementById('options').style.removeProperty('background-color');
        document.getElementById('dummy_options').style.removeProperty('background-color');
    }, false);

    function start_stop() {
        var ts = (new Date()).valueOf();
        last_ts = ts - tickcount;

        if (play_button.value === '开始') {
            play_button.value = '停止';
            start();
        }
        else if (play_button.value === '停止') {
            play_button.value = '开始';
            stop();
        }
    }
    document.start_stop = start_stop;

    function start() {
        clearInterval(timer);

        var heartbeat = get_interval();

        timer = setInterval(
            function () {
                var ts = (new Date()).valueOf();
                tickcount = ts - last_ts;

                var temp = tickcount;
                var hours = parseInt(temp / 3600000);

                temp %= 3600000;
                var minutes = parseInt(temp / 60000);

                temp %= 60000;
                var seconds = parseInt(temp / 1000);

                var milliseconds = parseInt(temp % 1000);

                tick_input.value = hundred_padding(hours)
                    + ':' + hundred_padding(minutes)
                    + ':' + hundred_padding(seconds)
                    + '.' + thousand_padding(milliseconds);
            },
            heartbeat
        );
    };

    function stop() {
        clearInterval(timer);
    }

    function reset(keep_history) {
        clearInterval(timer);
        play_button.value = '开始';
        interval_input.value = 1;
        tick_input.value = '00:00:00.000';
        tickcount = 0;

        if (!keep_history) {
            reset_history();
        }
    }
    document.reset = reset;

    function reset_history() {
        history_index = 0;
        var history = document.getElementById('history');
        while (history.firstChild) {
            history.removeChild(history.firstChild);
        }
    }

    function split() {
        var history = document.getElementById('history');
        var li = document.createElement('li');
        var text = document.createTextNode(history_index + '. ' + tick_input.value);
        li.appendChild(text);
        history.appendChild(li);
        history_index++;
    }
    document.split = split;

    function split_reset() {
        split();
        reset(true);
        start_stop();
    }
    document.split_reset = split_reset;

    function hundred_padding(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function thousand_padding(n) {
        if (n < 10)
            return '00' + n;
        else if (n < 100)
            return '0' + n;
        else
            return '' + n;
    }

    function get_interval() {
        var v = interval_input.value;
        if (v.length == 0) {
            v = 1;
            interval_input.value = 1;
        }
        else {
            v = parseInt(v);
            if (v < 1 || v > 1000) {
                v = 1;
                interval_input.value = 1;
            }
        }

        return v;
    }
});
