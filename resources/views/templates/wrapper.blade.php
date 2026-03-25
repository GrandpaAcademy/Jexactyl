<!DOCTYPE html>
<html lang="en">
    <head>
        <title>{{ config('app.name', 'Zero-Bot.net') }} — Game Server Panel</title>

        @section('meta')
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
            <meta name="csrf-token" content="{{ csrf_token() }}">
            <meta name="robots" content="noindex">
            <meta name="description" content="Zero-Bot.net — Premium game server management panel. Fast, modern, and feature-rich.">
            <meta name="theme-color" content="#00F0FF">

            {{-- Favicon --}}
            <link rel="apple-touch-icon" sizes="180x180" href="https://xxxxxcdn.zero-bot.net/logo-icon.svg">
            <link rel="icon" type="image/svg+xml" href="https://xxxxxcdn.zero-bot.net/logo-icon.svg">
            <link rel="shortcut icon" href="https://xxxxxcdn.zero-bot.net/logo-icon.svg">
            <meta name="msapplication-config" content="/favicons/browserconfig.xml">

            {{-- Google Fonts preconnect --}}
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        @show

        @section('user-data')
            @if(!is_null(Auth::user()))
                <script>
                    window.PterodactylUser = {!! json_encode(Auth::user()->toReactObject(), JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) !!};
                </script>
            @endif
            @if(!empty($siteConfiguration))
                <script>
                    window.SiteConfiguration = {!! json_encode($siteConfiguration, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) !!};
                </script>
            @endif
            @if(!empty($everestConfiguration))
                <script>
                    window.EverestConfiguration = {!! json_encode($everestConfiguration, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) !!};
                </script>
            @endif
            @if(!empty($themeConfiguration))
                <script>
                    window.ThemeConfiguration = {!! json_encode($themeConfiguration, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) !!};
                </script>
            @endif
        @show
        <style>
            /* Zero-Bot.net — Minimal flash-of-unstyled-content prevention */
            body { background-color: #0A0E17; }
        </style>

        @yield('assets')

        @include('layouts.scripts')

        @viteReactRefresh
        @vite('resources/scripts/index.tsx')
    </head>
    <body>
        @section('content')
            @yield('above-container')
            @yield('container')
            @yield('below-container')
        @show
    </body>
</html>
