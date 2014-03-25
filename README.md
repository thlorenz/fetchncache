# fetchncache [![build status](https://secure.travis-ci.org/thlorenz/fetchncache.png)](http://travis-ci.org/thlorenz/fetchncache)

Fetches a resource from a server and stores it inside a redis cache so the next time it grabs it from there

```js
// TODO
```

## Status

Nix, Nada, Nichevo, Nothing --> go away!
## Installation

    npm install fetchncache

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="fetchncache"><span class="type-signature"></span>fetchncache<span class="signature">(<span class="optional">opts</span>)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a fetchncache instance.</p>
<h4>redis opts</h4>
<ul>
<li><strong>opts.redis.host</strong>  <em>{number=}</em> host at which redis is listening, defaults to <code>127.0.0.1</code></li>
<li><strong>opts.redis.port</strong>  <em>{string=}</em> port at which redis is listening, defaults to <code>6379</code></li>
</ul>
<h4>service opts</h4>
<ul>
<li><strong>opts.service.url</strong> <em>{string=}</em> url at which to reach the service</li>
</ul>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last">
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>redis</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>redis options passed straight to <a href="https://github.com/mranney/node_redis">redis</a> (@see above)</p></td>
</tr>
<tr>
<td class="name"><code>service</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>options specifying how to reach the service that provides the data (@see above)</p></td>
</tr>
<tr>
<td class="name"><code>expire</code></td>
<td class="type">
<span class="param-type">number</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>the default number of seconds after which to expire a resource from the redis cache (defaults to 15mins)</p></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js#L10">lineno 10</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>fetchncache instance</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="fetchncache::clearCache"><span class="type-signature"></span>fetchncache::clearCache<span class="signature">()</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Clears the entire redis cache, so use with care.
Mainly useful for testing or to ensure that all resources get refreshed.</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js#L93">lineno 93</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>fetchncache instance</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="fetchncache::stop"><span class="type-signature"></span>fetchncache::stop<span class="signature">(<span class="optional">force</span>)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops the redis client in order to allow exiting the application.
At this point this fetchncache instance becomes unusable and throws errors on any attempts to use it.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>force</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>will make it more aggressive about ending the underlying redis client (default: false)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js#L79">lineno 79</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="fetcncache::fetch"><span class="type-signature"></span>fetcncache::fetch<span class="signature">(uri, <span class="optional">opts</span>, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Fetches the resource, probing the redis cache first and falling back to the service.
If a transform function is provided (@see opts), that is applied to the result before returning or caching it.
When fetched from the service it is added to the redis cached according to the provided options.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>uri</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>path to the resource, i.e. <code>/reource1?q=1234</code></p></td>
</tr>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>configure caching and transformation behavior for this particular resource</p>
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>expire</code></td>
<td class="type">
<span class="param-type">number</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>overrides default expire for this particular resource</p></td>
</tr>
<tr>
<td class="name"><code>transform</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>specify the transform function to be applied, default: <code>function (res} { return res }</code></p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>called back with an error or the transformed resource</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/fetchncache/blob/master/index.js#L45">lineno 45</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
