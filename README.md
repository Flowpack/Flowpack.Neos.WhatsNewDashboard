# Neos.WhatsNewDashboard
Backend module for the Neos CMS to show news about, e.g. a new Neos Version or new features in your project. 
This packages needs a neos instance which has the [Neos.WhatsNewEditor.InMyProject](https://github.com/sandstorm/Neos.WhatsNewEditor.InMyProject) package installed and contains a news page with content. 

## Integration

### Installation

As long as it is not published on packagist:
* add github repo to your repositories in your `composer.json`:
```json
"repositories": {
    ...
    "neos-whatsnewdashboard": {
        "type": "vcs",
        "url": "https://github.com/sandstorm/Neos.WhatsNewDashboard"
    },
    ...
},
```
* require package in your `composer.json` with `composer require flowpack/neos-whatsnewdashboard:@dev`, which should result in:
```json
"require": {
    ...,
    "flowpack/neos-whatsnewdashboard": "@dev",
    ...
}
```

After publishing on packagist:
* install via composer with `composer require flowpack/neos-whatsnewdashboard`

### Usage

We assume you have either a neos instance which contains a news page created by the [Neos.WhatsNewEditor.InMyProject](https://github.com/sandstorm/Neos.WhatsNewEditor.InMyProject) package or such a a news page in your own instance. To show those news for your project add the `inProjectSourceUrl` to your `Settings.yaml` like this:

```yaml
Flowpack:
  Neos:
    WhatsNewDashboard:
      inProjectSourceUrl: 'https://my-page.de/whats-new' # example url
```

### Flowpack.ContentSecurityPolicy package

When you have the `Flowpack.ContentSecurityPolicy` installed and your source neos instance is not your project, then you have to add the source origin in your `ContentSecurityPolicy` config:

```yaml
Flowpack:
  ContentSecurityPolicy:
    content-security-policy:
      custom-backend:
        frame-src:
          - 'https://my-page.de/'
```

