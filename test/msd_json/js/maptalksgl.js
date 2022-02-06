/*!
 * @maptalks/gl v0.65.3
 * LICENSE : UNLICENSED
 * (c) 2016-2022 maptalks.com
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.maptalksgl = {}, global.maptalks));
}(this, (function (exports, t$1) { 'use strict';

	function _interopNamespace(e) {
		if (e && e.__esModule) return e;
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () {
							return e[k];
						}
					});
				}
			});
		}
		n['default'] = e;
		return Object.freeze(n);
	}

	var t__namespace = /*#__PURE__*/_interopNamespace(t$1);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var regl = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory() ;
	}(commonjsGlobal, (function () {
	var isTypedArray = function (x) {
	  return (
	    x instanceof Uint8Array ||
	    x instanceof Uint16Array ||
	    x instanceof Uint32Array ||
	    x instanceof Int8Array ||
	    x instanceof Int16Array ||
	    x instanceof Int32Array ||
	    x instanceof Float32Array ||
	    x instanceof Float64Array ||
	    x instanceof Uint8ClampedArray
	  )
	};

	var extend = function (base, opts) {
	  var keys = Object.keys(opts);
	  for (var i = 0; i < keys.length; ++i) {
	    base[keys[i]] = opts[keys[i]];
	  }
	  return base
	};

	// Error checking and parameter validation.
	//
	// Statements for the form `check.someProcedure(...)` get removed by
	// a browserify transform for optimized/minified bundles.
	//
	/* globals atob */
	var endl = '\n';

	// only used for extracting shader names.  if atob not present, then errors
	// will be slightly crappier
	function decodeB64 (str) {
	  if (typeof atob !== 'undefined') {
	    return atob(str)
	  }
	  return 'base64:' + str
	}

	function raise (message) {
	  var error = new Error('(regl) ' + message);
	  console.error(error);
	  throw error
	}

	function check (pred, message) {
	  if (!pred) {
	    raise(message);
	  }
	}

	function encolon (message) {
	  if (message) {
	    return ': ' + message
	  }
	  return ''
	}

	function checkParameter (param, possibilities, message) {
	  if (!(param in possibilities)) {
	    raise('unknown parameter (' + param + ')' + encolon(message) +
	          '. possible values: ' + Object.keys(possibilities).join());
	  }
	}

	function checkIsTypedArray (data, message) {
	  if (!isTypedArray(data)) {
	    raise(
	      'invalid parameter type' + encolon(message) +
	      '. must be a typed array');
	  }
	}

	function standardTypeEh (value, type) {
	  switch (type) {
	    case 'number': return typeof value === 'number'
	    case 'object': return typeof value === 'object'
	    case 'string': return typeof value === 'string'
	    case 'boolean': return typeof value === 'boolean'
	    case 'function': return typeof value === 'function'
	    case 'undefined': return typeof value === 'undefined'
	    case 'symbol': return typeof value === 'symbol'
	  }
	}

	function checkTypeOf (value, type, message) {
	  if (!standardTypeEh(value, type)) {
	    raise(
	      'invalid parameter type' + encolon(message) +
	      '. expected ' + type + ', got ' + (typeof value));
	  }
	}

	function checkNonNegativeInt (value, message) {
	  if (!((value >= 0) &&
	        ((value | 0) === value))) {
	    raise('invalid parameter type, (' + value + ')' + encolon(message) +
	          '. must be a nonnegative integer');
	  }
	}

	function checkOneOf (value, list, message) {
	  if (list.indexOf(value) < 0) {
	    raise('invalid value' + encolon(message) + '. must be one of: ' + list);
	  }
	}

	var constructorKeys = [
	  'gl',
	  'canvas',
	  'container',
	  'attributes',
	  'pixelRatio',
	  'extensions',
	  'optionalExtensions',
	  'profile',
	  'onDone'
	];

	function checkConstructor (obj) {
	  Object.keys(obj).forEach(function (key) {
	    if (constructorKeys.indexOf(key) < 0) {
	      raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
	    }
	  });
	}

	function leftPad (str, n) {
	  str = str + '';
	  while (str.length < n) {
	    str = ' ' + str;
	  }
	  return str
	}

	function ShaderFile () {
	  this.name = 'unknown';
	  this.lines = [];
	  this.index = {};
	  this.hasErrors = false;
	}

	function ShaderLine (number, line) {
	  this.number = number;
	  this.line = line;
	  this.errors = [];
	}

	function ShaderError (fileNumber, lineNumber, message) {
	  this.file = fileNumber;
	  this.line = lineNumber;
	  this.message = message;
	}

	function guessCommand () {
	  var error = new Error();
	  var stack = (error.stack || error).toString();
	  var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
	  if (pat) {
	    return pat[1]
	  }
	  var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
	  if (pat2) {
	    return pat2[1]
	  }
	  return 'unknown'
	}

	function guessCallSite () {
	  var error = new Error();
	  var stack = (error.stack || error).toString();
	  var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
	  if (pat) {
	    return pat[1]
	  }
	  var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
	  if (pat2) {
	    return pat2[1]
	  }
	  return 'unknown'
	}

	function parseSource (source, command) {
	  var lines = source.split('\n');
	  var lineNumber = 1;
	  var fileNumber = 0;
	  var files = {
	    unknown: new ShaderFile(),
	    0: new ShaderFile()
	  };
	  files.unknown.name = files[0].name = command || guessCommand();
	  files.unknown.lines.push(new ShaderLine(0, ''));
	  for (var i = 0; i < lines.length; ++i) {
	    var line = lines[i];
	    var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line);
	    if (parts) {
	      switch (parts[1]) {
	        case 'line':
	          var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
	          if (lineNumberInfo) {
	            lineNumber = lineNumberInfo[1] | 0;
	            if (lineNumberInfo[2]) {
	              fileNumber = lineNumberInfo[2] | 0;
	              if (!(fileNumber in files)) {
	                files[fileNumber] = new ShaderFile();
	              }
	            }
	          }
	          break
	        case 'define':
	          var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
	          if (nameInfo) {
	            files[fileNumber].name = (nameInfo[1]
	              ? decodeB64(nameInfo[2])
	              : nameInfo[2]);
	          }
	          break
	      }
	    }
	    files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
	  }
	  Object.keys(files).forEach(function (fileNumber) {
	    var file = files[fileNumber];
	    file.lines.forEach(function (line) {
	      file.index[line.number] = line;
	    });
	  });
	  return files
	}

	function parseErrorLog (errLog) {
	  var result = [];
	  errLog.split('\n').forEach(function (errMsg) {
	    if (errMsg.length < 5) {
	      return
	    }
	    var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
	    if (parts) {
	      result.push(new ShaderError(
	        parts[1] | 0,
	        parts[2] | 0,
	        parts[3].trim()));
	    } else if (errMsg.length > 0) {
	      result.push(new ShaderError('unknown', 0, errMsg));
	    }
	  });
	  return result
	}

	function annotateFiles (files, errors) {
	  errors.forEach(function (error) {
	    var file = files[error.file];
	    if (file) {
	      var line = file.index[error.line];
	      if (line) {
	        line.errors.push(error);
	        file.hasErrors = true;
	        return
	      }
	    }
	    files.unknown.hasErrors = true;
	    files.unknown.lines[0].errors.push(error);
	  });
	}

	function checkShaderError (gl, shader, source, type, command) {
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    var errLog = gl.getShaderInfoLog(shader);
	    var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
	    checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
	    var files = parseSource(source, command);
	    var errors = parseErrorLog(errLog);
	    annotateFiles(files, errors);

	    Object.keys(files).forEach(function (fileNumber) {
	      var file = files[fileNumber];
	      if (!file.hasErrors) {
	        return
	      }

	      var strings = [''];
	      var styles = [''];

	      function push (str, style) {
	        strings.push(str);
	        styles.push(style || '');
	      }

	      push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

	      file.lines.forEach(function (line) {
	        if (line.errors.length > 0) {
	          push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
	          push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');

	          // try to guess token
	          var offset = 0;
	          line.errors.forEach(function (error) {
	            var message = error.message;
	            var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
	            if (token) {
	              var tokenPat = token[1];
	              message = token[2];
	              switch (tokenPat) {
	                case 'assign':
	                  tokenPat = '=';
	                  break
	              }
	              offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
	            } else {
	              offset = 0;
	            }

	            push(leftPad('| ', 6));
	            push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
	            push(leftPad('| ', 6));
	            push(message + endl, 'font-weight:bold');
	          });
	          push(leftPad('| ', 6) + endl);
	        } else {
	          push(leftPad(line.number, 4) + '|  ');
	          push(line.line + endl, 'color:red');
	        }
	      });
	      if (typeof document !== 'undefined' && !window.chrome) {
	        styles[0] = strings.join('%c');
	        console.log.apply(console, styles);
	      } else {
	        console.log(strings.join(''));
	      }
	    });

	    check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
	  }
	}

	function checkLinkError (gl, program, fragShader, vertShader, command) {
	  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	    var errLog = gl.getProgramInfoLog(program);
	    var fragParse = parseSource(fragShader, command);
	    var vertParse = parseSource(vertShader, command);

	    var header = 'Error linking program with vertex shader, "' +
	      vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

	    if (typeof document !== 'undefined') {
	      console.log('%c' + header + endl + '%c' + errLog,
	        'color:red;text-decoration:underline;font-weight:bold',
	        'color:red');
	    } else {
	      console.log(header + endl + errLog);
	    }
	    check.raise(header);
	  }
	}

	function saveCommandRef (object) {
	  object._commandRef = guessCommand();
	}

	function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
	  saveCommandRef(opts);

	  function id (str) {
	    if (str) {
	      return stringStore.id(str)
	    }
	    return 0
	  }
	  opts._fragId = id(opts.static.frag);
	  opts._vertId = id(opts.static.vert);

	  function addProps (dict, set) {
	    Object.keys(set).forEach(function (u) {
	      dict[stringStore.id(u)] = true;
	    });
	  }

	  var uniformSet = opts._uniformSet = {};
	  addProps(uniformSet, uniforms.static);
	  addProps(uniformSet, uniforms.dynamic);

	  var attributeSet = opts._attributeSet = {};
	  addProps(attributeSet, attributes.static);
	  addProps(attributeSet, attributes.dynamic);

	  opts._hasCount = (
	    'count' in opts.static ||
	    'count' in opts.dynamic ||
	    'elements' in opts.static ||
	    'elements' in opts.dynamic);
	}

	function commandRaise (message, command) {
	  var callSite = guessCallSite();
	  raise(message +
	    ' in command ' + (command || guessCommand()) +
	    (callSite === 'unknown' ? '' : ' called from ' + callSite));
	}

	function checkCommand (pred, message, command) {
	  if (!pred) {
	    commandRaise(message, command || guessCommand());
	  }
	}

	function checkParameterCommand (param, possibilities, message, command) {
	  if (!(param in possibilities)) {
	    commandRaise(
	      'unknown parameter (' + param + ')' + encolon(message) +
	      '. possible values: ' + Object.keys(possibilities).join(),
	      command || guessCommand());
	  }
	}

	function checkCommandType (value, type, message, command) {
	  if (!standardTypeEh(value, type)) {
	    commandRaise(
	      'invalid parameter type' + encolon(message) +
	      '. expected ' + type + ', got ' + (typeof value),
	      command || guessCommand());
	  }
	}

	function checkOptional (block) {
	  block();
	}

	function checkFramebufferFormat (attachment, texFormats, rbFormats) {
	  if (attachment.texture) {
	    checkOneOf(
	      attachment.texture._texture.internalformat,
	      texFormats,
	      'unsupported texture format for attachment');
	  } else {
	    checkOneOf(
	      attachment.renderbuffer._renderbuffer.format,
	      rbFormats,
	      'unsupported renderbuffer format for attachment');
	  }
	}

	var GL_CLAMP_TO_EDGE = 0x812F;

	var GL_NEAREST = 0x2600;
	var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
	var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
	var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
	var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

	var GL_BYTE = 5120;
	var GL_UNSIGNED_BYTE = 5121;
	var GL_SHORT = 5122;
	var GL_UNSIGNED_SHORT = 5123;
	var GL_INT = 5124;
	var GL_UNSIGNED_INT = 5125;
	var GL_FLOAT = 5126;

	var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
	var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
	var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
	var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

	var GL_HALF_FLOAT_OES = 0x8D61;

	var TYPE_SIZE = {};

	TYPE_SIZE[GL_BYTE] =
	TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

	TYPE_SIZE[GL_SHORT] =
	TYPE_SIZE[GL_UNSIGNED_SHORT] =
	TYPE_SIZE[GL_HALF_FLOAT_OES] =
	TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
	TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
	TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

	TYPE_SIZE[GL_INT] =
	TYPE_SIZE[GL_UNSIGNED_INT] =
	TYPE_SIZE[GL_FLOAT] =
	TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

	function pixelSize (type, channels) {
	  if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
	      type === GL_UNSIGNED_SHORT_4_4_4_4 ||
	      type === GL_UNSIGNED_SHORT_5_6_5) {
	    return 2
	  } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
	    return 4
	  } else {
	    return TYPE_SIZE[type] * channels
	  }
	}

	function isPow2 (v) {
	  return !(v & (v - 1)) && (!!v)
	}

	function checkTexture2D (info, mipData, limits) {
	  var i;
	  var w = mipData.width;
	  var h = mipData.height;
	  var c = mipData.channels;

	  // Check texture shape
	  check(w > 0 && w <= limits.maxTextureSize &&
	        h > 0 && h <= limits.maxTextureSize,
	  'invalid texture shape');

	  // check wrap mode
	  if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
	    check(isPow2(w) && isPow2(h),
	      'incompatible wrap mode for texture, both width and height must be power of 2');
	  }

	  if (mipData.mipmask === 1) {
	    if (w !== 1 && h !== 1) {
	      check(
	        info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
	        info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
	        info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
	        info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
	        'min filter requires mipmap');
	    }
	  } else {
	    // texture must be power of 2
	    check(isPow2(w) && isPow2(h),
	      'texture must be a square power of 2 to support mipmapping');
	    check(mipData.mipmask === (w << 1) - 1,
	      'missing or incomplete mipmap data');
	  }

	  if (mipData.type === GL_FLOAT) {
	    if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
	      check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
	        'filter not supported, must enable oes_texture_float_linear');
	    }
	    check(!info.genMipmaps,
	      'mipmap generation not supported with float textures');
	  }

	  // check image complete
	  var mipimages = mipData.images;
	  for (i = 0; i < 16; ++i) {
	    if (mipimages[i]) {
	      var mw = w >> i;
	      var mh = h >> i;
	      check(mipData.mipmask & (1 << i), 'missing mipmap data');

	      var img = mipimages[i];

	      check(
	        img.width === mw &&
	        img.height === mh,
	        'invalid shape for mip images');

	      check(
	        img.format === mipData.format &&
	        img.internalformat === mipData.internalformat &&
	        img.type === mipData.type,
	        'incompatible type for mip image');

	      if (img.compressed) ; else if (img.data) {
	        // check(img.data.byteLength === mw * mh *
	        // Math.max(pixelSize(img.type, c), img.unpackAlignment),
	        var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
	        check(img.data.byteLength === rowSize * mh,
	          'invalid data for image, buffer size is inconsistent with image format');
	      } else if (img.element) ; else if (img.copy) ;
	    } else if (!info.genMipmaps) {
	      check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
	    }
	  }

	  if (mipData.compressed) {
	    check(!info.genMipmaps,
	      'mipmap generation for compressed images not supported');
	  }
	}

	function checkTextureCube (texture, info, faces, limits) {
	  var w = texture.width;
	  var h = texture.height;
	  var c = texture.channels;

	  // Check texture shape
	  check(
	    w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
	    'invalid texture shape');
	  check(
	    w === h,
	    'cube map must be square');
	  check(
	    info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
	    'wrap mode not supported by cube map');

	  for (var i = 0; i < faces.length; ++i) {
	    var face = faces[i];
	    check(
	      face.width === w && face.height === h,
	      'inconsistent cube map face shape');

	    if (info.genMipmaps) {
	      check(!face.compressed,
	        'can not generate mipmap for compressed textures');
	      check(face.mipmask === 1,
	        'can not specify mipmaps and generate mipmaps');
	    }

	    var mipmaps = face.images;
	    for (var j = 0; j < 16; ++j) {
	      var img = mipmaps[j];
	      if (img) {
	        var mw = w >> j;
	        var mh = h >> j;
	        check(face.mipmask & (1 << j), 'missing mipmap data');
	        check(
	          img.width === mw &&
	          img.height === mh,
	          'invalid shape for mip images');
	        check(
	          img.format === texture.format &&
	          img.internalformat === texture.internalformat &&
	          img.type === texture.type,
	          'incompatible type for mip image');

	        if (img.compressed) ; else if (img.data) {
	          check(img.data.byteLength === mw * mh *
	            Math.max(pixelSize(img.type, c), img.unpackAlignment),
	          'invalid data for image, buffer size is inconsistent with image format');
	        } else if (img.element) ; else if (img.copy) ;
	      }
	    }
	  }
	}

	var check$1 = extend(check, {
	  optional: checkOptional,
	  raise: raise,
	  commandRaise: commandRaise,
	  command: checkCommand,
	  parameter: checkParameter,
	  commandParameter: checkParameterCommand,
	  constructor: checkConstructor,
	  type: checkTypeOf,
	  commandType: checkCommandType,
	  isTypedArray: checkIsTypedArray,
	  nni: checkNonNegativeInt,
	  oneOf: checkOneOf,
	  shaderError: checkShaderError,
	  linkError: checkLinkError,
	  callSite: guessCallSite,
	  saveCommandRef: saveCommandRef,
	  saveDrawInfo: saveDrawCommandInfo,
	  framebufferFormat: checkFramebufferFormat,
	  guessCommand: guessCommand,
	  texture2D: checkTexture2D,
	  textureCube: checkTextureCube
	});

	var VARIABLE_COUNTER = 0;

	var DYN_FUNC = 0;
	var DYN_CONSTANT = 5;
	var DYN_ARRAY = 6;

	function DynamicVariable (type, data) {
	  this.id = (VARIABLE_COUNTER++);
	  this.type = type;
	  this.data = data;
	}

	function escapeStr (str) {
	  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
	}

	function splitParts (str) {
	  if (str.length === 0) {
	    return []
	  }

	  var firstChar = str.charAt(0);
	  var lastChar = str.charAt(str.length - 1);

	  if (str.length > 1 &&
	      firstChar === lastChar &&
	      (firstChar === '"' || firstChar === "'")) {
	    return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
	  }

	  var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
	  if (parts) {
	    return (
	      splitParts(str.substr(0, parts.index))
	        .concat(splitParts(parts[1]))
	        .concat(splitParts(str.substr(parts.index + parts[0].length)))
	    )
	  }

	  var subparts = str.split('.');
	  if (subparts.length === 1) {
	    return ['"' + escapeStr(str) + '"']
	  }

	  var result = [];
	  for (var i = 0; i < subparts.length; ++i) {
	    result = result.concat(splitParts(subparts[i]));
	  }
	  return result
	}

	function toAccessorString (str) {
	  return '[' + splitParts(str).join('][') + ']'
	}

	function defineDynamic (type, data) {
	  return new DynamicVariable(type, toAccessorString(data + ''))
	}

	function isDynamic (x) {
	  return (typeof x === 'function' && !x._reglType) || (x instanceof DynamicVariable)
	}

	function unbox (x, path) {
	  if (typeof x === 'function') {
	    return new DynamicVariable(DYN_FUNC, x)
	  } else if (typeof x === 'number' || typeof x === 'boolean') {
	    return new DynamicVariable(DYN_CONSTANT, x)
	  } else if (Array.isArray(x)) {
	    return new DynamicVariable(DYN_ARRAY, x.map(function (y, i) { return unbox(y, path + '[' + i + ']') }))
	  } else if (x instanceof DynamicVariable) {
	    return x
	  }
	  check$1(false, 'invalid option type in uniform ' + path);
	}

	var dynamic = {
	  DynamicVariable: DynamicVariable,
	  define: defineDynamic,
	  isDynamic: isDynamic,
	  unbox: unbox,
	  accessor: toAccessorString
	};

	/* globals requestAnimationFrame, cancelAnimationFrame */
	var raf = {
	  next: typeof requestAnimationFrame === 'function'
	    ? function (cb) { return requestAnimationFrame(cb) }
	    : function (cb) { return setTimeout(cb, 16) },
	  cancel: typeof cancelAnimationFrame === 'function'
	    ? function (raf) { return cancelAnimationFrame(raf) }
	    : clearTimeout
	};

	/* globals performance */
	var clock = (typeof performance !== 'undefined' && performance.now)
	    ? function () { return performance.now() }
	    : function () { return +(new Date()) };

	function createStringStore () {
	  var stringIds = { '': 0 };
	  var stringValues = [''];
	  return {
	    id: function (str) {
	      var result = stringIds[str];
	      if (result) {
	        return result
	      }
	      result = stringIds[str] = stringValues.length;
	      stringValues.push(str);
	      return result
	    },

	    str: function (id) {
	      return stringValues[id]
	    }
	  }
	}

	// Context and canvas creation helper functions
	function createCanvas (element, onDone, pixelRatio) {
	  var canvas = document.createElement('canvas');
	  extend(canvas.style, {
	    border: 0,
	    margin: 0,
	    padding: 0,
	    top: 0,
	    left: 0
	  });
	  element.appendChild(canvas);

	  if (element === document.body) {
	    canvas.style.position = 'absolute';
	    extend(element.style, {
	      margin: 0,
	      padding: 0
	    });
	  }

	  function resize () {
	    var w = window.innerWidth;
	    var h = window.innerHeight;
	    if (element !== document.body) {
	      var bounds = element.getBoundingClientRect();
	      w = bounds.right - bounds.left;
	      h = bounds.bottom - bounds.top;
	    }
	    canvas.width = pixelRatio * w;
	    canvas.height = pixelRatio * h;
	    extend(canvas.style, {
	      width: w + 'px',
	      height: h + 'px'
	    });
	  }

	  var resizeObserver;
	  if (element !== document.body && typeof ResizeObserver === 'function') {
	    // ignore 'ResizeObserver' is not defined
	    // eslint-disable-next-line
	    resizeObserver = new ResizeObserver(function () {
	      // setTimeout to avoid flicker
	      setTimeout(resize);
	    });
	    resizeObserver.observe(element);
	  } else {
	    window.addEventListener('resize', resize, false);
	  }

	  function onDestroy () {
	    if (resizeObserver) {
	      resizeObserver.disconnect();
	    } else {
	      window.removeEventListener('resize', resize);
	    }
	    element.removeChild(canvas);
	  }

	  resize();

	  return {
	    canvas: canvas,
	    onDestroy: onDestroy
	  }
	}

	function createContext (canvas, contextAttributes) {
	  function get (name) {
	    try {
	      return canvas.getContext(name, contextAttributes)
	    } catch (e) {
	      return null
	    }
	  }
	  return (
	    get('webgl') ||
	    get('experimental-webgl') ||
	    get('webgl-experimental')
	  )
	}

	function isHTMLElement (obj) {
	  return (
	    typeof obj.nodeName === 'string' &&
	    typeof obj.appendChild === 'function' &&
	    typeof obj.getBoundingClientRect === 'function'
	  )
	}

	function isWebGLContext (obj) {
	  return (
	    typeof obj.drawArrays === 'function' ||
	    typeof obj.drawElements === 'function'
	  )
	}

	function parseExtensions (input) {
	  if (typeof input === 'string') {
	    return input.split()
	  }
	  check$1(Array.isArray(input), 'invalid extension array');
	  return input
	}

	function getElement (desc) {
	  if (typeof desc === 'string') {
	    check$1(typeof document !== 'undefined', 'not supported outside of DOM');
	    return document.querySelector(desc)
	  }
	  return desc
	}

	function parseArgs (args_) {
	  var args = args_ || {};
	  var element, container, canvas, gl;
	  var contextAttributes = {};
	  var extensions = [];
	  var optionalExtensions = [];
	  var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
	  var profile = false;
	  var onDone = function (err) {
	    if (err) {
	      check$1.raise(err);
	    }
	  };
	  var onDestroy = function () {};
	  if (typeof args === 'string') {
	    check$1(
	      typeof document !== 'undefined',
	      'selector queries only supported in DOM enviroments');
	    element = document.querySelector(args);
	    check$1(element, 'invalid query string for element');
	  } else if (typeof args === 'object') {
	    if (isHTMLElement(args)) {
	      element = args;
	    } else if (isWebGLContext(args)) {
	      gl = args;
	      canvas = gl.canvas;
	    } else {
	      check$1.constructor(args);
	      if ('gl' in args) {
	        gl = args.gl;
	      } else if ('canvas' in args) {
	        canvas = getElement(args.canvas);
	      } else if ('container' in args) {
	        container = getElement(args.container);
	      }
	      if ('attributes' in args) {
	        contextAttributes = args.attributes;
	        check$1.type(contextAttributes, 'object', 'invalid context attributes');
	      }
	      if ('extensions' in args) {
	        extensions = parseExtensions(args.extensions);
	      }
	      if ('optionalExtensions' in args) {
	        optionalExtensions = parseExtensions(args.optionalExtensions);
	      }
	      if ('onDone' in args) {
	        check$1.type(
	          args.onDone, 'function',
	          'invalid or missing onDone callback');
	        onDone = args.onDone;
	      }
	      if ('profile' in args) {
	        profile = !!args.profile;
	      }
	      if ('pixelRatio' in args) {
	        pixelRatio = +args.pixelRatio;
	        check$1(pixelRatio > 0, 'invalid pixel ratio');
	      }
	    }
	  } else {
	    check$1.raise('invalid arguments to regl');
	  }

	  if (element) {
	    if (element.nodeName.toLowerCase() === 'canvas') {
	      canvas = element;
	    } else {
	      container = element;
	    }
	  }

	  if (!gl) {
	    if (!canvas) {
	      check$1(
	        typeof document !== 'undefined',
	        'must manually specify webgl context outside of DOM environments');
	      var result = createCanvas(container || document.body, onDone, pixelRatio);
	      if (!result) {
	        return null
	      }
	      canvas = result.canvas;
	      onDestroy = result.onDestroy;
	    }
	    // workaround for chromium bug, premultiplied alpha value is platform dependent
	    if (contextAttributes.premultipliedAlpha === undefined) contextAttributes.premultipliedAlpha = true;
	    gl = createContext(canvas, contextAttributes);
	  }

	  if (!gl) {
	    onDestroy();
	    onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
	    return null
	  }

	  return {
	    gl: gl,
	    canvas: canvas,
	    container: container,
	    extensions: extensions,
	    optionalExtensions: optionalExtensions,
	    pixelRatio: pixelRatio,
	    profile: profile,
	    onDone: onDone,
	    onDestroy: onDestroy
	  }
	}

	function createExtensionCache (gl, config) {
	  var extensions = {};

	  function tryLoadExtension (name_) {
	    check$1.type(name_, 'string', 'extension name must be string');
	    var name = name_.toLowerCase();
	    var ext;
	    try {
	      ext = extensions[name] = gl.getExtension(name);
	    } catch (e) {}
	    return !!ext
	  }

	  for (var i = 0; i < config.extensions.length; ++i) {
	    var name = config.extensions[i];
	    if (!tryLoadExtension(name)) {
	      config.onDestroy();
	      config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
	      return null
	    }
	  }

	  config.optionalExtensions.forEach(tryLoadExtension);

	  return {
	    extensions: extensions,
	    restore: function () {
	      Object.keys(extensions).forEach(function (name) {
	        if (extensions[name] && !tryLoadExtension(name)) {
	          throw new Error('(regl): error restoring extension ' + name)
	        }
	      });
	    }
	  }
	}

	function loop (n, f) {
	  var result = Array(n);
	  for (var i = 0; i < n; ++i) {
	    result[i] = f(i);
	  }
	  return result
	}

	var GL_BYTE$1 = 5120;
	var GL_UNSIGNED_BYTE$2 = 5121;
	var GL_SHORT$1 = 5122;
	var GL_UNSIGNED_SHORT$1 = 5123;
	var GL_INT$1 = 5124;
	var GL_UNSIGNED_INT$1 = 5125;
	var GL_FLOAT$2 = 5126;

	function nextPow16 (v) {
	  for (var i = 16; i <= (1 << 28); i *= 16) {
	    if (v <= i) {
	      return i
	    }
	  }
	  return 0
	}

	function log2 (v) {
	  var r, shift;
	  r = (v > 0xFFFF) << 4;
	  v >>>= r;
	  shift = (v > 0xFF) << 3;
	  v >>>= shift; r |= shift;
	  shift = (v > 0xF) << 2;
	  v >>>= shift; r |= shift;
	  shift = (v > 0x3) << 1;
	  v >>>= shift; r |= shift;
	  return r | (v >> 1)
	}

	function createPool () {
	  var bufferPool = loop(8, function () {
	    return []
	  });

	  function alloc (n) {
	    var sz = nextPow16(n);
	    var bin = bufferPool[log2(sz) >> 2];
	    if (bin.length > 0) {
	      return bin.pop()
	    }
	    return new ArrayBuffer(sz)
	  }

	  function free (buf) {
	    bufferPool[log2(buf.byteLength) >> 2].push(buf);
	  }

	  function allocType (type, n) {
	    var result = null;
	    switch (type) {
	      case GL_BYTE$1:
	        result = new Int8Array(alloc(n), 0, n);
	        break
	      case GL_UNSIGNED_BYTE$2:
	        result = new Uint8Array(alloc(n), 0, n);
	        break
	      case GL_SHORT$1:
	        result = new Int16Array(alloc(2 * n), 0, n);
	        break
	      case GL_UNSIGNED_SHORT$1:
	        result = new Uint16Array(alloc(2 * n), 0, n);
	        break
	      case GL_INT$1:
	        result = new Int32Array(alloc(4 * n), 0, n);
	        break
	      case GL_UNSIGNED_INT$1:
	        result = new Uint32Array(alloc(4 * n), 0, n);
	        break
	      case GL_FLOAT$2:
	        result = new Float32Array(alloc(4 * n), 0, n);
	        break
	      default:
	        return null
	    }
	    if (result.length !== n) {
	      return result.subarray(0, n)
	    }
	    return result
	  }

	  function freeType (array) {
	    free(array.buffer);
	  }

	  return {
	    alloc: alloc,
	    free: free,
	    allocType: allocType,
	    freeType: freeType
	  }
	}

	var pool = createPool();

	// zero pool for initial zero data
	pool.zero = createPool();

	var GL_SUBPIXEL_BITS = 0x0D50;
	var GL_RED_BITS = 0x0D52;
	var GL_GREEN_BITS = 0x0D53;
	var GL_BLUE_BITS = 0x0D54;
	var GL_ALPHA_BITS = 0x0D55;
	var GL_DEPTH_BITS = 0x0D56;
	var GL_STENCIL_BITS = 0x0D57;

	var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
	var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

	var GL_MAX_TEXTURE_SIZE = 0x0D33;
	var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
	var GL_MAX_VERTEX_ATTRIBS = 0x8869;
	var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
	var GL_MAX_VARYING_VECTORS = 0x8DFC;
	var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
	var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
	var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
	var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
	var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
	var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

	var GL_VENDOR = 0x1F00;
	var GL_RENDERER = 0x1F01;
	var GL_VERSION = 0x1F02;
	var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

	var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

	var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
	var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

	var GL_TEXTURE_2D = 0x0DE1;
	var GL_TEXTURE_CUBE_MAP = 0x8513;
	var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
	var GL_TEXTURE0 = 0x84C0;
	var GL_RGBA = 0x1908;
	var GL_FLOAT$1 = 0x1406;
	var GL_UNSIGNED_BYTE$1 = 0x1401;
	var GL_FRAMEBUFFER = 0x8D40;
	var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
	var GL_COLOR_ATTACHMENT0 = 0x8CE0;
	var GL_COLOR_BUFFER_BIT$1 = 0x4000;

	var wrapLimits = function (gl, extensions) {
	  var maxAnisotropic = 1;
	  if (extensions.ext_texture_filter_anisotropic) {
	    maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
	  }

	  var maxDrawbuffers = 1;
	  var maxColorAttachments = 1;
	  if (extensions.webgl_draw_buffers) {
	    maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
	    maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
	  }

	  // detect if reading float textures is available (Safari doesn't support)
	  var readFloat = !!extensions.oes_texture_float;
	  if (readFloat) {
	    var readFloatTexture = gl.createTexture();
	    gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
	    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);

	    var fbo = gl.createFramebuffer();
	    gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
	    gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
	    gl.bindTexture(GL_TEXTURE_2D, null);

	    if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

	    else {
	      gl.viewport(0, 0, 1, 1);
	      gl.clearColor(1.0, 0.0, 0.0, 1.0);
	      gl.clear(GL_COLOR_BUFFER_BIT$1);
	      var pixels = pool.allocType(GL_FLOAT$1, 4);
	      gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);

	      if (gl.getError()) readFloat = false;
	      else {
	        gl.deleteFramebuffer(fbo);
	        gl.deleteTexture(readFloatTexture);

	        readFloat = pixels[0] === 1.0;
	      }

	      pool.freeType(pixels);
	    }
	  }

	  // detect non power of two cube textures support (IE doesn't support)
	  var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));

	  var npotTextureCube = true;

	  if (!isIE) {
	    var cubeTexture = gl.createTexture();
	    var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
	    gl.activeTexture(GL_TEXTURE0);
	    gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
	    gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
	    pool.freeType(data);
	    gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
	    gl.deleteTexture(cubeTexture);
	    npotTextureCube = !gl.getError();
	  }

	  return {
	    // drawing buffer bit depth
	    colorBits: [
	      gl.getParameter(GL_RED_BITS),
	      gl.getParameter(GL_GREEN_BITS),
	      gl.getParameter(GL_BLUE_BITS),
	      gl.getParameter(GL_ALPHA_BITS)
	    ],
	    depthBits: gl.getParameter(GL_DEPTH_BITS),
	    stencilBits: gl.getParameter(GL_STENCIL_BITS),
	    subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

	    // supported extensions
	    extensions: Object.keys(extensions).filter(function (ext) {
	      return !!extensions[ext]
	    }),

	    // max aniso samples
	    maxAnisotropic: maxAnisotropic,

	    // max draw buffers
	    maxDrawbuffers: maxDrawbuffers,
	    maxColorAttachments: maxColorAttachments,

	    // point and line size ranges
	    pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
	    lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
	    maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
	    maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
	    maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
	    maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
	    maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
	    maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
	    maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
	    maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
	    maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
	    maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
	    maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

	    // vendor info
	    glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
	    renderer: gl.getParameter(GL_RENDERER),
	    vendor: gl.getParameter(GL_VENDOR),
	    version: gl.getParameter(GL_VERSION),

	    // quirks
	    readFloat: readFloat,
	    npotTextureCube: npotTextureCube
	  }
	};

	function isNDArrayLike (obj) {
	  return (
	    !!obj &&
	    typeof obj === 'object' &&
	    Array.isArray(obj.shape) &&
	    Array.isArray(obj.stride) &&
	    typeof obj.offset === 'number' &&
	    obj.shape.length === obj.stride.length &&
	    (Array.isArray(obj.data) ||
	      isTypedArray(obj.data)))
	}

	var values = function (obj) {
	  return Object.keys(obj).map(function (key) { return obj[key] })
	};

	var flattenUtils = {
	  shape: arrayShape$1,
	  flatten: flattenArray
	};

	function flatten1D (array, nx, out) {
	  for (var i = 0; i < nx; ++i) {
	    out[i] = array[i];
	  }
	}

	function flatten2D (array, nx, ny, out) {
	  var ptr = 0;
	  for (var i = 0; i < nx; ++i) {
	    var row = array[i];
	    for (var j = 0; j < ny; ++j) {
	      out[ptr++] = row[j];
	    }
	  }
	}

	function flatten3D (array, nx, ny, nz, out, ptr_) {
	  var ptr = ptr_;
	  for (var i = 0; i < nx; ++i) {
	    var row = array[i];
	    for (var j = 0; j < ny; ++j) {
	      var col = row[j];
	      for (var k = 0; k < nz; ++k) {
	        out[ptr++] = col[k];
	      }
	    }
	  }
	}

	function flattenRec (array, shape, level, out, ptr) {
	  var stride = 1;
	  for (var i = level + 1; i < shape.length; ++i) {
	    stride *= shape[i];
	  }
	  var n = shape[level];
	  if (shape.length - level === 4) {
	    var nx = shape[level + 1];
	    var ny = shape[level + 2];
	    var nz = shape[level + 3];
	    for (i = 0; i < n; ++i) {
	      flatten3D(array[i], nx, ny, nz, out, ptr);
	      ptr += stride;
	    }
	  } else {
	    for (i = 0; i < n; ++i) {
	      flattenRec(array[i], shape, level + 1, out, ptr);
	      ptr += stride;
	    }
	  }
	}

	function flattenArray (array, shape, type, out_) {
	  var sz = 1;
	  if (shape.length) {
	    for (var i = 0; i < shape.length; ++i) {
	      sz *= shape[i];
	    }
	  } else {
	    sz = 0;
	  }
	  var out = out_ || pool.allocType(type, sz);
	  switch (shape.length) {
	    case 0:
	      break
	    case 1:
	      flatten1D(array, shape[0], out);
	      break
	    case 2:
	      flatten2D(array, shape[0], shape[1], out);
	      break
	    case 3:
	      flatten3D(array, shape[0], shape[1], shape[2], out, 0);
	      break
	    default:
	      flattenRec(array, shape, 0, out, 0);
	  }
	  return out
	}

	function arrayShape$1 (array_) {
	  var shape = [];
	  for (var array = array_; array.length; array = array[0]) {
	    shape.push(array.length);
	  }
	  return shape
	}

	var arrayTypes =  {
		"[object Int8Array]": 5120,
		"[object Int16Array]": 5122,
		"[object Int32Array]": 5124,
		"[object Uint8Array]": 5121,
		"[object Uint8ClampedArray]": 5121,
		"[object Uint16Array]": 5123,
		"[object Uint32Array]": 5125,
		"[object Float32Array]": 5126,
		"[object Float64Array]": 5121,
		"[object ArrayBuffer]": 5121
	};

	var int8 = 5120;
	var int16 = 5122;
	var int32 = 5124;
	var uint8 = 5121;
	var uint16 = 5123;
	var uint32 = 5125;
	var float = 5126;
	var float32 = 5126;
	var glTypes = {
		int8: int8,
		int16: int16,
		int32: int32,
		uint8: uint8,
		uint16: uint16,
		uint32: uint32,
		float: float,
		float32: float32
	};

	var dynamic$1 = 35048;
	var stream = 35040;
	var usageTypes = {
		dynamic: dynamic$1,
		stream: stream,
		"static": 35044
	};

	var arrayFlatten = flattenUtils.flatten;
	var arrayShape = flattenUtils.shape;

	var GL_STATIC_DRAW = 0x88E4;
	var GL_STREAM_DRAW = 0x88E0;

	var GL_UNSIGNED_BYTE$3 = 5121;
	var GL_FLOAT$3 = 5126;

	var DTYPES_SIZES = [];
	DTYPES_SIZES[5120] = 1; // int8
	DTYPES_SIZES[5122] = 2; // int16
	DTYPES_SIZES[5124] = 4; // int32
	DTYPES_SIZES[5121] = 1; // uint8
	DTYPES_SIZES[5123] = 2; // uint16
	DTYPES_SIZES[5125] = 4; // uint32
	DTYPES_SIZES[5126] = 4; // float32

	function typedArrayCode (data) {
	  return arrayTypes[Object.prototype.toString.call(data)] | 0
	}

	function copyArray (out, inp) {
	  for (var i = 0; i < inp.length; ++i) {
	    out[i] = inp[i];
	  }
	}

	function transpose (
	  result, data, shapeX, shapeY, strideX, strideY, offset) {
	  var ptr = 0;
	  for (var i = 0; i < shapeX; ++i) {
	    for (var j = 0; j < shapeY; ++j) {
	      result[ptr++] = data[strideX * i + strideY * j + offset];
	    }
	  }
	}

	function wrapBufferState (gl, stats, config, destroyBuffer) {
	  var bufferCount = 0;
	  var bufferSet = {};

	  function REGLBuffer (type) {
	    this.id = bufferCount++;
	    this.buffer = gl.createBuffer();
	    this.type = type;
	    this.usage = GL_STATIC_DRAW;
	    this.byteLength = 0;
	    this.dimension = 1;
	    this.dtype = GL_UNSIGNED_BYTE$3;

	    this.persistentData = null;

	    if (config.profile) {
	      this.stats = { size: 0 };
	    }
	  }

	  REGLBuffer.prototype.bind = function () {
	    gl.bindBuffer(this.type, this.buffer);
	  };

	  REGLBuffer.prototype.destroy = function () {
	    destroy(this);
	  };

	  var streamPool = [];

	  function createStream (type, data) {
	    var buffer = streamPool.pop();
	    if (!buffer) {
	      buffer = new REGLBuffer(type);
	    }
	    buffer.bind();
	    initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
	    return buffer
	  }

	  function destroyStream (stream$$1) {
	    streamPool.push(stream$$1);
	  }

	  function initBufferFromTypedArray (buffer, data, usage) {
	    buffer.byteLength = data.byteLength;
	    gl.bufferData(buffer.type, data, usage);
	  }

	  function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
	    var shape;
	    buffer.usage = usage;
	    if (Array.isArray(data)) {
	      buffer.dtype = dtype || GL_FLOAT$3;
	      if (data.length > 0) {
	        var flatData;
	        if (Array.isArray(data[0])) {
	          shape = arrayShape(data);
	          var dim = 1;
	          for (var i = 1; i < shape.length; ++i) {
	            dim *= shape[i];
	          }
	          buffer.dimension = dim;
	          flatData = arrayFlatten(data, shape, buffer.dtype);
	          initBufferFromTypedArray(buffer, flatData, usage);
	          if (persist) {
	            buffer.persistentData = flatData;
	          } else {
	            pool.freeType(flatData);
	          }
	        } else if (typeof data[0] === 'number') {
	          buffer.dimension = dimension;
	          var typedData = pool.allocType(buffer.dtype, data.length);
	          copyArray(typedData, data);
	          initBufferFromTypedArray(buffer, typedData, usage);
	          if (persist) {
	            buffer.persistentData = typedData;
	          } else {
	            pool.freeType(typedData);
	          }
	        } else if (isTypedArray(data[0])) {
	          buffer.dimension = data[0].length;
	          buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
	          flatData = arrayFlatten(
	            data,
	            [data.length, data[0].length],
	            buffer.dtype);
	          initBufferFromTypedArray(buffer, flatData, usage);
	          if (persist) {
	            buffer.persistentData = flatData;
	          } else {
	            pool.freeType(flatData);
	          }
	        } else {
	          check$1.raise('invalid buffer data');
	        }
	      }
	    } else if (isTypedArray(data)) {
	      buffer.dtype = dtype || typedArrayCode(data);
	      buffer.dimension = dimension;
	      initBufferFromTypedArray(buffer, data, usage);
	      if (persist) {
	        buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
	      }
	    } else if (isNDArrayLike(data)) {
	      shape = data.shape;
	      var stride = data.stride;
	      var offset = data.offset;

	      var shapeX = 0;
	      var shapeY = 0;
	      var strideX = 0;
	      var strideY = 0;
	      if (shape.length === 1) {
	        shapeX = shape[0];
	        shapeY = 1;
	        strideX = stride[0];
	        strideY = 0;
	      } else if (shape.length === 2) {
	        shapeX = shape[0];
	        shapeY = shape[1];
	        strideX = stride[0];
	        strideY = stride[1];
	      } else {
	        check$1.raise('invalid shape');
	      }

	      buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
	      buffer.dimension = shapeY;

	      var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
	      transpose(transposeData,
	        data.data,
	        shapeX, shapeY,
	        strideX, strideY,
	        offset);
	      initBufferFromTypedArray(buffer, transposeData, usage);
	      if (persist) {
	        buffer.persistentData = transposeData;
	      } else {
	        pool.freeType(transposeData);
	      }
	    } else if (data instanceof ArrayBuffer) {
	      buffer.dtype = GL_UNSIGNED_BYTE$3;
	      buffer.dimension = dimension;
	      initBufferFromTypedArray(buffer, data, usage);
	      if (persist) {
	        buffer.persistentData = new Uint8Array(new Uint8Array(data));
	      }
	    } else {
	      check$1.raise('invalid buffer data');
	    }
	  }

	  function destroy (buffer) {
	    stats.bufferCount--;

	    // remove attribute link
	    destroyBuffer(buffer);

	    var handle = buffer.buffer;
	    check$1(handle, 'buffer must not be deleted already');
	    gl.deleteBuffer(handle);
	    buffer.buffer = null;
	    delete bufferSet[buffer.id];
	  }

	  function createBuffer (options, type, deferInit, persistent) {
	    stats.bufferCount++;

	    var buffer = new REGLBuffer(type);
	    bufferSet[buffer.id] = buffer;

	    function reglBuffer (options) {
	      var usage = GL_STATIC_DRAW;
	      var data = null;
	      var byteLength = 0;
	      var dtype = 0;
	      var dimension = 1;
	      if (Array.isArray(options) ||
	          isTypedArray(options) ||
	          isNDArrayLike(options) ||
	          options instanceof ArrayBuffer) {
	        data = options;
	      } else if (typeof options === 'number') {
	        byteLength = options | 0;
	      } else if (options) {
	        check$1.type(
	          options, 'object',
	          'buffer arguments must be an object, a number or an array');

	        if ('data' in options) {
	          check$1(
	            data === null ||
	            Array.isArray(data) ||
	            isTypedArray(data) ||
	            isNDArrayLike(data),
	            'invalid data for buffer');
	          data = options.data;
	        }

	        if ('usage' in options) {
	          check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
	          usage = usageTypes[options.usage];
	        }

	        if ('type' in options) {
	          check$1.parameter(options.type, glTypes, 'invalid buffer type');
	          dtype = glTypes[options.type];
	        }

	        if ('dimension' in options) {
	          check$1.type(options.dimension, 'number', 'invalid dimension');
	          dimension = options.dimension | 0;
	        }

	        if ('length' in options) {
	          check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
	          byteLength = options.length | 0;
	        }
	      }

	      buffer.bind();
	      if (!data) {
	        // #475
	        if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
	        buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
	        buffer.usage = usage;
	        buffer.dimension = dimension;
	        buffer.byteLength = byteLength;
	      } else {
	        initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
	      }

	      if (config.profile) {
	        buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
	      }

	      return reglBuffer
	    }

	    function setSubData (data, offset) {
	      check$1(offset + data.byteLength <= buffer.byteLength,
	        'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

	      gl.bufferSubData(buffer.type, offset, data);
	    }

	    function subdata (data, offset_) {
	      var offset = (offset_ || 0) | 0;
	      var shape;
	      buffer.bind();
	      if (isTypedArray(data) || data instanceof ArrayBuffer) {
	        setSubData(data, offset);
	      } else if (Array.isArray(data)) {
	        if (data.length > 0) {
	          if (typeof data[0] === 'number') {
	            var converted = pool.allocType(buffer.dtype, data.length);
	            copyArray(converted, data);
	            setSubData(converted, offset);
	            pool.freeType(converted);
	          } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
	            shape = arrayShape(data);
	            var flatData = arrayFlatten(data, shape, buffer.dtype);
	            setSubData(flatData, offset);
	            pool.freeType(flatData);
	          } else {
	            check$1.raise('invalid buffer data');
	          }
	        }
	      } else if (isNDArrayLike(data)) {
	        shape = data.shape;
	        var stride = data.stride;

	        var shapeX = 0;
	        var shapeY = 0;
	        var strideX = 0;
	        var strideY = 0;
	        if (shape.length === 1) {
	          shapeX = shape[0];
	          shapeY = 1;
	          strideX = stride[0];
	          strideY = 0;
	        } else if (shape.length === 2) {
	          shapeX = shape[0];
	          shapeY = shape[1];
	          strideX = stride[0];
	          strideY = stride[1];
	        } else {
	          check$1.raise('invalid shape');
	        }
	        var dtype = Array.isArray(data.data)
	          ? buffer.dtype
	          : typedArrayCode(data.data);

	        var transposeData = pool.allocType(dtype, shapeX * shapeY);
	        transpose(transposeData,
	          data.data,
	          shapeX, shapeY,
	          strideX, strideY,
	          data.offset);
	        setSubData(transposeData, offset);
	        pool.freeType(transposeData);
	      } else {
	        check$1.raise('invalid data for buffer subdata');
	      }
	      return reglBuffer
	    }

	    if (!deferInit) {
	      reglBuffer(options);
	    }

	    reglBuffer._reglType = 'buffer';
	    reglBuffer._buffer = buffer;
	    reglBuffer.subdata = subdata;
	    if (config.profile) {
	      reglBuffer.stats = buffer.stats;
	    }
	    reglBuffer.destroy = function () { destroy(buffer); };

	    return reglBuffer
	  }

	  function restoreBuffers () {
	    values(bufferSet).forEach(function (buffer) {
	      buffer.buffer = gl.createBuffer();
	      gl.bindBuffer(buffer.type, buffer.buffer);
	      gl.bufferData(
	        buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
	    });
	  }

	  if (config.profile) {
	    stats.getTotalBufferSize = function () {
	      var total = 0;
	      // TODO: Right now, the streams are not part of the total count.
	      Object.keys(bufferSet).forEach(function (key) {
	        total += bufferSet[key].stats.size;
	      });
	      return total
	    };
	  }

	  return {
	    create: createBuffer,

	    createStream: createStream,
	    destroyStream: destroyStream,

	    clear: function () {
	      values(bufferSet).forEach(destroy);
	      streamPool.forEach(destroy);
	    },

	    getBuffer: function (wrapper) {
	      if (wrapper && wrapper._buffer instanceof REGLBuffer) {
	        return wrapper._buffer
	      }
	      return null
	    },

	    restore: restoreBuffers,

	    _initBuffer: initBufferFromData
	  }
	}

	var points = 0;
	var point = 0;
	var lines = 1;
	var line = 1;
	var triangles = 4;
	var triangle = 4;
	var primTypes = {
		points: points,
		point: point,
		lines: lines,
		line: line,
		triangles: triangles,
		triangle: triangle,
		"line loop": 2,
		"line strip": 3,
		"triangle strip": 5,
		"triangle fan": 6
	};

	var GL_POINTS = 0;
	var GL_LINES = 1;
	var GL_TRIANGLES = 4;

	var GL_BYTE$2 = 5120;
	var GL_UNSIGNED_BYTE$4 = 5121;
	var GL_SHORT$2 = 5122;
	var GL_UNSIGNED_SHORT$2 = 5123;
	var GL_INT$2 = 5124;
	var GL_UNSIGNED_INT$2 = 5125;

	var GL_ELEMENT_ARRAY_BUFFER = 34963;

	var GL_STREAM_DRAW$1 = 0x88E0;
	var GL_STATIC_DRAW$1 = 0x88E4;

	function wrapElementsState (gl, extensions, bufferState, stats) {
	  var elementSet = {};
	  var elementCount = 0;

	  var elementTypes = {
	    'uint8': GL_UNSIGNED_BYTE$4,
	    'uint16': GL_UNSIGNED_SHORT$2
	  };

	  if (extensions.oes_element_index_uint) {
	    elementTypes.uint32 = GL_UNSIGNED_INT$2;
	  }

	  function REGLElementBuffer (buffer) {
	    this.id = elementCount++;
	    elementSet[this.id] = this;
	    this.buffer = buffer;
	    this.primType = GL_TRIANGLES;
	    this.vertCount = 0;
	    this.type = 0;
	  }

	  REGLElementBuffer.prototype.bind = function () {
	    this.buffer.bind();
	  };

	  var bufferPool = [];

	  function createElementStream (data) {
	    var result = bufferPool.pop();
	    if (!result) {
	      result = new REGLElementBuffer(bufferState.create(
	        null,
	        GL_ELEMENT_ARRAY_BUFFER,
	        true,
	        false)._buffer);
	    }
	    initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
	    return result
	  }

	  function destroyElementStream (elements) {
	    bufferPool.push(elements);
	  }

	  function initElements (
	    elements,
	    data,
	    usage,
	    prim,
	    count,
	    byteLength,
	    type) {
	    elements.buffer.bind();
	    var dtype;
	    if (data) {
	      var predictedType = type;
	      if (!type && (
	        !isTypedArray(data) ||
	         (isNDArrayLike(data) && !isTypedArray(data.data)))) {
	        predictedType = extensions.oes_element_index_uint
	          ? GL_UNSIGNED_INT$2
	          : GL_UNSIGNED_SHORT$2;
	      }
	      bufferState._initBuffer(
	        elements.buffer,
	        data,
	        usage,
	        predictedType,
	        3);
	    } else {
	      gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
	      elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
	      elements.buffer.usage = usage;
	      elements.buffer.dimension = 3;
	      elements.buffer.byteLength = byteLength;
	    }

	    dtype = type;
	    if (!type) {
	      switch (elements.buffer.dtype) {
	        case GL_UNSIGNED_BYTE$4:
	        case GL_BYTE$2:
	          dtype = GL_UNSIGNED_BYTE$4;
	          break

	        case GL_UNSIGNED_SHORT$2:
	        case GL_SHORT$2:
	          dtype = GL_UNSIGNED_SHORT$2;
	          break

	        case GL_UNSIGNED_INT$2:
	        case GL_INT$2:
	          dtype = GL_UNSIGNED_INT$2;
	          break

	        default:
	          check$1.raise('unsupported type for element array');
	      }
	      elements.buffer.dtype = dtype;
	    }
	    elements.type = dtype;

	    // Check oes_element_index_uint extension
	    check$1(
	      dtype !== GL_UNSIGNED_INT$2 ||
	      !!extensions.oes_element_index_uint,
	      '32 bit element buffers not supported, enable oes_element_index_uint first');

	    // try to guess default primitive type and arguments
	    var vertCount = count;
	    if (vertCount < 0) {
	      vertCount = elements.buffer.byteLength;
	      if (dtype === GL_UNSIGNED_SHORT$2) {
	        vertCount >>= 1;
	      } else if (dtype === GL_UNSIGNED_INT$2) {
	        vertCount >>= 2;
	      }
	    }
	    elements.vertCount = vertCount;

	    // try to guess primitive type from cell dimension
	    var primType = prim;
	    if (prim < 0) {
	      primType = GL_TRIANGLES;
	      var dimension = elements.buffer.dimension;
	      if (dimension === 1) primType = GL_POINTS;
	      if (dimension === 2) primType = GL_LINES;
	      if (dimension === 3) primType = GL_TRIANGLES;
	    }
	    elements.primType = primType;
	  }

	  function destroyElements (elements) {
	    stats.elementsCount--;

	    check$1(elements.buffer !== null, 'must not double destroy elements');
	    delete elementSet[elements.id];
	    elements.buffer.destroy();
	    elements.buffer = null;
	  }

	  function createElements (options, persistent) {
	    var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
	    var elements = new REGLElementBuffer(buffer._buffer);
	    stats.elementsCount++;

	    function reglElements (options) {
	      if (!options) {
	        buffer();
	        elements.primType = GL_TRIANGLES;
	        elements.vertCount = 0;
	        elements.type = GL_UNSIGNED_BYTE$4;
	      } else if (typeof options === 'number') {
	        buffer(options);
	        elements.primType = GL_TRIANGLES;
	        elements.vertCount = options | 0;
	        elements.type = GL_UNSIGNED_BYTE$4;
	      } else {
	        var data = null;
	        var usage = GL_STATIC_DRAW$1;
	        var primType = -1;
	        var vertCount = -1;
	        var byteLength = 0;
	        var dtype = 0;
	        if (Array.isArray(options) ||
	            isTypedArray(options) ||
	            isNDArrayLike(options)) {
	          data = options;
	        } else {
	          check$1.type(options, 'object', 'invalid arguments for elements');
	          if ('data' in options) {
	            data = options.data;
	            check$1(
	              Array.isArray(data) ||
	                isTypedArray(data) ||
	                isNDArrayLike(data),
	              'invalid data for element buffer');
	          }
	          if ('usage' in options) {
	            check$1.parameter(
	              options.usage,
	              usageTypes,
	              'invalid element buffer usage');
	            usage = usageTypes[options.usage];
	          }
	          if ('primitive' in options) {
	            check$1.parameter(
	              options.primitive,
	              primTypes,
	              'invalid element buffer primitive');
	            primType = primTypes[options.primitive];
	          }
	          if ('count' in options) {
	            check$1(
	              typeof options.count === 'number' && options.count >= 0,
	              'invalid vertex count for elements');
	            vertCount = options.count | 0;
	          }
	          if ('type' in options) {
	            check$1.parameter(
	              options.type,
	              elementTypes,
	              'invalid buffer type');
	            dtype = elementTypes[options.type];
	          }
	          if ('length' in options) {
	            byteLength = options.length | 0;
	          } else {
	            byteLength = vertCount;
	            if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
	              byteLength *= 2;
	            } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
	              byteLength *= 4;
	            }
	          }
	        }
	        initElements(
	          elements,
	          data,
	          usage,
	          primType,
	          vertCount,
	          byteLength,
	          dtype);
	      }

	      return reglElements
	    }

	    reglElements(options);

	    reglElements._reglType = 'elements';
	    reglElements._elements = elements;
	    reglElements.subdata = function (data, offset) {
	      buffer.subdata(data, offset);
	      return reglElements
	    };
	    reglElements.destroy = function () {
	      destroyElements(elements);
	    };

	    return reglElements
	  }

	  return {
	    create: createElements,
	    createStream: createElementStream,
	    destroyStream: destroyElementStream,
	    getElements: function (elements) {
	      if (typeof elements === 'function' &&
	          elements._elements instanceof REGLElementBuffer) {
	        return elements._elements
	      }
	      return null
	    },
	    clear: function () {
	      values(elementSet).forEach(destroyElements);
	    }
	  }
	}

	var FLOAT = new Float32Array(1);
	var INT = new Uint32Array(FLOAT.buffer);

	var GL_UNSIGNED_SHORT$4 = 5123;

	function convertToHalfFloat (array) {
	  var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

	  for (var i = 0; i < array.length; ++i) {
	    if (isNaN(array[i])) {
	      ushorts[i] = 0xffff;
	    } else if (array[i] === Infinity) {
	      ushorts[i] = 0x7c00;
	    } else if (array[i] === -Infinity) {
	      ushorts[i] = 0xfc00;
	    } else {
	      FLOAT[0] = array[i];
	      var x = INT[0];

	      var sgn = (x >>> 31) << 15;
	      var exp = ((x << 1) >>> 24) - 127;
	      var frac = (x >> 13) & ((1 << 10) - 1);

	      if (exp < -24) {
	        // round non-representable denormals to 0
	        ushorts[i] = sgn;
	      } else if (exp < -14) {
	        // handle denormals
	        var s = -14 - exp;
	        ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
	      } else if (exp > 15) {
	        // round overflow to +/- Infinity
	        ushorts[i] = sgn + 0x7c00;
	      } else {
	        // otherwise convert directly
	        ushorts[i] = sgn + ((exp + 15) << 10) + frac;
	      }
	    }
	  }

	  return ushorts
	}

	function isArrayLike (s) {
	  return Array.isArray(s) || isTypedArray(s)
	}

	var isPow2$1 = function (v) {
	  return !(v & (v - 1)) && (!!v)
	};

	var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

	var GL_TEXTURE_2D$1 = 0x0DE1;
	var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
	var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

	var GL_RGBA$1 = 0x1908;
	var GL_ALPHA = 0x1906;
	var GL_RGB = 0x1907;
	var GL_LUMINANCE = 0x1909;
	var GL_LUMINANCE_ALPHA = 0x190A;

	var GL_RGBA4 = 0x8056;
	var GL_RGB5_A1 = 0x8057;
	var GL_RGB565 = 0x8D62;

	var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
	var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
	var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
	var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

	var GL_DEPTH_COMPONENT = 0x1902;
	var GL_DEPTH_STENCIL = 0x84F9;

	var GL_SRGB_EXT = 0x8C40;
	var GL_SRGB_ALPHA_EXT = 0x8C42;

	var GL_HALF_FLOAT_OES$1 = 0x8D61;

	var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
	var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
	var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
	var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

	var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
	var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
	var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

	var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
	var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
	var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
	var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

	var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

	var GL_UNSIGNED_BYTE$5 = 0x1401;
	var GL_UNSIGNED_SHORT$3 = 0x1403;
	var GL_UNSIGNED_INT$3 = 0x1405;
	var GL_FLOAT$4 = 0x1406;

	var GL_TEXTURE_WRAP_S = 0x2802;
	var GL_TEXTURE_WRAP_T = 0x2803;

	var GL_REPEAT = 0x2901;
	var GL_CLAMP_TO_EDGE$1 = 0x812F;
	var GL_MIRRORED_REPEAT = 0x8370;

	var GL_TEXTURE_MAG_FILTER = 0x2800;
	var GL_TEXTURE_MIN_FILTER = 0x2801;

	var GL_NEAREST$1 = 0x2600;
	var GL_LINEAR = 0x2601;
	var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
	var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
	var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
	var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

	var GL_GENERATE_MIPMAP_HINT = 0x8192;
	var GL_DONT_CARE = 0x1100;
	var GL_FASTEST = 0x1101;
	var GL_NICEST = 0x1102;

	var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

	var GL_UNPACK_ALIGNMENT = 0x0CF5;
	var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
	var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
	var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

	var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

	var GL_TEXTURE0$1 = 0x84C0;

	var MIPMAP_FILTERS = [
	  GL_NEAREST_MIPMAP_NEAREST$1,
	  GL_NEAREST_MIPMAP_LINEAR$1,
	  GL_LINEAR_MIPMAP_NEAREST$1,
	  GL_LINEAR_MIPMAP_LINEAR$1
	];

	var CHANNELS_FORMAT = [
	  0,
	  GL_LUMINANCE,
	  GL_LUMINANCE_ALPHA,
	  GL_RGB,
	  GL_RGBA$1
	];

	var FORMAT_CHANNELS = {};
	FORMAT_CHANNELS[GL_LUMINANCE] =
	FORMAT_CHANNELS[GL_ALPHA] =
	FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
	FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
	FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
	FORMAT_CHANNELS[GL_RGB] =
	FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
	FORMAT_CHANNELS[GL_RGBA$1] =
	FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

	function objectName (str) {
	  return '[object ' + str + ']'
	}

	var CANVAS_CLASS = objectName('HTMLCanvasElement');
	var OFFSCREENCANVAS_CLASS = objectName('OffscreenCanvas');
	var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
	var BITMAP_CLASS = objectName('ImageBitmap');
	var IMAGE_CLASS = objectName('HTMLImageElement');
	var VIDEO_CLASS = objectName('HTMLVideoElement');

	var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
	  CANVAS_CLASS,
	  OFFSCREENCANVAS_CLASS,
	  CONTEXT2D_CLASS,
	  BITMAP_CLASS,
	  IMAGE_CLASS,
	  VIDEO_CLASS
	]);

	// for every texture type, store
	// the size in bytes.
	var TYPE_SIZES = [];
	TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
	TYPE_SIZES[GL_FLOAT$4] = 4;
	TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

	TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
	TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

	var FORMAT_SIZES_SPECIAL = [];
	FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
	FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
	FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
	FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

	FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

	function isNumericArray (arr) {
	  return (
	    Array.isArray(arr) &&
	    (arr.length === 0 ||
	    typeof arr[0] === 'number'))
	}

	function isRectArray (arr) {
	  if (!Array.isArray(arr)) {
	    return false
	  }
	  var width = arr.length;
	  if (width === 0 || !isArrayLike(arr[0])) {
	    return false
	  }
	  return true
	}

	function classString (x) {
	  return Object.prototype.toString.call(x)
	}

	function isCanvasElement (object) {
	  return classString(object) === CANVAS_CLASS
	}

	function isOffscreenCanvas (object) {
	  return classString(object) === OFFSCREENCANVAS_CLASS
	}

	function isContext2D (object) {
	  return classString(object) === CONTEXT2D_CLASS
	}

	function isBitmap (object) {
	  return classString(object) === BITMAP_CLASS
	}

	function isImageElement (object) {
	  return classString(object) === IMAGE_CLASS
	}

	function isVideoElement (object) {
	  return classString(object) === VIDEO_CLASS
	}

	function isPixelData (object) {
	  if (!object) {
	    return false
	  }
	  var className = classString(object);
	  if (PIXEL_CLASSES.indexOf(className) >= 0) {
	    return true
	  }
	  return (
	    isNumericArray(object) ||
	    isRectArray(object) ||
	    isNDArrayLike(object))
	}

	function typedArrayCode$1 (data) {
	  return arrayTypes[Object.prototype.toString.call(data)] | 0
	}

	function convertData (result, data) {
	  var n = data.length;
	  switch (result.type) {
	    case GL_UNSIGNED_BYTE$5:
	    case GL_UNSIGNED_SHORT$3:
	    case GL_UNSIGNED_INT$3:
	    case GL_FLOAT$4:
	      var converted = pool.allocType(result.type, n);
	      converted.set(data);
	      result.data = converted;
	      break

	    case GL_HALF_FLOAT_OES$1:
	      result.data = convertToHalfFloat(data);
	      break

	    default:
	      check$1.raise('unsupported texture type, must specify a typed array');
	  }
	}

	function preConvert (image, n) {
	  return pool.allocType(
	    image.type === GL_HALF_FLOAT_OES$1
	      ? GL_FLOAT$4
	      : image.type, n)
	}

	function postConvert (image, data) {
	  if (image.type === GL_HALF_FLOAT_OES$1) {
	    image.data = convertToHalfFloat(data);
	    pool.freeType(data);
	  } else {
	    image.data = data;
	  }
	}

	function transposeData (image, array, strideX, strideY, strideC, offset) {
	  var w = image.width;
	  var h = image.height;
	  var c = image.channels;
	  var n = w * h * c;
	  var data = preConvert(image, n);

	  var p = 0;
	  for (var i = 0; i < h; ++i) {
	    for (var j = 0; j < w; ++j) {
	      for (var k = 0; k < c; ++k) {
	        data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
	      }
	    }
	  }

	  postConvert(image, data);
	}

	function getTextureSize (format, type, width, height, isMipmap, isCube) {
	  var s;
	  if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
	    // we have a special array for dealing with weird color formats such as RGB5A1
	    s = FORMAT_SIZES_SPECIAL[format];
	  } else {
	    s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
	  }

	  if (isCube) {
	    s *= 6;
	  }

	  if (isMipmap) {
	    // compute the total size of all the mipmaps.
	    var total = 0;

	    var w = width;
	    while (w >= 1) {
	      // we can only use mipmaps on a square image,
	      // so we can simply use the width and ignore the height:
	      total += s * w * w;
	      w /= 2;
	    }
	    return total
	  } else {
	    return s * width * height
	  }
	}

	function createTextureSet (
	  gl, extensions, limits, reglPoll, contextState, stats, config) {
	  // -------------------------------------------------------
	  // Initialize constants and parameter tables here
	  // -------------------------------------------------------
	  var mipmapHint = {
	    "don't care": GL_DONT_CARE,
	    'dont care': GL_DONT_CARE,
	    'nice': GL_NICEST,
	    'fast': GL_FASTEST
	  };

	  var wrapModes = {
	    'repeat': GL_REPEAT,
	    'clamp': GL_CLAMP_TO_EDGE$1,
	    'mirror': GL_MIRRORED_REPEAT
	  };

	  var magFilters = {
	    'nearest': GL_NEAREST$1,
	    'linear': GL_LINEAR
	  };

	  var minFilters = extend({
	    'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
	    'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
	    'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
	    'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
	    'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
	  }, magFilters);

	  var colorSpace = {
	    'none': 0,
	    'browser': GL_BROWSER_DEFAULT_WEBGL
	  };

	  var textureTypes = {
	    'uint8': GL_UNSIGNED_BYTE$5,
	    'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
	    'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
	    'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
	  };

	  var textureFormats = {
	    'alpha': GL_ALPHA,
	    'luminance': GL_LUMINANCE,
	    'luminance alpha': GL_LUMINANCE_ALPHA,
	    'rgb': GL_RGB,
	    'rgba': GL_RGBA$1,
	    'rgba4': GL_RGBA4,
	    'rgb5 a1': GL_RGB5_A1,
	    'rgb565': GL_RGB565
	  };

	  var compressedTextureFormats = {};

	  if (extensions.ext_srgb) {
	    textureFormats.srgb = GL_SRGB_EXT;
	    textureFormats.srgba = GL_SRGB_ALPHA_EXT;
	  }

	  if (extensions.oes_texture_float) {
	    textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
	  }

	  if (extensions.oes_texture_half_float) {
	    textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
	  }

	  if (extensions.webgl_depth_texture) {
	    extend(textureFormats, {
	      'depth': GL_DEPTH_COMPONENT,
	      'depth stencil': GL_DEPTH_STENCIL
	    });

	    extend(textureTypes, {
	      'uint16': GL_UNSIGNED_SHORT$3,
	      'uint32': GL_UNSIGNED_INT$3,
	      'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
	    });
	  }

	  if (extensions.webgl_compressed_texture_s3tc) {
	    extend(compressedTextureFormats, {
	      'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
	      'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
	      'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
	      'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
	    });
	  }

	  if (extensions.webgl_compressed_texture_atc) {
	    extend(compressedTextureFormats, {
	      'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
	      'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
	      'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
	    });
	  }

	  if (extensions.webgl_compressed_texture_pvrtc) {
	    extend(compressedTextureFormats, {
	      'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
	      'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
	      'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
	      'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
	    });
	  }

	  if (extensions.webgl_compressed_texture_etc1) {
	    compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
	  }

	  // Copy over all texture formats
	  var supportedCompressedFormats = Array.prototype.slice.call(
	    gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
	  Object.keys(compressedTextureFormats).forEach(function (name) {
	    var format = compressedTextureFormats[name];
	    if (supportedCompressedFormats.indexOf(format) >= 0) {
	      textureFormats[name] = format;
	    }
	  });

	  var supportedFormats = Object.keys(textureFormats);
	  limits.textureFormats = supportedFormats;

	  // associate with every format string its
	  // corresponding GL-value.
	  var textureFormatsInvert = [];
	  Object.keys(textureFormats).forEach(function (key) {
	    var val = textureFormats[key];
	    textureFormatsInvert[val] = key;
	  });

	  // associate with every type string its
	  // corresponding GL-value.
	  var textureTypesInvert = [];
	  Object.keys(textureTypes).forEach(function (key) {
	    var val = textureTypes[key];
	    textureTypesInvert[val] = key;
	  });

	  var magFiltersInvert = [];
	  Object.keys(magFilters).forEach(function (key) {
	    var val = magFilters[key];
	    magFiltersInvert[val] = key;
	  });

	  var minFiltersInvert = [];
	  Object.keys(minFilters).forEach(function (key) {
	    var val = minFilters[key];
	    minFiltersInvert[val] = key;
	  });

	  var wrapModesInvert = [];
	  Object.keys(wrapModes).forEach(function (key) {
	    var val = wrapModes[key];
	    wrapModesInvert[val] = key;
	  });

	  // colorFormats[] gives the format (channels) associated to an
	  // internalformat
	  var colorFormats = supportedFormats.reduce(function (color, key) {
	    var glenum = textureFormats[key];
	    if (glenum === GL_LUMINANCE ||
	        glenum === GL_ALPHA ||
	        glenum === GL_LUMINANCE ||
	        glenum === GL_LUMINANCE_ALPHA ||
	        glenum === GL_DEPTH_COMPONENT ||
	        glenum === GL_DEPTH_STENCIL ||
	        (extensions.ext_srgb &&
	                (glenum === GL_SRGB_EXT ||
	                 glenum === GL_SRGB_ALPHA_EXT))) {
	      color[glenum] = glenum;
	    } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
	      color[glenum] = GL_RGBA$1;
	    } else {
	      color[glenum] = GL_RGB;
	    }
	    return color
	  }, {});

	  function TexFlags () {
	    // format info
	    this.internalformat = GL_RGBA$1;
	    this.format = GL_RGBA$1;
	    this.type = GL_UNSIGNED_BYTE$5;
	    this.compressed = false;

	    // pixel storage
	    this.premultiplyAlpha = false;
	    this.flipY = false;
	    this.unpackAlignment = 1;
	    this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

	    // shape info
	    this.width = 0;
	    this.height = 0;
	    this.channels = 0;
	  }

	  function copyFlags (result, other) {
	    result.internalformat = other.internalformat;
	    result.format = other.format;
	    result.type = other.type;
	    result.compressed = other.compressed;

	    result.premultiplyAlpha = other.premultiplyAlpha;
	    result.flipY = other.flipY;
	    result.unpackAlignment = other.unpackAlignment;
	    result.colorSpace = other.colorSpace;

	    result.width = other.width;
	    result.height = other.height;
	    result.channels = other.channels;
	  }

	  function parseFlags (flags, options) {
	    if (typeof options !== 'object' || !options) {
	      return
	    }

	    if ('premultiplyAlpha' in options) {
	      check$1.type(options.premultiplyAlpha, 'boolean',
	        'invalid premultiplyAlpha');
	      flags.premultiplyAlpha = options.premultiplyAlpha;
	    }

	    if ('flipY' in options) {
	      check$1.type(options.flipY, 'boolean',
	        'invalid texture flip');
	      flags.flipY = options.flipY;
	    }

	    if ('alignment' in options) {
	      check$1.oneOf(options.alignment, [1, 2, 4, 8],
	        'invalid texture unpack alignment');
	      flags.unpackAlignment = options.alignment;
	    }

	    if ('colorSpace' in options) {
	      check$1.parameter(options.colorSpace, colorSpace,
	        'invalid colorSpace');
	      flags.colorSpace = colorSpace[options.colorSpace];
	    }

	    if ('type' in options) {
	      var type = options.type;
	      check$1(extensions.oes_texture_float ||
	        !(type === 'float' || type === 'float32'),
	      'you must enable the OES_texture_float extension in order to use floating point textures.');
	      check$1(extensions.oes_texture_half_float ||
	        !(type === 'half float' || type === 'float16'),
	      'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
	      check$1(extensions.webgl_depth_texture ||
	        !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
	      'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
	      check$1.parameter(type, textureTypes,
	        'invalid texture type');
	      flags.type = textureTypes[type];
	    }

	    var w = flags.width;
	    var h = flags.height;
	    var c = flags.channels;
	    var hasChannels = false;
	    if ('shape' in options) {
	      check$1(Array.isArray(options.shape) && options.shape.length >= 2,
	        'shape must be an array');
	      w = options.shape[0];
	      h = options.shape[1];
	      if (options.shape.length === 3) {
	        c = options.shape[2];
	        check$1(c > 0 && c <= 4, 'invalid number of channels');
	        hasChannels = true;
	      }
	      check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
	      check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
	    } else {
	      if ('radius' in options) {
	        w = h = options.radius;
	        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
	      }
	      if ('width' in options) {
	        w = options.width;
	        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
	      }
	      if ('height' in options) {
	        h = options.height;
	        check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
	      }
	      if ('channels' in options) {
	        c = options.channels;
	        check$1(c > 0 && c <= 4, 'invalid number of channels');
	        hasChannels = true;
	      }
	    }
	    flags.width = w | 0;
	    flags.height = h | 0;
	    flags.channels = c | 0;

	    var hasFormat = false;
	    if ('format' in options) {
	      var formatStr = options.format;
	      check$1(extensions.webgl_depth_texture ||
	        !(formatStr === 'depth' || formatStr === 'depth stencil'),
	      'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
	      check$1.parameter(formatStr, textureFormats,
	        'invalid texture format');
	      var internalformat = flags.internalformat = textureFormats[formatStr];
	      flags.format = colorFormats[internalformat];
	      if (formatStr in textureTypes) {
	        if (!('type' in options)) {
	          flags.type = textureTypes[formatStr];
	        }
	      }
	      if (formatStr in compressedTextureFormats) {
	        flags.compressed = true;
	      }
	      hasFormat = true;
	    }

	    // Reconcile channels and format
	    if (!hasChannels && hasFormat) {
	      flags.channels = FORMAT_CHANNELS[flags.format];
	    } else if (hasChannels && !hasFormat) {
	      if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
	        flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
	      }
	    } else if (hasFormat && hasChannels) {
	      check$1(
	        flags.channels === FORMAT_CHANNELS[flags.format],
	        'number of channels inconsistent with specified format');
	    }
	  }

	  function setFlags (flags) {
	    gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
	    gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
	    gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
	    gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
	  }

	  // -------------------------------------------------------
	  // Tex image data
	  // -------------------------------------------------------
	  function TexImage () {
	    TexFlags.call(this);

	    this.xOffset = 0;
	    this.yOffset = 0;

	    // data
	    this.data = null;
	    this.needsFree = false;

	    // html element
	    this.element = null;

	    // copyTexImage info
	    this.needsCopy = false;
	  }

	  function parseImage (image, options) {
	    var data = null;
	    if (isPixelData(options)) {
	      data = options;
	    } else if (options) {
	      check$1.type(options, 'object', 'invalid pixel data type');
	      parseFlags(image, options);
	      if ('x' in options) {
	        image.xOffset = options.x | 0;
	      }
	      if ('y' in options) {
	        image.yOffset = options.y | 0;
	      }
	      if (isPixelData(options.data)) {
	        data = options.data;
	      }
	    }

	    check$1(
	      !image.compressed ||
	      data instanceof Uint8Array,
	      'compressed texture data must be stored in a uint8array');

	    if (options.copy) {
	      check$1(!data, 'can not specify copy and data field for the same texture');
	      var viewW = contextState.viewportWidth;
	      var viewH = contextState.viewportHeight;
	      image.width = image.width || (viewW - image.xOffset);
	      image.height = image.height || (viewH - image.yOffset);
	      image.needsCopy = true;
	      check$1(image.xOffset >= 0 && image.xOffset < viewW &&
	            image.yOffset >= 0 && image.yOffset < viewH &&
	            image.width > 0 && image.width <= viewW &&
	            image.height > 0 && image.height <= viewH,
	      'copy texture read out of bounds');
	    } else if (!data) {
	      image.width = image.width || 1;
	      image.height = image.height || 1;
	      image.channels = image.channels || 4;
	    } else if (isTypedArray(data)) {
	      image.channels = image.channels || 4;
	      image.data = data;
	      if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
	        image.type = typedArrayCode$1(data);
	      }
	    } else if (isNumericArray(data)) {
	      image.channels = image.channels || 4;
	      convertData(image, data);
	      image.alignment = 1;
	      image.needsFree = true;
	    } else if (isNDArrayLike(data)) {
	      var array = data.data;
	      if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
	        image.type = typedArrayCode$1(array);
	      }
	      var shape = data.shape;
	      var stride = data.stride;
	      var shapeX, shapeY, shapeC, strideX, strideY, strideC;
	      if (shape.length === 3) {
	        shapeC = shape[2];
	        strideC = stride[2];
	      } else {
	        check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
	        shapeC = 1;
	        strideC = 1;
	      }
	      shapeX = shape[0];
	      shapeY = shape[1];
	      strideX = stride[0];
	      strideY = stride[1];
	      image.alignment = 1;
	      image.width = shapeX;
	      image.height = shapeY;
	      image.channels = shapeC;
	      image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
	      image.needsFree = true;
	      transposeData(image, array, strideX, strideY, strideC, data.offset);
	    } else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
	      if (isCanvasElement(data) || isOffscreenCanvas(data)) {
	        image.element = data;
	      } else {
	        image.element = data.canvas;
	      }
	      image.width = image.element.width;
	      image.height = image.element.height;
	      image.channels = 4;
	    } else if (isBitmap(data)) {
	      image.element = data;
	      image.width = data.width;
	      image.height = data.height;
	      image.channels = 4;
	    } else if (isImageElement(data)) {
	      image.element = data;
	      image.width = data.naturalWidth;
	      image.height = data.naturalHeight;
	      image.channels = 4;
	    } else if (isVideoElement(data)) {
	      image.element = data;
	      image.width = data.videoWidth;
	      image.height = data.videoHeight;
	      image.channels = 4;
	    } else if (isRectArray(data)) {
	      var w = image.width || data[0].length;
	      var h = image.height || data.length;
	      var c = image.channels;
	      if (isArrayLike(data[0][0])) {
	        c = c || data[0][0].length;
	      } else {
	        c = c || 1;
	      }
	      var arrayShape = flattenUtils.shape(data);
	      var n = 1;
	      for (var dd = 0; dd < arrayShape.length; ++dd) {
	        n *= arrayShape[dd];
	      }
	      var allocData = preConvert(image, n);
	      flattenUtils.flatten(data, arrayShape, '', allocData);
	      postConvert(image, allocData);
	      image.alignment = 1;
	      image.width = w;
	      image.height = h;
	      image.channels = c;
	      image.format = image.internalformat = CHANNELS_FORMAT[c];
	      image.needsFree = true;
	    }

	    if (image.type === GL_FLOAT$4) {
	      check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
	        'oes_texture_float extension not enabled');
	    } else if (image.type === GL_HALF_FLOAT_OES$1) {
	      check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
	        'oes_texture_half_float extension not enabled');
	    }

	    // do compressed texture  validation here.
	  }

	  function setImage (info, target, miplevel) {
	    var element = info.element;
	    var data = info.data;
	    var internalformat = info.internalformat;
	    var format = info.format;
	    var type = info.type;
	    var width = info.width;
	    var height = info.height;

	    setFlags(info);

	    if (element) {
	      gl.texImage2D(target, miplevel, format, format, type, element);
	    } else if (info.compressed) {
	      gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
	    } else if (info.needsCopy) {
	      reglPoll();
	      gl.copyTexImage2D(
	        target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
	    } else {
	      gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
	    }
	  }

	  function setSubImage (info, target, x, y, miplevel) {
	    var element = info.element;
	    var data = info.data;
	    var internalformat = info.internalformat;
	    var format = info.format;
	    var type = info.type;
	    var width = info.width;
	    var height = info.height;

	    setFlags(info);

	    if (element) {
	      gl.texSubImage2D(
	        target, miplevel, x, y, format, type, element);
	    } else if (info.compressed) {
	      gl.compressedTexSubImage2D(
	        target, miplevel, x, y, internalformat, width, height, data);
	    } else if (info.needsCopy) {
	      reglPoll();
	      gl.copyTexSubImage2D(
	        target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
	    } else {
	      gl.texSubImage2D(
	        target, miplevel, x, y, width, height, format, type, data);
	    }
	  }

	  // texImage pool
	  var imagePool = [];

	  function allocImage () {
	    return imagePool.pop() || new TexImage()
	  }

	  function freeImage (image) {
	    if (image.needsFree) {
	      pool.freeType(image.data);
	    }
	    TexImage.call(image);
	    imagePool.push(image);
	  }

	  // -------------------------------------------------------
	  // Mip map
	  // -------------------------------------------------------
	  function MipMap () {
	    TexFlags.call(this);

	    this.genMipmaps = false;
	    this.mipmapHint = GL_DONT_CARE;
	    this.mipmask = 0;
	    this.images = Array(16);
	  }

	  function parseMipMapFromShape (mipmap, width, height) {
	    var img = mipmap.images[0] = allocImage();
	    mipmap.mipmask = 1;
	    img.width = mipmap.width = width;
	    img.height = mipmap.height = height;
	    img.channels = mipmap.channels = 4;
	  }

	  function parseMipMapFromObject (mipmap, options) {
	    var imgData = null;
	    if (isPixelData(options)) {
	      imgData = mipmap.images[0] = allocImage();
	      copyFlags(imgData, mipmap);
	      parseImage(imgData, options);
	      mipmap.mipmask = 1;
	    } else {
	      parseFlags(mipmap, options);
	      if (Array.isArray(options.mipmap)) {
	        var mipData = options.mipmap;
	        for (var i = 0; i < mipData.length; ++i) {
	          imgData = mipmap.images[i] = allocImage();
	          copyFlags(imgData, mipmap);
	          imgData.width >>= i;
	          imgData.height >>= i;
	          parseImage(imgData, mipData[i]);
	          mipmap.mipmask |= (1 << i);
	        }
	      } else {
	        imgData = mipmap.images[0] = allocImage();
	        copyFlags(imgData, mipmap);
	        parseImage(imgData, options);
	        mipmap.mipmask = 1;
	      }
	    }
	    copyFlags(mipmap, mipmap.images[0]);

	    // For textures of the compressed format WEBGL_compressed_texture_s3tc
	    // we must have that
	    //
	    // "When level equals zero width and height must be a multiple of 4.
	    // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
	    //
	    // but we do not yet support having multiple mipmap levels for compressed textures,
	    // so we only test for level zero.

	    if (
	      mipmap.compressed &&
	      (
	        mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT ||
	        mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT ||
	        mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT ||
	        mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
	      )
	    ) {
	      check$1(mipmap.width % 4 === 0 && mipmap.height % 4 === 0,
	        'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
	    }
	  }

	  function setMipMap (mipmap, target) {
	    var images = mipmap.images;
	    for (var i = 0; i < images.length; ++i) {
	      if (!images[i]) {
	        return
	      }
	      setImage(images[i], target, i);
	    }
	  }

	  var mipPool = [];

	  function allocMipMap () {
	    var result = mipPool.pop() || new MipMap();
	    TexFlags.call(result);
	    result.mipmask = 0;
	    for (var i = 0; i < 16; ++i) {
	      result.images[i] = null;
	    }
	    return result
	  }

	  function freeMipMap (mipmap) {
	    var images = mipmap.images;
	    for (var i = 0; i < images.length; ++i) {
	      if (images[i]) {
	        freeImage(images[i]);
	      }
	      images[i] = null;
	    }
	    mipPool.push(mipmap);
	  }

	  // -------------------------------------------------------
	  // Tex info
	  // -------------------------------------------------------
	  function TexInfo () {
	    this.minFilter = GL_NEAREST$1;
	    this.magFilter = GL_NEAREST$1;

	    this.wrapS = GL_CLAMP_TO_EDGE$1;
	    this.wrapT = GL_CLAMP_TO_EDGE$1;

	    this.anisotropic = 1;

	    this.genMipmaps = false;
	    this.mipmapHint = GL_DONT_CARE;
	  }

	  function parseTexInfo (info, options) {
	    if ('min' in options) {
	      var minFilter = options.min;
	      check$1.parameter(minFilter, minFilters);
	      info.minFilter = minFilters[minFilter];
	      if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
	        info.genMipmaps = true;
	      }
	    }

	    if ('mag' in options) {
	      var magFilter = options.mag;
	      check$1.parameter(magFilter, magFilters);
	      info.magFilter = magFilters[magFilter];
	    }

	    var wrapS = info.wrapS;
	    var wrapT = info.wrapT;
	    if ('wrap' in options) {
	      var wrap = options.wrap;
	      if (typeof wrap === 'string') {
	        check$1.parameter(wrap, wrapModes);
	        wrapS = wrapT = wrapModes[wrap];
	      } else if (Array.isArray(wrap)) {
	        check$1.parameter(wrap[0], wrapModes);
	        check$1.parameter(wrap[1], wrapModes);
	        wrapS = wrapModes[wrap[0]];
	        wrapT = wrapModes[wrap[1]];
	      }
	    } else {
	      if ('wrapS' in options) {
	        var optWrapS = options.wrapS;
	        check$1.parameter(optWrapS, wrapModes);
	        wrapS = wrapModes[optWrapS];
	      }
	      if ('wrapT' in options) {
	        var optWrapT = options.wrapT;
	        check$1.parameter(optWrapT, wrapModes);
	        wrapT = wrapModes[optWrapT];
	      }
	    }
	    info.wrapS = wrapS;
	    info.wrapT = wrapT;

	    if ('anisotropic' in options) {
	      var anisotropic = options.anisotropic;
	      check$1(typeof anisotropic === 'number' &&
	         anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
	      'aniso samples must be between 1 and ');
	      info.anisotropic = options.anisotropic;
	    }

	    if ('mipmap' in options) {
	      var hasMipMap = false;
	      switch (typeof options.mipmap) {
	        case 'string':
	          check$1.parameter(options.mipmap, mipmapHint,
	            'invalid mipmap hint');
	          info.mipmapHint = mipmapHint[options.mipmap];
	          info.genMipmaps = true;
	          hasMipMap = true;
	          break

	        case 'boolean':
	          hasMipMap = info.genMipmaps = options.mipmap;
	          break

	        case 'object':
	          check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
	          info.genMipmaps = false;
	          hasMipMap = true;
	          break

	        default:
	          check$1.raise('invalid mipmap type');
	      }
	      if (hasMipMap && !('min' in options)) {
	        info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
	      }
	    }
	  }

	  function setTexInfo (info, target) {
	    gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
	    gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
	    gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
	    gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
	    if (extensions.ext_texture_filter_anisotropic) {
	      gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
	    }
	    if (info.genMipmaps) {
	      gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
	      gl.generateMipmap(target);
	    }
	  }

	  // -------------------------------------------------------
	  // Full texture object
	  // -------------------------------------------------------
	  var textureCount = 0;
	  var textureSet = {};
	  var numTexUnits = limits.maxTextureUnits;
	  var textureUnits = Array(numTexUnits).map(function () {
	    return null
	  });

	  function REGLTexture (target) {
	    TexFlags.call(this);
	    this.mipmask = 0;
	    this.internalformat = GL_RGBA$1;

	    this.id = textureCount++;

	    this.refCount = 1;

	    this.target = target;
	    this.texture = gl.createTexture();

	    this.unit = -1;
	    this.bindCount = 0;

	    this.texInfo = new TexInfo();

	    if (config.profile) {
	      this.stats = { size: 0 };
	    }
	  }

	  function tempBind (texture) {
	    gl.activeTexture(GL_TEXTURE0$1);
	    gl.bindTexture(texture.target, texture.texture);
	  }

	  function tempRestore () {
	    var prev = textureUnits[0];
	    if (prev) {
	      gl.bindTexture(prev.target, prev.texture);
	    } else {
	      gl.bindTexture(GL_TEXTURE_2D$1, null);
	    }
	  }

	  function destroy (texture) {
	    var handle = texture.texture;
	    check$1(handle, 'must not double destroy texture');
	    var unit = texture.unit;
	    var target = texture.target;
	    if (unit >= 0) {
	      gl.activeTexture(GL_TEXTURE0$1 + unit);
	      gl.bindTexture(target, null);
	      textureUnits[unit] = null;
	    }
	    gl.deleteTexture(handle);
	    texture.texture = null;
	    texture.params = null;
	    texture.pixels = null;
	    texture.refCount = 0;
	    delete textureSet[texture.id];
	    stats.textureCount--;
	  }

	  extend(REGLTexture.prototype, {
	    bind: function () {
	      var texture = this;
	      texture.bindCount += 1;
	      var unit = texture.unit;
	      if (unit < 0) {
	        for (var i = 0; i < numTexUnits; ++i) {
	          var other = textureUnits[i];
	          if (other) {
	            if (other.bindCount > 0) {
	              continue
	            }
	            other.unit = -1;
	          }
	          textureUnits[i] = texture;
	          unit = i;
	          break
	        }
	        if (unit >= numTexUnits) {
	          check$1.raise('insufficient number of texture units');
	        }
	        if (config.profile && stats.maxTextureUnits < (unit + 1)) {
	          stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
	        }
	        texture.unit = unit;
	        gl.activeTexture(GL_TEXTURE0$1 + unit);
	        gl.bindTexture(texture.target, texture.texture);
	      }
	      return unit
	    },

	    unbind: function () {
	      this.bindCount -= 1;
	    },

	    decRef: function () {
	      if (--this.refCount <= 0) {
	        destroy(this);
	      }
	    }
	  });

	  function createTexture2D (a, b) {
	    var texture = new REGLTexture(GL_TEXTURE_2D$1);
	    textureSet[texture.id] = texture;
	    stats.textureCount++;

	    function reglTexture2D (a, b) {
	      var texInfo = texture.texInfo;
	      TexInfo.call(texInfo);
	      var mipData = allocMipMap();

	      if (typeof a === 'number') {
	        if (typeof b === 'number') {
	          parseMipMapFromShape(mipData, a | 0, b | 0);
	        } else {
	          parseMipMapFromShape(mipData, a | 0, a | 0);
	        }
	      } else if (a) {
	        check$1.type(a, 'object', 'invalid arguments to regl.texture');
	        parseTexInfo(texInfo, a);
	        parseMipMapFromObject(mipData, a);
	      } else {
	        // empty textures get assigned a default shape of 1x1
	        parseMipMapFromShape(mipData, 1, 1);
	      }

	      if (texInfo.genMipmaps) {
	        mipData.mipmask = (mipData.width << 1) - 1;
	      }
	      texture.mipmask = mipData.mipmask;

	      copyFlags(texture, mipData);

	      check$1.texture2D(texInfo, mipData, limits);
	      texture.internalformat = mipData.internalformat;

	      reglTexture2D.width = mipData.width;
	      reglTexture2D.height = mipData.height;

	      tempBind(texture);
	      setMipMap(mipData, GL_TEXTURE_2D$1);
	      setTexInfo(texInfo, GL_TEXTURE_2D$1);
	      tempRestore();

	      freeMipMap(mipData);

	      if (config.profile) {
	        texture.stats.size = getTextureSize(
	          texture.internalformat,
	          texture.type,
	          mipData.width,
	          mipData.height,
	          texInfo.genMipmaps,
	          false);
	      }
	      reglTexture2D.format = textureFormatsInvert[texture.internalformat];
	      reglTexture2D.type = textureTypesInvert[texture.type];

	      reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
	      reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

	      reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
	      reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

	      return reglTexture2D
	    }

	    function subimage (image, x_, y_, level_) {
	      check$1(!!image, 'must specify image data');

	      var x = x_ | 0;
	      var y = y_ | 0;
	      var level = level_ | 0;

	      var imageData = allocImage();
	      copyFlags(imageData, texture);
	      imageData.width = 0;
	      imageData.height = 0;
	      parseImage(imageData, image);
	      imageData.width = imageData.width || ((texture.width >> level) - x);
	      imageData.height = imageData.height || ((texture.height >> level) - y);

	      check$1(
	        texture.type === imageData.type &&
	        texture.format === imageData.format &&
	        texture.internalformat === imageData.internalformat,
	        'incompatible format for texture.subimage');
	      check$1(
	        x >= 0 && y >= 0 &&
	        x + imageData.width <= texture.width &&
	        y + imageData.height <= texture.height,
	        'texture.subimage write out of bounds');
	      check$1(
	        texture.mipmask & (1 << level),
	        'missing mipmap data');
	      check$1(
	        imageData.data || imageData.element || imageData.needsCopy,
	        'missing image data');

	      tempBind(texture);
	      setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
	      tempRestore();

	      freeImage(imageData);

	      return reglTexture2D
	    }

	    function resize (w_, h_) {
	      var w = w_ | 0;
	      var h = (h_ | 0) || w;
	      if (w === texture.width && h === texture.height) {
	        return reglTexture2D
	      }

	      reglTexture2D.width = texture.width = w;
	      reglTexture2D.height = texture.height = h;

	      tempBind(texture);

	      for (var i = 0; texture.mipmask >> i; ++i) {
	        var _w = w >> i;
	        var _h = h >> i;
	        if (!_w || !_h) break
	        gl.texImage2D(
	          GL_TEXTURE_2D$1,
	          i,
	          texture.format,
	          _w,
	          _h,
	          0,
	          texture.format,
	          texture.type,
	          null);
	      }
	      tempRestore();

	      // also, recompute the texture size.
	      if (config.profile) {
	        texture.stats.size = getTextureSize(
	          texture.internalformat,
	          texture.type,
	          w,
	          h,
	          false,
	          false);
	      }

	      return reglTexture2D
	    }

	    reglTexture2D(a, b);

	    reglTexture2D.subimage = subimage;
	    reglTexture2D.resize = resize;
	    reglTexture2D._reglType = 'texture2d';
	    reglTexture2D._texture = texture;
	    if (config.profile) {
	      reglTexture2D.stats = texture.stats;
	    }
	    reglTexture2D.destroy = function () {
	      texture.decRef();
	    };

	    return reglTexture2D
	  }

	  function createTextureCube (a0, a1, a2, a3, a4, a5) {
	    var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
	    textureSet[texture.id] = texture;
	    stats.cubeCount++;

	    var faces = new Array(6);

	    function reglTextureCube (a0, a1, a2, a3, a4, a5) {
	      var i;
	      var texInfo = texture.texInfo;
	      TexInfo.call(texInfo);
	      for (i = 0; i < 6; ++i) {
	        faces[i] = allocMipMap();
	      }

	      if (typeof a0 === 'number' || !a0) {
	        var s = (a0 | 0) || 1;
	        for (i = 0; i < 6; ++i) {
	          parseMipMapFromShape(faces[i], s, s);
	        }
	      } else if (typeof a0 === 'object') {
	        if (a1) {
	          parseMipMapFromObject(faces[0], a0);
	          parseMipMapFromObject(faces[1], a1);
	          parseMipMapFromObject(faces[2], a2);
	          parseMipMapFromObject(faces[3], a3);
	          parseMipMapFromObject(faces[4], a4);
	          parseMipMapFromObject(faces[5], a5);
	        } else {
	          parseTexInfo(texInfo, a0);
	          parseFlags(texture, a0);
	          if ('faces' in a0) {
	            var faceInput = a0.faces;
	            check$1(Array.isArray(faceInput) && faceInput.length === 6,
	              'cube faces must be a length 6 array');
	            for (i = 0; i < 6; ++i) {
	              check$1(typeof faceInput[i] === 'object' && !!faceInput[i],
	                'invalid input for cube map face');
	              copyFlags(faces[i], texture);
	              parseMipMapFromObject(faces[i], faceInput[i]);
	            }
	          } else {
	            for (i = 0; i < 6; ++i) {
	              parseMipMapFromObject(faces[i], a0);
	            }
	          }
	        }
	      } else {
	        check$1.raise('invalid arguments to cube map');
	      }

	      copyFlags(texture, faces[0]);
	      check$1.optional(function () {
	        if (!limits.npotTextureCube) {
	          check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
	        }
	      });

	      if (texInfo.genMipmaps) {
	        texture.mipmask = (faces[0].width << 1) - 1;
	      } else {
	        texture.mipmask = faces[0].mipmask;
	      }

	      check$1.textureCube(texture, texInfo, faces, limits);
	      texture.internalformat = faces[0].internalformat;

	      reglTextureCube.width = faces[0].width;
	      reglTextureCube.height = faces[0].height;

	      tempBind(texture);
	      for (i = 0; i < 6; ++i) {
	        setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
	      }
	      setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
	      tempRestore();

	      if (config.profile) {
	        texture.stats.size = getTextureSize(
	          texture.internalformat,
	          texture.type,
	          reglTextureCube.width,
	          reglTextureCube.height,
	          texInfo.genMipmaps,
	          true);
	      }

	      reglTextureCube.format = textureFormatsInvert[texture.internalformat];
	      reglTextureCube.type = textureTypesInvert[texture.type];

	      reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
	      reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

	      reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
	      reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

	      for (i = 0; i < 6; ++i) {
	        freeMipMap(faces[i]);
	      }

	      return reglTextureCube
	    }

	    function subimage (face, image, x_, y_, level_) {
	      check$1(!!image, 'must specify image data');
	      check$1(typeof face === 'number' && face === (face | 0) &&
	        face >= 0 && face < 6, 'invalid face');

	      var x = x_ | 0;
	      var y = y_ | 0;
	      var level = level_ | 0;

	      var imageData = allocImage();
	      copyFlags(imageData, texture);
	      imageData.width = 0;
	      imageData.height = 0;
	      parseImage(imageData, image);
	      imageData.width = imageData.width || ((texture.width >> level) - x);
	      imageData.height = imageData.height || ((texture.height >> level) - y);

	      check$1(
	        texture.type === imageData.type &&
	        texture.format === imageData.format &&
	        texture.internalformat === imageData.internalformat,
	        'incompatible format for texture.subimage');
	      check$1(
	        x >= 0 && y >= 0 &&
	        x + imageData.width <= texture.width &&
	        y + imageData.height <= texture.height,
	        'texture.subimage write out of bounds');
	      check$1(
	        texture.mipmask & (1 << level),
	        'missing mipmap data');
	      check$1(
	        imageData.data || imageData.element || imageData.needsCopy,
	        'missing image data');

	      tempBind(texture);
	      setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
	      tempRestore();

	      freeImage(imageData);

	      return reglTextureCube
	    }

	    function resize (radius_) {
	      var radius = radius_ | 0;
	      if (radius === texture.width) {
	        return
	      }

	      reglTextureCube.width = texture.width = radius;
	      reglTextureCube.height = texture.height = radius;

	      tempBind(texture);
	      for (var i = 0; i < 6; ++i) {
	        for (var j = 0; texture.mipmask >> j; ++j) {
	          gl.texImage2D(
	            GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
	            j,
	            texture.format,
	            radius >> j,
	            radius >> j,
	            0,
	            texture.format,
	            texture.type,
	            null);
	        }
	      }
	      tempRestore();

	      if (config.profile) {
	        texture.stats.size = getTextureSize(
	          texture.internalformat,
	          texture.type,
	          reglTextureCube.width,
	          reglTextureCube.height,
	          false,
	          true);
	      }

	      return reglTextureCube
	    }

	    reglTextureCube(a0, a1, a2, a3, a4, a5);

	    reglTextureCube.subimage = subimage;
	    reglTextureCube.resize = resize;
	    reglTextureCube._reglType = 'textureCube';
	    reglTextureCube._texture = texture;
	    if (config.profile) {
	      reglTextureCube.stats = texture.stats;
	    }
	    reglTextureCube.destroy = function () {
	      texture.decRef();
	    };

	    return reglTextureCube
	  }

	  // Called when regl is destroyed
	  function destroyTextures () {
	    for (var i = 0; i < numTexUnits; ++i) {
	      gl.activeTexture(GL_TEXTURE0$1 + i);
	      gl.bindTexture(GL_TEXTURE_2D$1, null);
	      textureUnits[i] = null;
	    }
	    values(textureSet).forEach(destroy);

	    stats.cubeCount = 0;
	    stats.textureCount = 0;
	  }

	  if (config.profile) {
	    stats.getTotalTextureSize = function () {
	      var total = 0;
	      Object.keys(textureSet).forEach(function (key) {
	        total += textureSet[key].stats.size;
	      });
	      return total
	    };
	  }

	  function restoreTextures () {
	    for (var i = 0; i < numTexUnits; ++i) {
	      var tex = textureUnits[i];
	      if (tex) {
	        tex.bindCount = 0;
	        tex.unit = -1;
	        textureUnits[i] = null;
	      }
	    }

	    values(textureSet).forEach(function (texture) {
	      texture.texture = gl.createTexture();
	      gl.bindTexture(texture.target, texture.texture);
	      for (var i = 0; i < 32; ++i) {
	        if ((texture.mipmask & (1 << i)) === 0) {
	          continue
	        }
	        if (texture.target === GL_TEXTURE_2D$1) {
	          gl.texImage2D(GL_TEXTURE_2D$1,
	            i,
	            texture.internalformat,
	            texture.width >> i,
	            texture.height >> i,
	            0,
	            texture.internalformat,
	            texture.type,
	            null);
	        } else {
	          for (var j = 0; j < 6; ++j) {
	            gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
	              i,
	              texture.internalformat,
	              texture.width >> i,
	              texture.height >> i,
	              0,
	              texture.internalformat,
	              texture.type,
	              null);
	          }
	        }
	      }
	      setTexInfo(texture.texInfo, texture.target);
	    });
	  }

	  function refreshTextures () {
	    for (var i = 0; i < numTexUnits; ++i) {
	      var tex = textureUnits[i];
	      if (tex) {
	        tex.bindCount = 0;
	        tex.unit = -1;
	        textureUnits[i] = null;
	      }
	      gl.activeTexture(GL_TEXTURE0$1 + i);
	      gl.bindTexture(GL_TEXTURE_2D$1, null);
	      gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
	    }
	  }

	  return {
	    create2D: createTexture2D,
	    createCube: createTextureCube,
	    clear: destroyTextures,
	    getTexture: function (wrapper) {
	      return null
	    },
	    restore: restoreTextures,
	    refresh: refreshTextures
	  }
	}

	var GL_RENDERBUFFER = 0x8D41;

	var GL_RGBA4$1 = 0x8056;
	var GL_RGB5_A1$1 = 0x8057;
	var GL_RGB565$1 = 0x8D62;
	var GL_DEPTH_COMPONENT16 = 0x81A5;
	var GL_STENCIL_INDEX8 = 0x8D48;
	var GL_DEPTH_STENCIL$1 = 0x84F9;

	var GL_SRGB8_ALPHA8_EXT = 0x8C43;

	var GL_RGBA32F_EXT = 0x8814;

	var GL_RGBA16F_EXT = 0x881A;
	var GL_RGB16F_EXT = 0x881B;

	var FORMAT_SIZES = [];

	FORMAT_SIZES[GL_RGBA4$1] = 2;
	FORMAT_SIZES[GL_RGB5_A1$1] = 2;
	FORMAT_SIZES[GL_RGB565$1] = 2;

	FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
	FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
	FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

	FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
	FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
	FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
	FORMAT_SIZES[GL_RGB16F_EXT] = 6;

	function getRenderbufferSize (format, width, height) {
	  return FORMAT_SIZES[format] * width * height
	}

	var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
	  var formatTypes = {
	    'rgba4': GL_RGBA4$1,
	    'rgb565': GL_RGB565$1,
	    'rgb5 a1': GL_RGB5_A1$1,
	    'depth': GL_DEPTH_COMPONENT16,
	    'stencil': GL_STENCIL_INDEX8,
	    'depth stencil': GL_DEPTH_STENCIL$1
	  };

	  if (extensions.ext_srgb) {
	    formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
	  }

	  if (extensions.ext_color_buffer_half_float) {
	    formatTypes['rgba16f'] = GL_RGBA16F_EXT;
	    formatTypes['rgb16f'] = GL_RGB16F_EXT;
	  }

	  if (extensions.webgl_color_buffer_float) {
	    formatTypes['rgba32f'] = GL_RGBA32F_EXT;
	  }

	  var formatTypesInvert = [];
	  Object.keys(formatTypes).forEach(function (key) {
	    var val = formatTypes[key];
	    formatTypesInvert[val] = key;
	  });

	  var renderbufferCount = 0;
	  var renderbufferSet = {};

	  function REGLRenderbuffer (renderbuffer) {
	    this.id = renderbufferCount++;
	    this.refCount = 1;

	    this.renderbuffer = renderbuffer;

	    this.format = GL_RGBA4$1;
	    this.width = 0;
	    this.height = 0;

	    if (config.profile) {
	      this.stats = { size: 0 };
	    }
	  }

	  REGLRenderbuffer.prototype.decRef = function () {
	    if (--this.refCount <= 0) {
	      destroy(this);
	    }
	  };

	  function destroy (rb) {
	    var handle = rb.renderbuffer;
	    check$1(handle, 'must not double destroy renderbuffer');
	    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
	    gl.deleteRenderbuffer(handle);
	    rb.renderbuffer = null;
	    rb.refCount = 0;
	    delete renderbufferSet[rb.id];
	    stats.renderbufferCount--;
	  }

	  function createRenderbuffer (a, b) {
	    var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
	    renderbufferSet[renderbuffer.id] = renderbuffer;
	    stats.renderbufferCount++;

	    function reglRenderbuffer (a, b) {
	      var w = 0;
	      var h = 0;
	      var format = GL_RGBA4$1;

	      if (typeof a === 'object' && a) {
	        var options = a;
	        if ('shape' in options) {
	          var shape = options.shape;
	          check$1(Array.isArray(shape) && shape.length >= 2,
	            'invalid renderbuffer shape');
	          w = shape[0] | 0;
	          h = shape[1] | 0;
	        } else {
	          if ('radius' in options) {
	            w = h = options.radius | 0;
	          }
	          if ('width' in options) {
	            w = options.width | 0;
	          }
	          if ('height' in options) {
	            h = options.height | 0;
	          }
	        }
	        if ('format' in options) {
	          check$1.parameter(options.format, formatTypes,
	            'invalid renderbuffer format');
	          format = formatTypes[options.format];
	        }
	      } else if (typeof a === 'number') {
	        w = a | 0;
	        if (typeof b === 'number') {
	          h = b | 0;
	        } else {
	          h = w;
	        }
	      } else if (!a) {
	        w = h = 1;
	      } else {
	        check$1.raise('invalid arguments to renderbuffer constructor');
	      }

	      // check shape
	      check$1(
	        w > 0 && h > 0 &&
	        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
	        'invalid renderbuffer size');

	      if (w === renderbuffer.width &&
	          h === renderbuffer.height &&
	          format === renderbuffer.format) {
	        return
	      }

	      reglRenderbuffer.width = renderbuffer.width = w;
	      reglRenderbuffer.height = renderbuffer.height = h;
	      renderbuffer.format = format;

	      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
	      gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

	      // check(
	      //   gl.getError() === 0,
	      //   'invalid render buffer format')

	      if (config.profile) {
	        renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
	      }
	      reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

	      return reglRenderbuffer
	    }

	    function resize (w_, h_) {
	      var w = w_ | 0;
	      var h = (h_ | 0) || w;

	      if (w === renderbuffer.width && h === renderbuffer.height) {
	        return reglRenderbuffer
	      }

	      // check shape
	      check$1(
	        w > 0 && h > 0 &&
	        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
	        'invalid renderbuffer size');

	      reglRenderbuffer.width = renderbuffer.width = w;
	      reglRenderbuffer.height = renderbuffer.height = h;

	      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
	      gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

	      // check(
	      //   gl.getError() === 0,
	      //   'invalid render buffer format')

	      // also, recompute size.
	      if (config.profile) {
	        renderbuffer.stats.size = getRenderbufferSize(
	          renderbuffer.format, renderbuffer.width, renderbuffer.height);
	      }

	      return reglRenderbuffer
	    }

	    reglRenderbuffer(a, b);

	    reglRenderbuffer.resize = resize;
	    reglRenderbuffer._reglType = 'renderbuffer';
	    reglRenderbuffer._renderbuffer = renderbuffer;
	    if (config.profile) {
	      reglRenderbuffer.stats = renderbuffer.stats;
	    }
	    reglRenderbuffer.destroy = function () {
	      renderbuffer.decRef();
	    };

	    return reglRenderbuffer
	  }

	  if (config.profile) {
	    stats.getTotalRenderbufferSize = function () {
	      var total = 0;
	      Object.keys(renderbufferSet).forEach(function (key) {
	        total += renderbufferSet[key].stats.size;
	      });
	      return total
	    };
	  }

	  function restoreRenderbuffers () {
	    values(renderbufferSet).forEach(function (rb) {
	      rb.renderbuffer = gl.createRenderbuffer();
	      gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
	      gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
	    });
	    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
	  }

	  return {
	    create: createRenderbuffer,
	    clear: function () {
	      values(renderbufferSet).forEach(destroy);
	    },
	    restore: restoreRenderbuffers
	  }
	};

	// We store these constants so that the minifier can inline them
	var GL_FRAMEBUFFER$1 = 0x8D40;
	var GL_RENDERBUFFER$1 = 0x8D41;

	var GL_TEXTURE_2D$2 = 0x0DE1;
	var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

	var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
	var GL_DEPTH_ATTACHMENT = 0x8D00;
	var GL_STENCIL_ATTACHMENT = 0x8D20;
	var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

	var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
	var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
	var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
	var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
	var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

	var GL_HALF_FLOAT_OES$2 = 0x8D61;
	var GL_UNSIGNED_BYTE$6 = 0x1401;
	var GL_FLOAT$5 = 0x1406;

	var GL_RGB$1 = 0x1907;
	var GL_RGBA$2 = 0x1908;

	var GL_DEPTH_COMPONENT$1 = 0x1902;

	var colorTextureFormatEnums = [
	  GL_RGB$1,
	  GL_RGBA$2
	];

	// for every texture format, store
	// the number of channels
	var textureFormatChannels = [];
	textureFormatChannels[GL_RGBA$2] = 4;
	textureFormatChannels[GL_RGB$1] = 3;

	// for every texture type, store
	// the size in bytes.
	var textureTypeSizes = [];
	textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
	textureTypeSizes[GL_FLOAT$5] = 4;
	textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

	var GL_RGBA4$2 = 0x8056;
	var GL_RGB5_A1$2 = 0x8057;
	var GL_RGB565$2 = 0x8D62;
	var GL_DEPTH_COMPONENT16$1 = 0x81A5;
	var GL_STENCIL_INDEX8$1 = 0x8D48;
	var GL_DEPTH_STENCIL$2 = 0x84F9;

	var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

	var GL_RGBA32F_EXT$1 = 0x8814;

	var GL_RGBA16F_EXT$1 = 0x881A;
	var GL_RGB16F_EXT$1 = 0x881B;

	var colorRenderbufferFormatEnums = [
	  GL_RGBA4$2,
	  GL_RGB5_A1$2,
	  GL_RGB565$2,
	  GL_SRGB8_ALPHA8_EXT$1,
	  GL_RGBA16F_EXT$1,
	  GL_RGB16F_EXT$1,
	  GL_RGBA32F_EXT$1
	];

	var statusCode = {};
	statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
	statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
	statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
	statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
	statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

	function wrapFBOState (
	  gl,
	  extensions,
	  limits,
	  textureState,
	  renderbufferState,
	  stats) {
	  var framebufferState = {
	    cur: null,
	    next: null,
	    dirty: false,
	    setFBO: null
	  };

	  var colorTextureFormats = ['rgba'];
	  var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

	  if (extensions.ext_srgb) {
	    colorRenderbufferFormats.push('srgba');
	  }

	  if (extensions.ext_color_buffer_half_float) {
	    colorRenderbufferFormats.push('rgba16f', 'rgb16f');
	  }

	  if (extensions.webgl_color_buffer_float) {
	    colorRenderbufferFormats.push('rgba32f');
	  }

	  var colorTypes = ['uint8'];
	  if (extensions.oes_texture_half_float) {
	    colorTypes.push('half float', 'float16');
	  }
	  if (extensions.oes_texture_float) {
	    colorTypes.push('float', 'float32');
	  }

	  function FramebufferAttachment (target, texture, renderbuffer) {
	    this.target = target;
	    this.texture = texture;
	    this.renderbuffer = renderbuffer;

	    var w = 0;
	    var h = 0;
	    if (texture) {
	      w = texture.width;
	      h = texture.height;
	    } else if (renderbuffer) {
	      w = renderbuffer.width;
	      h = renderbuffer.height;
	    }
	    this.width = w;
	    this.height = h;
	  }

	  function decRef (attachment) {
	    if (attachment) {
	      if (attachment.texture) {
	        attachment.texture._texture.decRef();
	      }
	      if (attachment.renderbuffer) {
	        attachment.renderbuffer._renderbuffer.decRef();
	      }
	    }
	  }

	  function incRefAndCheckShape (attachment, width, height) {
	    if (!attachment) {
	      return
	    }
	    if (attachment.texture) {
	      var texture = attachment.texture._texture;
	      var tw = Math.max(1, texture.width);
	      var th = Math.max(1, texture.height);
	      check$1(tw === width && th === height,
	        'inconsistent width/height for supplied texture');
	      texture.refCount += 1;
	    } else {
	      var renderbuffer = attachment.renderbuffer._renderbuffer;
	      check$1(
	        renderbuffer.width === width && renderbuffer.height === height,
	        'inconsistent width/height for renderbuffer');
	      renderbuffer.refCount += 1;
	    }
	  }

	  function attach (location, attachment) {
	    if (attachment) {
	      if (attachment.texture) {
	        gl.framebufferTexture2D(
	          GL_FRAMEBUFFER$1,
	          location,
	          attachment.target,
	          attachment.texture._texture.texture,
	          0);
	      } else {
	        gl.framebufferRenderbuffer(
	          GL_FRAMEBUFFER$1,
	          location,
	          GL_RENDERBUFFER$1,
	          attachment.renderbuffer._renderbuffer.renderbuffer);
	      }
	    }
	  }

	  function parseAttachment (attachment) {
	    var target = GL_TEXTURE_2D$2;
	    var texture = null;
	    var renderbuffer = null;

	    var data = attachment;
	    if (typeof attachment === 'object') {
	      data = attachment.data;
	      if ('target' in attachment) {
	        target = attachment.target | 0;
	      }
	    }

	    check$1.type(data, 'function', 'invalid attachment data');

	    var type = data._reglType;
	    if (type === 'texture2d') {
	      texture = data;
	      check$1(target === GL_TEXTURE_2D$2);
	    } else if (type === 'textureCube') {
	      texture = data;
	      check$1(
	        target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
	        target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
	        'invalid cube map target');
	    } else if (type === 'renderbuffer') {
	      renderbuffer = data;
	      target = GL_RENDERBUFFER$1;
	    } else {
	      check$1.raise('invalid regl object for attachment');
	    }

	    return new FramebufferAttachment(target, texture, renderbuffer)
	  }

	  function allocAttachment (
	    width,
	    height,
	    isTexture,
	    format,
	    type) {
	    if (isTexture) {
	      var texture = textureState.create2D({
	        width: width,
	        height: height,
	        format: format,
	        type: type
	      });
	      texture._texture.refCount = 0;
	      return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
	    } else {
	      var rb = renderbufferState.create({
	        width: width,
	        height: height,
	        format: format
	      });
	      rb._renderbuffer.refCount = 0;
	      return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
	    }
	  }

	  function unwrapAttachment (attachment) {
	    return attachment && (attachment.texture || attachment.renderbuffer)
	  }

	  function resizeAttachment (attachment, w, h) {
	    if (attachment) {
	      if (attachment.texture) {
	        attachment.texture.resize(w, h);
	      } else if (attachment.renderbuffer) {
	        attachment.renderbuffer.resize(w, h);
	      }
	      attachment.width = w;
	      attachment.height = h;
	    }
	  }

	  var framebufferCount = 0;
	  var framebufferSet = {};

	  function REGLFramebuffer () {
	    this.id = framebufferCount++;
	    framebufferSet[this.id] = this;

	    this.framebuffer = gl.createFramebuffer();
	    this.width = 0;
	    this.height = 0;

	    this.colorAttachments = [];
	    this.depthAttachment = null;
	    this.stencilAttachment = null;
	    this.depthStencilAttachment = null;
	  }

	  function decFBORefs (framebuffer) {
	    framebuffer.colorAttachments.forEach(decRef);
	    decRef(framebuffer.depthAttachment);
	    decRef(framebuffer.stencilAttachment);
	    decRef(framebuffer.depthStencilAttachment);
	  }

	  function destroy (framebuffer) {
	    var handle = framebuffer.framebuffer;
	    check$1(handle, 'must not double destroy framebuffer');
	    gl.deleteFramebuffer(handle);
	    framebuffer.framebuffer = null;
	    stats.framebufferCount--;
	    delete framebufferSet[framebuffer.id];
	  }

	  function updateFramebuffer (framebuffer) {
	    var i;

	    gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
	    var colorAttachments = framebuffer.colorAttachments;
	    for (i = 0; i < colorAttachments.length; ++i) {
	      attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
	    }
	    for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
	      gl.framebufferTexture2D(
	        GL_FRAMEBUFFER$1,
	        GL_COLOR_ATTACHMENT0$1 + i,
	        GL_TEXTURE_2D$2,
	        null,
	        0);
	    }

	    gl.framebufferTexture2D(
	      GL_FRAMEBUFFER$1,
	      GL_DEPTH_STENCIL_ATTACHMENT,
	      GL_TEXTURE_2D$2,
	      null,
	      0);
	    gl.framebufferTexture2D(
	      GL_FRAMEBUFFER$1,
	      GL_DEPTH_ATTACHMENT,
	      GL_TEXTURE_2D$2,
	      null,
	      0);
	    gl.framebufferTexture2D(
	      GL_FRAMEBUFFER$1,
	      GL_STENCIL_ATTACHMENT,
	      GL_TEXTURE_2D$2,
	      null,
	      0);

	    attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
	    attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
	    attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

	    // Check status code
	    var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
	    if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
	      check$1.raise('framebuffer configuration not supported, status = ' +
	        statusCode[status]);
	    }

	    gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
	    framebufferState.cur = framebufferState.next;

	    // FIXME: Clear error code here.  This is a work around for a bug in
	    // headless-gl
	    gl.getError();
	  }

	  function createFBO (a0, a1) {
	    var framebuffer = new REGLFramebuffer();
	    stats.framebufferCount++;

	    function reglFramebuffer (a, b) {
	      var i;

	      check$1(framebufferState.next !== framebuffer,
	        'can not update framebuffer which is currently in use');

	      var width = 0;
	      var height = 0;

	      var needsDepth = true;
	      var needsStencil = true;

	      var colorBuffer = null;
	      var colorTexture = true;
	      var colorFormat = 'rgba';
	      var colorType = 'uint8';
	      var colorCount = 1;

	      var depthBuffer = null;
	      var stencilBuffer = null;
	      var depthStencilBuffer = null;
	      var depthStencilTexture = false;

	      if (typeof a === 'number') {
	        width = a | 0;
	        height = (b | 0) || width;
	      } else if (!a) {
	        width = height = 1;
	      } else {
	        check$1.type(a, 'object', 'invalid arguments for framebuffer');
	        var options = a;

	        if ('shape' in options) {
	          var shape = options.shape;
	          check$1(Array.isArray(shape) && shape.length >= 2,
	            'invalid shape for framebuffer');
	          width = shape[0];
	          height = shape[1];
	        } else {
	          if ('radius' in options) {
	            width = height = options.radius;
	          }
	          if ('width' in options) {
	            width = options.width;
	          }
	          if ('height' in options) {
	            height = options.height;
	          }
	        }

	        if ('color' in options ||
	            'colors' in options) {
	          colorBuffer =
	            options.color ||
	            options.colors;
	          if (Array.isArray(colorBuffer)) {
	            check$1(
	              colorBuffer.length === 1 || extensions.webgl_draw_buffers,
	              'multiple render targets not supported');
	          }
	        }

	        if (!colorBuffer) {
	          if ('colorCount' in options) {
	            colorCount = options.colorCount | 0;
	            check$1(colorCount > 0, 'invalid color buffer count');
	          }

	          if ('colorTexture' in options) {
	            colorTexture = !!options.colorTexture;
	            colorFormat = 'rgba4';
	          }

	          if ('colorType' in options) {
	            colorType = options.colorType;
	            if (!colorTexture) {
	              if (colorType === 'half float' || colorType === 'float16') {
	                check$1(extensions.ext_color_buffer_half_float,
	                  'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
	                colorFormat = 'rgba16f';
	              } else if (colorType === 'float' || colorType === 'float32') {
	                check$1(extensions.webgl_color_buffer_float,
	                  'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
	                colorFormat = 'rgba32f';
	              }
	            } else {
	              check$1(extensions.oes_texture_float ||
	                !(colorType === 'float' || colorType === 'float32'),
	              'you must enable OES_texture_float in order to use floating point framebuffer objects');
	              check$1(extensions.oes_texture_half_float ||
	                !(colorType === 'half float' || colorType === 'float16'),
	              'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
	            }
	            check$1.oneOf(colorType, colorTypes, 'invalid color type');
	          }

	          if ('colorFormat' in options) {
	            colorFormat = options.colorFormat;
	            if (colorTextureFormats.indexOf(colorFormat) >= 0) {
	              colorTexture = true;
	            } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
	              colorTexture = false;
	            } else {
	              check$1.optional(function () {
	                if (colorTexture) {
	                  check$1.oneOf(
	                    options.colorFormat, colorTextureFormats,
	                    'invalid color format for texture');
	                } else {
	                  check$1.oneOf(
	                    options.colorFormat, colorRenderbufferFormats,
	                    'invalid color format for renderbuffer');
	                }
	              });
	            }
	          }
	        }

	        if ('depthTexture' in options || 'depthStencilTexture' in options) {
	          depthStencilTexture = !!(options.depthTexture ||
	            options.depthStencilTexture);
	          check$1(!depthStencilTexture || extensions.webgl_depth_texture,
	            'webgl_depth_texture extension not supported');
	        }

	        if ('depth' in options) {
	          if (typeof options.depth === 'boolean') {
	            needsDepth = options.depth;
	          } else {
	            depthBuffer = options.depth;
	            needsStencil = false;
	          }
	        }

	        if ('stencil' in options) {
	          if (typeof options.stencil === 'boolean') {
	            needsStencil = options.stencil;
	          } else {
	            stencilBuffer = options.stencil;
	            needsDepth = false;
	          }
	        }

	        if ('depthStencil' in options) {
	          if (typeof options.depthStencil === 'boolean') {
	            needsDepth = needsStencil = options.depthStencil;
	          } else {
	            depthStencilBuffer = options.depthStencil;
	            needsDepth = false;
	            needsStencil = false;
	          }
	        }
	      }

	      // parse attachments
	      var colorAttachments = null;
	      var depthAttachment = null;
	      var stencilAttachment = null;
	      var depthStencilAttachment = null;

	      // Set up color attachments
	      if (Array.isArray(colorBuffer)) {
	        colorAttachments = colorBuffer.map(parseAttachment);
	      } else if (colorBuffer) {
	        colorAttachments = [parseAttachment(colorBuffer)];
	      } else {
	        colorAttachments = new Array(colorCount);
	        for (i = 0; i < colorCount; ++i) {
	          colorAttachments[i] = allocAttachment(
	            width,
	            height,
	            colorTexture,
	            colorFormat,
	            colorType);
	        }
	      }

	      check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
	        'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
	      check$1(colorAttachments.length <= limits.maxColorAttachments,
	        'too many color attachments, not supported');

	      width = width || colorAttachments[0].width;
	      height = height || colorAttachments[0].height;

	      if (depthBuffer) {
	        depthAttachment = parseAttachment(depthBuffer);
	      } else if (needsDepth && !needsStencil) {
	        depthAttachment = allocAttachment(
	          width,
	          height,
	          depthStencilTexture,
	          'depth',
	          'uint32');
	      }

	      if (stencilBuffer) {
	        stencilAttachment = parseAttachment(stencilBuffer);
	      } else if (needsStencil && !needsDepth) {
	        stencilAttachment = allocAttachment(
	          width,
	          height,
	          false,
	          'stencil',
	          'uint8');
	      }

	      if (depthStencilBuffer) {
	        depthStencilAttachment = parseAttachment(depthStencilBuffer);
	      } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
	        depthStencilAttachment = allocAttachment(
	          width,
	          height,
	          depthStencilTexture,
	          'depth stencil',
	          'depth stencil');
	      }

	      check$1(
	        (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
	        'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

	      var commonColorAttachmentSize = null;

	      for (i = 0; i < colorAttachments.length; ++i) {
	        incRefAndCheckShape(colorAttachments[i], width, height);
	        check$1(!colorAttachments[i] ||
	          (colorAttachments[i].texture &&
	            colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
	          (colorAttachments[i].renderbuffer &&
	            colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
	        'framebuffer color attachment ' + i + ' is invalid');

	        if (colorAttachments[i] && colorAttachments[i].texture) {
	          var colorAttachmentSize =
	              textureFormatChannels[colorAttachments[i].texture._texture.format] *
	              textureTypeSizes[colorAttachments[i].texture._texture.type];

	          if (commonColorAttachmentSize === null) {
	            commonColorAttachmentSize = colorAttachmentSize;
	          } else {
	            // We need to make sure that all color attachments have the same number of bitplanes
	            // (that is, the same numer of bits per pixel)
	            // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
	            check$1(commonColorAttachmentSize === colorAttachmentSize,
	              'all color attachments much have the same number of bits per pixel.');
	          }
	        }
	      }
	      incRefAndCheckShape(depthAttachment, width, height);
	      check$1(!depthAttachment ||
	        (depthAttachment.texture &&
	          depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
	        (depthAttachment.renderbuffer &&
	          depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
	      'invalid depth attachment for framebuffer object');
	      incRefAndCheckShape(stencilAttachment, width, height);
	      check$1(!stencilAttachment ||
	        (stencilAttachment.renderbuffer &&
	          stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
	      'invalid stencil attachment for framebuffer object');
	      incRefAndCheckShape(depthStencilAttachment, width, height);
	      check$1(!depthStencilAttachment ||
	        (depthStencilAttachment.texture &&
	          depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
	        (depthStencilAttachment.renderbuffer &&
	          depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
	      'invalid depth-stencil attachment for framebuffer object');

	      // decrement references
	      decFBORefs(framebuffer);

	      framebuffer.width = width;
	      framebuffer.height = height;

	      framebuffer.colorAttachments = colorAttachments;
	      framebuffer.depthAttachment = depthAttachment;
	      framebuffer.stencilAttachment = stencilAttachment;
	      framebuffer.depthStencilAttachment = depthStencilAttachment;

	      reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
	      reglFramebuffer.depth = unwrapAttachment(depthAttachment);
	      reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
	      reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

	      reglFramebuffer.width = framebuffer.width;
	      reglFramebuffer.height = framebuffer.height;

	      updateFramebuffer(framebuffer);

	      return reglFramebuffer
	    }

	    function resize (w_, h_) {
	      check$1(framebufferState.next !== framebuffer,
	        'can not resize a framebuffer which is currently in use');

	      var w = Math.max(w_ | 0, 1);
	      var h = Math.max((h_ | 0) || w, 1);
	      if (w === framebuffer.width && h === framebuffer.height) {
	        return reglFramebuffer
	      }

	      // resize all buffers
	      var colorAttachments = framebuffer.colorAttachments;
	      for (var i = 0; i < colorAttachments.length; ++i) {
	        resizeAttachment(colorAttachments[i], w, h);
	      }
	      resizeAttachment(framebuffer.depthAttachment, w, h);
	      resizeAttachment(framebuffer.stencilAttachment, w, h);
	      resizeAttachment(framebuffer.depthStencilAttachment, w, h);

	      framebuffer.width = reglFramebuffer.width = w;
	      framebuffer.height = reglFramebuffer.height = h;

	      updateFramebuffer(framebuffer);

	      return reglFramebuffer
	    }

	    reglFramebuffer(a0, a1);

	    return extend(reglFramebuffer, {
	      resize: resize,
	      _reglType: 'framebuffer',
	      _framebuffer: framebuffer,
	      destroy: function () {
	        destroy(framebuffer);
	        decFBORefs(framebuffer);
	      },
	      use: function (block) {
	        framebufferState.setFBO({
	          framebuffer: reglFramebuffer
	        }, block);
	      }
	    })
	  }

	  function createCubeFBO (options) {
	    var faces = Array(6);

	    function reglFramebufferCube (a) {
	      var i;

	      check$1(faces.indexOf(framebufferState.next) < 0,
	        'can not update framebuffer which is currently in use');

	      var params = {
	        color: null
	      };

	      var radius = 0;

	      var colorBuffer = null;
	      var colorFormat = 'rgba';
	      var colorType = 'uint8';
	      var colorCount = 1;

	      if (typeof a === 'number') {
	        radius = a | 0;
	      } else if (!a) {
	        radius = 1;
	      } else {
	        check$1.type(a, 'object', 'invalid arguments for framebuffer');
	        var options = a;

	        if ('shape' in options) {
	          var shape = options.shape;
	          check$1(
	            Array.isArray(shape) && shape.length >= 2,
	            'invalid shape for framebuffer');
	          check$1(
	            shape[0] === shape[1],
	            'cube framebuffer must be square');
	          radius = shape[0];
	        } else {
	          if ('radius' in options) {
	            radius = options.radius | 0;
	          }
	          if ('width' in options) {
	            radius = options.width | 0;
	            if ('height' in options) {
	              check$1(options.height === radius, 'must be square');
	            }
	          } else if ('height' in options) {
	            radius = options.height | 0;
	          }
	        }

	        if ('color' in options ||
	            'colors' in options) {
	          colorBuffer =
	            options.color ||
	            options.colors;
	          if (Array.isArray(colorBuffer)) {
	            check$1(
	              colorBuffer.length === 1 || extensions.webgl_draw_buffers,
	              'multiple render targets not supported');
	          }
	        }

	        if (!colorBuffer) {
	          if ('colorCount' in options) {
	            colorCount = options.colorCount | 0;
	            check$1(colorCount > 0, 'invalid color buffer count');
	          }

	          if ('colorType' in options) {
	            check$1.oneOf(
	              options.colorType, colorTypes,
	              'invalid color type');
	            colorType = options.colorType;
	          }

	          if ('colorFormat' in options) {
	            colorFormat = options.colorFormat;
	            check$1.oneOf(
	              options.colorFormat, colorTextureFormats,
	              'invalid color format for texture');
	          }
	        }

	        if ('depth' in options) {
	          params.depth = options.depth;
	        }

	        if ('stencil' in options) {
	          params.stencil = options.stencil;
	        }

	        if ('depthStencil' in options) {
	          params.depthStencil = options.depthStencil;
	        }
	      }

	      var colorCubes;
	      if (colorBuffer) {
	        if (Array.isArray(colorBuffer)) {
	          colorCubes = [];
	          for (i = 0; i < colorBuffer.length; ++i) {
	            colorCubes[i] = colorBuffer[i];
	          }
	        } else {
	          colorCubes = [ colorBuffer ];
	        }
	      } else {
	        colorCubes = Array(colorCount);
	        var cubeMapParams = {
	          radius: radius,
	          format: colorFormat,
	          type: colorType
	        };
	        for (i = 0; i < colorCount; ++i) {
	          colorCubes[i] = textureState.createCube(cubeMapParams);
	        }
	      }

	      // Check color cubes
	      params.color = Array(colorCubes.length);
	      for (i = 0; i < colorCubes.length; ++i) {
	        var cube = colorCubes[i];
	        check$1(
	          typeof cube === 'function' && cube._reglType === 'textureCube',
	          'invalid cube map');
	        radius = radius || cube.width;
	        check$1(
	          cube.width === radius && cube.height === radius,
	          'invalid cube map shape');
	        params.color[i] = {
	          target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
	          data: colorCubes[i]
	        };
	      }

	      for (i = 0; i < 6; ++i) {
	        for (var j = 0; j < colorCubes.length; ++j) {
	          params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
	        }
	        // reuse depth-stencil attachments across all cube maps
	        if (i > 0) {
	          params.depth = faces[0].depth;
	          params.stencil = faces[0].stencil;
	          params.depthStencil = faces[0].depthStencil;
	        }
	        if (faces[i]) {
	          (faces[i])(params);
	        } else {
	          faces[i] = createFBO(params);
	        }
	      }

	      return extend(reglFramebufferCube, {
	        width: radius,
	        height: radius,
	        color: colorCubes
	      })
	    }

	    function resize (radius_) {
	      var i;
	      var radius = radius_ | 0;
	      check$1(radius > 0 && radius <= limits.maxCubeMapSize,
	        'invalid radius for cube fbo');

	      if (radius === reglFramebufferCube.width) {
	        return reglFramebufferCube
	      }

	      var colors = reglFramebufferCube.color;
	      for (i = 0; i < colors.length; ++i) {
	        colors[i].resize(radius);
	      }

	      for (i = 0; i < 6; ++i) {
	        faces[i].resize(radius);
	      }

	      reglFramebufferCube.width = reglFramebufferCube.height = radius;

	      return reglFramebufferCube
	    }

	    reglFramebufferCube(options);

	    return extend(reglFramebufferCube, {
	      faces: faces,
	      resize: resize,
	      _reglType: 'framebufferCube',
	      destroy: function () {
	        faces.forEach(function (f) {
	          f.destroy();
	        });
	      }
	    })
	  }

	  function restoreFramebuffers () {
	    framebufferState.cur = null;
	    framebufferState.next = null;
	    framebufferState.dirty = true;
	    values(framebufferSet).forEach(function (fb) {
	      fb.framebuffer = gl.createFramebuffer();
	      updateFramebuffer(fb);
	    });
	  }

	  return extend(framebufferState, {
	    getFramebuffer: function (object) {
	      if (typeof object === 'function' && object._reglType === 'framebuffer') {
	        var fbo = object._framebuffer;
	        if (fbo instanceof REGLFramebuffer) {
	          return fbo
	        }
	      }
	      return null
	    },
	    create: createFBO,
	    createCube: createCubeFBO,
	    clear: function () {
	      values(framebufferSet).forEach(destroy);
	    },
	    restore: restoreFramebuffers
	  })
	}

	var GL_FLOAT$6 = 5126;
	var GL_ARRAY_BUFFER$1 = 34962;
	var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

	var VAO_OPTIONS = [
	  'attributes',
	  'elements',
	  'offset',
	  'count',
	  'primitive',
	  'instances'
	];

	function AttributeRecord () {
	  this.state = 0;

	  this.x = 0.0;
	  this.y = 0.0;
	  this.z = 0.0;
	  this.w = 0.0;

	  this.buffer = null;
	  this.size = 0;
	  this.normalized = false;
	  this.type = GL_FLOAT$6;
	  this.offset = 0;
	  this.stride = 0;
	  this.divisor = 0;
	}

	function wrapAttributeState (
	  gl,
	  extensions,
	  limits,
	  stats,
	  bufferState,
	  elementState,
	  drawState) {
	  var NUM_ATTRIBUTES = limits.maxAttributes;
	  var attributeBindings = new Array(NUM_ATTRIBUTES);
	  for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
	    attributeBindings[i] = new AttributeRecord();
	  }
	  var vaoCount = 0;
	  var vaoSet = {};

	  var state = {
	    Record: AttributeRecord,
	    scope: {},
	    state: attributeBindings,
	    currentVAO: null,
	    targetVAO: null,
	    restore: extVAO() ? restoreVAO : function () {},
	    createVAO: createVAO,
	    getVAO: getVAO,
	    destroyBuffer: destroyBuffer,
	    setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
	    clear: extVAO() ? destroyVAOEXT : function () {}
	  };

	  function destroyBuffer (buffer) {
	    for (var i = 0; i < attributeBindings.length; ++i) {
	      var record = attributeBindings[i];
	      if (record.buffer === buffer) {
	        gl.disableVertexAttribArray(i);
	        record.buffer = null;
	      }
	    }
	  }

	  function extVAO () {
	    return extensions.oes_vertex_array_object
	  }

	  function extInstanced () {
	    return extensions.angle_instanced_arrays
	  }

	  function getVAO (vao) {
	    if (typeof vao === 'function' && vao._vao) {
	      return vao._vao
	    }
	    return null
	  }

	  function setVAOEXT (vao) {
	    if (vao === state.currentVAO) {
	      return
	    }
	    var ext = extVAO();
	    if (vao) {
	      ext.bindVertexArrayOES(vao.vao);
	    } else {
	      ext.bindVertexArrayOES(null);
	    }
	    state.currentVAO = vao;
	  }

	  function setVAOEmulated (vao) {
	    if (vao === state.currentVAO) {
	      return
	    }
	    if (vao) {
	      vao.bindAttrs();
	    } else {
	      var exti = extInstanced();
	      for (var i = 0; i < attributeBindings.length; ++i) {
	        var binding = attributeBindings[i];
	        if (binding.buffer) {
	          gl.enableVertexAttribArray(i);
	          binding.buffer.bind();
	          gl.vertexAttribPointer(i, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
	          if (exti && binding.divisor) {
	            exti.vertexAttribDivisorANGLE(i, binding.divisor);
	          }
	        } else {
	          gl.disableVertexAttribArray(i);
	          gl.vertexAttrib4f(i, binding.x, binding.y, binding.z, binding.w);
	        }
	      }
	      if (drawState.elements) {
	        gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, drawState.elements.buffer.buffer);
	      } else {
	        gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
	      }
	    }
	    state.currentVAO = vao;
	  }

	  function destroyVAOEXT () {
	    values(vaoSet).forEach(function (vao) {
	      vao.destroy();
	    });
	  }

	  function REGLVAO () {
	    this.id = ++vaoCount;
	    this.attributes = [];
	    this.elements = null;
	    this.ownsElements = false;
	    this.count = 0;
	    this.offset = 0;
	    this.instances = -1;
	    this.primitive = 4;
	    var extension = extVAO();
	    if (extension) {
	      this.vao = extension.createVertexArrayOES();
	    } else {
	      this.vao = null;
	    }
	    vaoSet[this.id] = this;
	    this.buffers = [];
	  }

	  REGLVAO.prototype.bindAttrs = function () {
	    var exti = extInstanced();
	    var attributes = this.attributes;
	    for (var i = 0; i < attributes.length; ++i) {
	      var attr = attributes[i];
	      if (attr.buffer) {
	        gl.enableVertexAttribArray(i);
	        gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
	        gl.vertexAttribPointer(i, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
	        if (exti && attr.divisor) {
	          exti.vertexAttribDivisorANGLE(i, attr.divisor);
	        }
	      } else {
	        gl.disableVertexAttribArray(i);
	        gl.vertexAttrib4f(i, attr.x, attr.y, attr.z, attr.w);
	      }
	    }
	    for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
	      gl.disableVertexAttribArray(j);
	    }
	    var elements = elementState.getElements(this.elements);
	    if (elements) {
	      gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, elements.buffer.buffer);
	    } else {
	      gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
	    }
	  };

	  REGLVAO.prototype.refresh = function () {
	    var ext = extVAO();
	    if (ext) {
	      ext.bindVertexArrayOES(this.vao);
	      this.bindAttrs();
	      state.currentVAO = null;
	      ext.bindVertexArrayOES(null);
	    }
	  };

	  REGLVAO.prototype.destroy = function () {
	    if (this.vao) {
	      var extension = extVAO();
	      if (this === state.currentVAO) {
	        state.currentVAO = null;
	        extension.bindVertexArrayOES(null);
	      }
	      extension.deleteVertexArrayOES(this.vao);
	      this.vao = null;
	    }
	    if (this.ownsElements) {
	      this.elements.destroy();
	      this.elements = null;
	      this.ownsElements = false;
	    }
	    if (vaoSet[this.id]) {
	      delete vaoSet[this.id];
	      stats.vaoCount -= 1;
	    }
	  };

	  function restoreVAO () {
	    var ext = extVAO();
	    if (ext) {
	      values(vaoSet).forEach(function (vao) {
	        vao.refresh();
	      });
	    }
	  }

	  function createVAO (_attr) {
	    var vao = new REGLVAO();
	    stats.vaoCount += 1;

	    function updateVAO (options) {
	      var attributes;
	      if (Array.isArray(options)) {
	        attributes = options;
	        if (vao.elements && vao.ownsElements) {
	          vao.elements.destroy();
	        }
	        vao.elements = null;
	        vao.ownsElements = false;
	        vao.offset = 0;
	        vao.count = 0;
	        vao.instances = -1;
	        vao.primitive = 4;
	      } else {
	        check$1(typeof options === 'object', 'invalid arguments for create vao');
	        check$1('attributes' in options, 'must specify attributes for vao');
	        if (options.elements) {
	          var elements = options.elements;
	          if (vao.ownsElements) {
	            if (typeof elements === 'function' && elements._reglType === 'elements') {
	              vao.elements.destroy();
	              vao.ownsElements = false;
	            } else {
	              vao.elements(elements);
	              vao.ownsElements = false;
	            }
	          } else if (elementState.getElements(options.elements)) {
	            vao.elements = options.elements;
	            vao.ownsElements = false;
	          } else {
	            vao.elements = elementState.create(options.elements);
	            vao.ownsElements = true;
	          }
	        } else {
	          vao.elements = null;
	          vao.ownsElements = false;
	        }
	        attributes = options.attributes;

	        // set default vao
	        vao.offset = 0;
	        vao.count = -1;
	        vao.instances = -1;
	        vao.primitive = 4;

	        // copy element properties
	        if (vao.elements) {
	          vao.count = vao.elements._elements.vertCount;
	          vao.primitive = vao.elements._elements.primType;
	        }

	        if ('offset' in options) {
	          vao.offset = options.offset | 0;
	        }
	        if ('count' in options) {
	          vao.count = options.count | 0;
	        }
	        if ('instances' in options) {
	          vao.instances = options.instances | 0;
	        }
	        if ('primitive' in options) {
	          check$1(options.primitive in primTypes, 'bad primitive type: ' + options.primitive);
	          vao.primitive = primTypes[options.primitive];
	        }

	        check$1.optional(() => {
	          var keys = Object.keys(options);
	          for (var i = 0; i < keys.length; ++i) {
	            check$1(VAO_OPTIONS.indexOf(keys[i]) >= 0, 'invalid option for vao: "' + keys[i] + '" valid options are ' + VAO_OPTIONS);
	          }
	        });
	        check$1(Array.isArray(attributes), 'attributes must be an array');
	      }

	      check$1(attributes.length < NUM_ATTRIBUTES, 'too many attributes');
	      check$1(attributes.length > 0, 'must specify at least one attribute');

	      var bufUpdated = {};
	      var nattributes = vao.attributes;
	      nattributes.length = attributes.length;
	      for (var i = 0; i < attributes.length; ++i) {
	        var spec = attributes[i];
	        var rec = nattributes[i] = new AttributeRecord();
	        var data = spec.data || spec;
	        if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
	          var buf;
	          if (vao.buffers[i]) {
	            buf = vao.buffers[i];
	            if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
	              buf.subdata(data);
	            } else {
	              buf.destroy();
	              vao.buffers[i] = null;
	            }
	          }
	          if (!vao.buffers[i]) {
	            buf = vao.buffers[i] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
	          }
	          rec.buffer = bufferState.getBuffer(buf);
	          rec.size = rec.buffer.dimension | 0;
	          rec.normalized = false;
	          rec.type = rec.buffer.dtype;
	          rec.offset = 0;
	          rec.stride = 0;
	          rec.divisor = 0;
	          rec.state = 1;
	          bufUpdated[i] = 1;
	        } else if (bufferState.getBuffer(spec)) {
	          rec.buffer = bufferState.getBuffer(spec);
	          rec.size = rec.buffer.dimension | 0;
	          rec.normalized = false;
	          rec.type = rec.buffer.dtype;
	          rec.offset = 0;
	          rec.stride = 0;
	          rec.divisor = 0;
	          rec.state = 1;
	        } else if (bufferState.getBuffer(spec.buffer)) {
	          rec.buffer = bufferState.getBuffer(spec.buffer);
	          rec.size = ((+spec.size) || rec.buffer.dimension) | 0;
	          rec.normalized = !!spec.normalized || false;
	          if ('type' in spec) {
	            check$1.parameter(spec.type, glTypes, 'invalid buffer type');
	            rec.type = glTypes[spec.type];
	          } else {
	            rec.type = rec.buffer.dtype;
	          }
	          rec.offset = (spec.offset || 0) | 0;
	          rec.stride = (spec.stride || 0) | 0;
	          rec.divisor = (spec.divisor || 0) | 0;
	          rec.state = 1;

	          check$1(rec.size >= 1 && rec.size <= 4, 'size must be between 1 and 4');
	          check$1(rec.offset >= 0, 'invalid offset');
	          check$1(rec.stride >= 0 && rec.stride <= 255, 'stride must be between 0 and 255');
	          check$1(rec.divisor >= 0, 'divisor must be positive');
	          check$1(!rec.divisor || !!extensions.angle_instanced_arrays, 'ANGLE_instanced_arrays must be enabled to use divisor');
	        } else if ('x' in spec) {
	          check$1(i > 0, 'first attribute must not be a constant');
	          rec.x = +spec.x || 0;
	          rec.y = +spec.y || 0;
	          rec.z = +spec.z || 0;
	          rec.w = +spec.w || 0;
	          rec.state = 2;
	        } else {
	          check$1(false, 'invalid attribute spec for location ' + i);
	        }
	      }

	      // retire unused buffers
	      for (var j = 0; j < vao.buffers.length; ++j) {
	        if (!bufUpdated[j] && vao.buffers[j]) {
	          vao.buffers[j].destroy();
	          vao.buffers[j] = null;
	        }
	      }

	      vao.refresh();
	      return updateVAO
	    }

	    updateVAO.destroy = function () {
	      for (var j = 0; j < vao.buffers.length; ++j) {
	        if (vao.buffers[j]) {
	          vao.buffers[j].destroy();
	        }
	      }
	      vao.buffers.length = 0;

	      if (vao.ownsElements) {
	        vao.elements.destroy();
	        vao.elements = null;
	        vao.ownsElements = false;
	      }

	      vao.destroy();
	    };

	    updateVAO._vao = vao;
	    updateVAO._reglType = 'vao';

	    return updateVAO(_attr)
	  }

	  return state
	}

	var GL_FRAGMENT_SHADER = 35632;
	var GL_VERTEX_SHADER = 35633;

	var GL_ACTIVE_UNIFORMS = 0x8B86;
	var GL_ACTIVE_ATTRIBUTES = 0x8B89;

	function wrapShaderState (gl, stringStore, stats, config) {
	  // ===================================================
	  // glsl compilation and linking
	  // ===================================================
	  var fragShaders = {};
	  var vertShaders = {};

	  function ActiveInfo (name, id, location, info) {
	    this.name = name;
	    this.id = id;
	    this.location = location;
	    this.info = info;
	  }

	  function insertActiveInfo (list, info) {
	    for (var i = 0; i < list.length; ++i) {
	      if (list[i].id === info.id) {
	        list[i].location = info.location;
	        return
	      }
	    }
	    list.push(info);
	  }

	  function getShader (type, id, command) {
	    var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
	    var shader = cache[id];

	    if (!shader) {
	      var source = stringStore.str(id);
	      shader = gl.createShader(type);
	      gl.shaderSource(shader, source);
	      gl.compileShader(shader);
	      check$1.shaderError(gl, shader, source, type, command);
	      cache[id] = shader;
	    }

	    return shader
	  }

	  // ===================================================
	  // program linking
	  // ===================================================
	  var programCache = {};
	  var programList = [];

	  var PROGRAM_COUNTER = 0;

	  function REGLProgram (fragId, vertId) {
	    this.id = PROGRAM_COUNTER++;
	    this.fragId = fragId;
	    this.vertId = vertId;
	    this.program = null;
	    this.uniforms = [];
	    this.attributes = [];
	    this.refCount = 1;

	    if (config.profile) {
	      this.stats = {
	        uniformsCount: 0,
	        attributesCount: 0
	      };
	    }
	  }

	  function linkProgram (desc, command, attributeLocations) {
	    var i, info;

	    // -------------------------------
	    // compile & link
	    // -------------------------------
	    var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
	    var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

	    var program = desc.program = gl.createProgram();
	    gl.attachShader(program, fragShader);
	    gl.attachShader(program, vertShader);
	    if (attributeLocations) {
	      for (i = 0; i < attributeLocations.length; ++i) {
	        var binding = attributeLocations[i];
	        gl.bindAttribLocation(program, binding[0], binding[1]);
	      }
	    }

	    gl.linkProgram(program);
	    check$1.linkError(
	      gl,
	      program,
	      stringStore.str(desc.fragId),
	      stringStore.str(desc.vertId),
	      command);

	    // -------------------------------
	    // grab uniforms
	    // -------------------------------
	    var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
	    if (config.profile) {
	      desc.stats.uniformsCount = numUniforms;
	    }
	    var uniforms = desc.uniforms;
	    for (i = 0; i < numUniforms; ++i) {
	      info = gl.getActiveUniform(program, i);
	      if (info) {
	        if (info.size > 1) {
	          for (var j = 0; j < info.size; ++j) {
	            var name = info.name.replace('[0]', '[' + j + ']');
	            insertActiveInfo(uniforms, new ActiveInfo(
	              name,
	              stringStore.id(name),
	              gl.getUniformLocation(program, name),
	              info));
	          }
	        }
	        var uniName = info.name;
	        if (info.size > 1) {
	          uniName = uniName.replace('[0]', '');
	        }
	        insertActiveInfo(uniforms, new ActiveInfo(
	          uniName,
	          stringStore.id(uniName),
	          gl.getUniformLocation(program, uniName),
	          info));
	      }
	    }

	    // -------------------------------
	    // grab attributes
	    // -------------------------------
	    var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
	    if (config.profile) {
	      desc.stats.attributesCount = numAttributes;
	    }

	    var attributes = desc.attributes;
	    for (i = 0; i < numAttributes; ++i) {
	      info = gl.getActiveAttrib(program, i);
	      if (info) {
	        insertActiveInfo(attributes, new ActiveInfo(
	          info.name,
	          stringStore.id(info.name),
	          gl.getAttribLocation(program, info.name),
	          info));
	      }
	    }
	  }

	  if (config.profile) {
	    stats.getMaxUniformsCount = function () {
	      var m = 0;
	      programList.forEach(function (desc) {
	        if (desc.stats.uniformsCount > m) {
	          m = desc.stats.uniformsCount;
	        }
	      });
	      return m
	    };

	    stats.getMaxAttributesCount = function () {
	      var m = 0;
	      programList.forEach(function (desc) {
	        if (desc.stats.attributesCount > m) {
	          m = desc.stats.attributesCount;
	        }
	      });
	      return m
	    };
	  }

	  function restoreShaders () {
	    fragShaders = {};
	    vertShaders = {};
	    for (var i = 0; i < programList.length; ++i) {
	      linkProgram(programList[i], null, programList[i].attributes.map(function (info) {
	        return [info.location, info.name]
	      }));
	    }
	  }

	  return {
	    clear: function () {
	      var deleteShader = gl.deleteShader.bind(gl);
	      values(fragShaders).forEach(deleteShader);
	      fragShaders = {};
	      values(vertShaders).forEach(deleteShader);
	      vertShaders = {};

	      programList.forEach(function (desc) {
	        gl.deleteProgram(desc.program);
	      });
	      programList.length = 0;
	      programCache = {};

	      stats.shaderCount = 0;
	    },

	    program: function (vertId, fragId, command, attribLocations) {
	      check$1.command(vertId >= 0, 'missing vertex shader', command);
	      check$1.command(fragId >= 0, 'missing fragment shader', command);

	      var cache = programCache[fragId];
	      if (!cache) {
	        cache = programCache[fragId] = {};
	      }
	      var prevProgram = cache[vertId];
	      if (prevProgram) {
	        prevProgram.refCount++;
	        if (!attribLocations) {
	          return prevProgram
	        }
	      }
	      var program = new REGLProgram(fragId, vertId);
	      stats.shaderCount++;
	      linkProgram(program, command, attribLocations);
	      if (!prevProgram) {
	        cache[vertId] = program;
	      }
	      programList.push(program);
	      return extend(program, {
	        destroy: function () {
	          program.refCount--;
	          if (program.refCount <= 0) {
	            gl.deleteProgram(program.program);
	            var idx = programList.indexOf(program);
	            programList.splice(idx, 1);
	            stats.shaderCount--;
	          }
	          // no program is linked to this vert anymore
	          if (cache[program.vertId].refCount <= 0) {
	            gl.deleteShader(vertShaders[program.vertId]);
	            delete vertShaders[program.vertId];
	            delete programCache[program.fragId][program.vertId];
	          }
	          // no program is linked to this frag anymore
	          if (!Object.keys(programCache[program.fragId]).length) {
	            gl.deleteShader(fragShaders[program.fragId]);
	            delete fragShaders[program.fragId];
	            delete programCache[program.fragId];
	          }
	        }
	      })
	    },

	    restore: restoreShaders,

	    shader: getShader,

	    frag: -1,
	    vert: -1
	  }
	}

	var GL_RGBA$3 = 6408;
	var GL_UNSIGNED_BYTE$7 = 5121;
	var GL_PACK_ALIGNMENT = 0x0D05;
	var GL_FLOAT$7 = 0x1406; // 5126

	function wrapReadPixels (
	  gl,
	  framebufferState,
	  reglPoll,
	  context,
	  glAttributes,
	  extensions,
	  limits) {
	  function readPixelsImpl (input) {
	    var type;
	    if (framebufferState.next === null) {
	      check$1(
	        glAttributes.preserveDrawingBuffer,
	        'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
	      type = GL_UNSIGNED_BYTE$7;
	    } else {
	      check$1(
	        framebufferState.next.colorAttachments[0].texture !== null,
	        'You cannot read from a renderbuffer');
	      type = framebufferState.next.colorAttachments[0].texture._texture.type;

	      check$1.optional(function () {
	        if (extensions.oes_texture_float) {
	          check$1(
	            type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
	            'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');

	          if (type === GL_FLOAT$7) {
	            check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
	          }
	        } else {
	          check$1(
	            type === GL_UNSIGNED_BYTE$7,
	            'Reading from a framebuffer is only allowed for the type \'uint8\'');
	        }
	      });
	    }

	    var x = 0;
	    var y = 0;
	    var width = context.framebufferWidth;
	    var height = context.framebufferHeight;
	    var data = null;

	    if (isTypedArray(input)) {
	      data = input;
	    } else if (input) {
	      check$1.type(input, 'object', 'invalid arguments to regl.read()');
	      x = input.x | 0;
	      y = input.y | 0;
	      check$1(
	        x >= 0 && x < context.framebufferWidth,
	        'invalid x offset for regl.read');
	      check$1(
	        y >= 0 && y < context.framebufferHeight,
	        'invalid y offset for regl.read');
	      width = (input.width || (context.framebufferWidth - x)) | 0;
	      height = (input.height || (context.framebufferHeight - y)) | 0;
	      data = input.data || null;
	    }

	    // sanity check input.data
	    if (data) {
	      if (type === GL_UNSIGNED_BYTE$7) {
	        check$1(
	          data instanceof Uint8Array,
	          'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
	      } else if (type === GL_FLOAT$7) {
	        check$1(
	          data instanceof Float32Array,
	          'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
	      }
	    }

	    check$1(
	      width > 0 && width + x <= context.framebufferWidth,
	      'invalid width for read pixels');
	    check$1(
	      height > 0 && height + y <= context.framebufferHeight,
	      'invalid height for read pixels');

	    // Update WebGL state
	    reglPoll();

	    // Compute size
	    var size = width * height * 4;

	    // Allocate data
	    if (!data) {
	      if (type === GL_UNSIGNED_BYTE$7) {
	        data = new Uint8Array(size);
	      } else if (type === GL_FLOAT$7) {
	        data = data || new Float32Array(size);
	      }
	    }

	    // Type check
	    check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
	    check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

	    // Run read pixels
	    gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
	    gl.readPixels(x, y, width, height, GL_RGBA$3,
	      type,
	      data);

	    return data
	  }

	  function readPixelsFBO (options) {
	    var result;
	    framebufferState.setFBO({
	      framebuffer: options.framebuffer
	    }, function () {
	      result = readPixelsImpl(options);
	    });
	    return result
	  }

	  function readPixels (options) {
	    if (!options || !('framebuffer' in options)) {
	      return readPixelsImpl(options)
	    } else {
	      return readPixelsFBO(options)
	    }
	  }

	  return readPixels
	}

	function slice (x) {
	  return Array.prototype.slice.call(x)
	}

	function join (x) {
	  return slice(x).join('')
	}

	function createEnvironment () {
	  // Unique variable id counter
	  var varCounter = 0;

	  // Linked values are passed from this scope into the generated code block
	  // Calling link() passes a value into the generated scope and returns
	  // the variable name which it is bound to
	  var linkedNames = [];
	  var linkedValues = [];
	  function link (value) {
	    for (var i = 0; i < linkedValues.length; ++i) {
	      if (linkedValues[i] === value) {
	        return linkedNames[i]
	      }
	    }

	    var name = 'g' + (varCounter++);
	    linkedNames.push(name);
	    linkedValues.push(value);
	    return name
	  }

	  // create a code block
	  function block () {
	    var code = [];
	    function push () {
	      code.push.apply(code, slice(arguments));
	    }

	    var vars = [];
	    function def () {
	      var name = 'v' + (varCounter++);
	      vars.push(name);

	      if (arguments.length > 0) {
	        code.push(name, '=');
	        code.push.apply(code, slice(arguments));
	        code.push(';');
	      }

	      return name
	    }

	    return extend(push, {
	      def: def,
	      toString: function () {
	        return join([
	          (vars.length > 0 ? 'var ' + vars.join(',') + ';' : ''),
	          join(code)
	        ])
	      }
	    })
	  }

	  function scope () {
	    var entry = block();
	    var exit = block();

	    var entryToString = entry.toString;
	    var exitToString = exit.toString;

	    function save (object, prop) {
	      exit(object, prop, '=', entry.def(object, prop), ';');
	    }

	    return extend(function () {
	      entry.apply(entry, slice(arguments));
	    }, {
	      def: entry.def,
	      entry: entry,
	      exit: exit,
	      save: save,
	      set: function (object, prop, value) {
	        save(object, prop);
	        entry(object, prop, '=', value, ';');
	      },
	      toString: function () {
	        return entryToString() + exitToString()
	      }
	    })
	  }

	  function conditional () {
	    var pred = join(arguments);
	    var thenBlock = scope();
	    var elseBlock = scope();

	    var thenToString = thenBlock.toString;
	    var elseToString = elseBlock.toString;

	    return extend(thenBlock, {
	      then: function () {
	        thenBlock.apply(thenBlock, slice(arguments));
	        return this
	      },
	      else: function () {
	        elseBlock.apply(elseBlock, slice(arguments));
	        return this
	      },
	      toString: function () {
	        var elseClause = elseToString();
	        if (elseClause) {
	          elseClause = 'else{' + elseClause + '}';
	        }
	        return join([
	          'if(', pred, '){',
	          thenToString(),
	          '}', elseClause
	        ])
	      }
	    })
	  }

	  // procedure list
	  var globalBlock = block();
	  var procedures = {};
	  function proc (name, count) {
	    var args = [];
	    function arg () {
	      var name = 'a' + args.length;
	      args.push(name);
	      return name
	    }

	    count = count || 0;
	    for (var i = 0; i < count; ++i) {
	      arg();
	    }

	    var body = scope();
	    var bodyToString = body.toString;

	    var result = procedures[name] = extend(body, {
	      arg: arg,
	      toString: function () {
	        return join([
	          'function(', args.join(), '){',
	          bodyToString(),
	          '}'
	        ])
	      }
	    });

	    return result
	  }

	  function compile () {
	    var code = ['"use strict";',
	      globalBlock,
	      'return {'];
	    Object.keys(procedures).forEach(function (name) {
	      code.push('"', name, '":', procedures[name].toString(), ',');
	    });
	    code.push('}');
	    var src = join(code)
	      .replace(/;/g, ';\n')
	      .replace(/}/g, '}\n')
	      .replace(/{/g, '{\n');
	    var proc = Function.apply(null, linkedNames.concat(src));
	    return proc.apply(null, linkedValues)
	  }

	  return {
	    global: globalBlock,
	    link: link,
	    block: block,
	    proc: proc,
	    scope: scope,
	    cond: conditional,
	    compile: compile
	  }
	}

	// "cute" names for vector components
	var CUTE_COMPONENTS = 'xyzw'.split('');

	var GL_UNSIGNED_BYTE$8 = 5121;

	var ATTRIB_STATE_POINTER = 1;
	var ATTRIB_STATE_CONSTANT = 2;

	var DYN_FUNC$1 = 0;
	var DYN_PROP$1 = 1;
	var DYN_CONTEXT$1 = 2;
	var DYN_STATE$1 = 3;
	var DYN_THUNK = 4;
	var DYN_CONSTANT$1 = 5;
	var DYN_ARRAY$1 = 6;

	var S_DITHER = 'dither';
	var S_BLEND_ENABLE = 'blend.enable';
	var S_BLEND_COLOR = 'blend.color';
	var S_BLEND_EQUATION = 'blend.equation';
	var S_BLEND_FUNC = 'blend.func';
	var S_DEPTH_ENABLE = 'depth.enable';
	var S_DEPTH_FUNC = 'depth.func';
	var S_DEPTH_RANGE = 'depth.range';
	var S_DEPTH_MASK = 'depth.mask';
	var S_COLOR_MASK = 'colorMask';
	var S_CULL_ENABLE = 'cull.enable';
	var S_CULL_FACE = 'cull.face';
	var S_FRONT_FACE = 'frontFace';
	var S_LINE_WIDTH = 'lineWidth';
	var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
	var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
	var S_SAMPLE_ALPHA = 'sample.alpha';
	var S_SAMPLE_ENABLE = 'sample.enable';
	var S_SAMPLE_COVERAGE = 'sample.coverage';
	var S_STENCIL_ENABLE = 'stencil.enable';
	var S_STENCIL_MASK = 'stencil.mask';
	var S_STENCIL_FUNC = 'stencil.func';
	var S_STENCIL_OPFRONT = 'stencil.opFront';
	var S_STENCIL_OPBACK = 'stencil.opBack';
	var S_SCISSOR_ENABLE = 'scissor.enable';
	var S_SCISSOR_BOX = 'scissor.box';
	var S_VIEWPORT = 'viewport';

	var S_PROFILE = 'profile';

	var S_FRAMEBUFFER = 'framebuffer';
	var S_VERT = 'vert';
	var S_FRAG = 'frag';
	var S_ELEMENTS = 'elements';
	var S_PRIMITIVE = 'primitive';
	var S_COUNT = 'count';
	var S_OFFSET = 'offset';
	var S_INSTANCES = 'instances';
	var S_VAO = 'vao';

	var SUFFIX_WIDTH = 'Width';
	var SUFFIX_HEIGHT = 'Height';

	var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
	var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
	var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
	var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
	var S_DRAWINGBUFFER = 'drawingBuffer';
	var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
	var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

	var NESTED_OPTIONS = [
	  S_BLEND_FUNC,
	  S_BLEND_EQUATION,
	  S_STENCIL_FUNC,
	  S_STENCIL_OPFRONT,
	  S_STENCIL_OPBACK,
	  S_SAMPLE_COVERAGE,
	  S_VIEWPORT,
	  S_SCISSOR_BOX,
	  S_POLYGON_OFFSET_OFFSET
	];

	var GL_ARRAY_BUFFER$2 = 34962;
	var GL_ELEMENT_ARRAY_BUFFER$2 = 34963;

	var GL_FRAGMENT_SHADER$1 = 35632;
	var GL_VERTEX_SHADER$1 = 35633;

	var GL_TEXTURE_2D$3 = 0x0DE1;
	var GL_TEXTURE_CUBE_MAP$2 = 0x8513;

	var GL_CULL_FACE = 0x0B44;
	var GL_BLEND = 0x0BE2;
	var GL_DITHER = 0x0BD0;
	var GL_STENCIL_TEST = 0x0B90;
	var GL_DEPTH_TEST = 0x0B71;
	var GL_SCISSOR_TEST = 0x0C11;
	var GL_POLYGON_OFFSET_FILL = 0x8037;
	var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
	var GL_SAMPLE_COVERAGE = 0x80A0;

	var GL_FLOAT$8 = 5126;
	var GL_FLOAT_VEC2 = 35664;
	var GL_FLOAT_VEC3 = 35665;
	var GL_FLOAT_VEC4 = 35666;
	var GL_INT$3 = 5124;
	var GL_INT_VEC2 = 35667;
	var GL_INT_VEC3 = 35668;
	var GL_INT_VEC4 = 35669;
	var GL_BOOL = 35670;
	var GL_BOOL_VEC2 = 35671;
	var GL_BOOL_VEC3 = 35672;
	var GL_BOOL_VEC4 = 35673;
	var GL_FLOAT_MAT2 = 35674;
	var GL_FLOAT_MAT3 = 35675;
	var GL_FLOAT_MAT4 = 35676;
	var GL_SAMPLER_2D = 35678;
	var GL_SAMPLER_CUBE = 35680;

	var GL_TRIANGLES$1 = 4;

	var GL_FRONT = 1028;
	var GL_BACK = 1029;
	var GL_CW = 0x0900;
	var GL_CCW = 0x0901;
	var GL_MIN_EXT = 0x8007;
	var GL_MAX_EXT = 0x8008;
	var GL_ALWAYS = 519;
	var GL_KEEP = 7680;
	var GL_ZERO = 0;
	var GL_ONE = 1;
	var GL_FUNC_ADD = 0x8006;
	var GL_LESS = 513;

	var GL_FRAMEBUFFER$2 = 0x8D40;
	var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

	var blendFuncs = {
	  '0': 0,
	  '1': 1,
	  'zero': 0,
	  'one': 1,
	  'src color': 768,
	  'one minus src color': 769,
	  'src alpha': 770,
	  'one minus src alpha': 771,
	  'dst color': 774,
	  'one minus dst color': 775,
	  'dst alpha': 772,
	  'one minus dst alpha': 773,
	  'constant color': 32769,
	  'one minus constant color': 32770,
	  'constant alpha': 32771,
	  'one minus constant alpha': 32772,
	  'src alpha saturate': 776
	};

	// There are invalid values for srcRGB and dstRGB. See:
	// https://www.khronos.org/registry/webgl/specs/1.0/#6.13
	// https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
	var invalidBlendCombinations = [
	  'constant color, constant alpha',
	  'one minus constant color, constant alpha',
	  'constant color, one minus constant alpha',
	  'one minus constant color, one minus constant alpha',
	  'constant alpha, constant color',
	  'constant alpha, one minus constant color',
	  'one minus constant alpha, constant color',
	  'one minus constant alpha, one minus constant color'
	];

	var compareFuncs = {
	  'never': 512,
	  'less': 513,
	  '<': 513,
	  'equal': 514,
	  '=': 514,
	  '==': 514,
	  '===': 514,
	  'lequal': 515,
	  '<=': 515,
	  'greater': 516,
	  '>': 516,
	  'notequal': 517,
	  '!=': 517,
	  '!==': 517,
	  'gequal': 518,
	  '>=': 518,
	  'always': 519
	};

	var stencilOps = {
	  '0': 0,
	  'zero': 0,
	  'keep': 7680,
	  'replace': 7681,
	  'increment': 7682,
	  'decrement': 7683,
	  'increment wrap': 34055,
	  'decrement wrap': 34056,
	  'invert': 5386
	};

	var shaderType = {
	  'frag': GL_FRAGMENT_SHADER$1,
	  'vert': GL_VERTEX_SHADER$1
	};

	var orientationType = {
	  'cw': GL_CW,
	  'ccw': GL_CCW
	};

	function isBufferArgs (x) {
	  return Array.isArray(x) ||
	    isTypedArray(x) ||
	    isNDArrayLike(x)
	}

	// Make sure viewport is processed first
	function sortState (state) {
	  return state.sort(function (a, b) {
	    if (a === S_VIEWPORT) {
	      return -1
	    } else if (b === S_VIEWPORT) {
	      return 1
	    }
	    return (a < b) ? -1 : 1
	  })
	}

	function Declaration (thisDep, contextDep, propDep, append) {
	  this.thisDep = thisDep;
	  this.contextDep = contextDep;
	  this.propDep = propDep;
	  this.append = append;
	}

	function isStatic (decl) {
	  return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
	}

	function createStaticDecl (append) {
	  return new Declaration(false, false, false, append)
	}

	function createDynamicDecl (dyn, append) {
	  var type = dyn.type;
	  if (type === DYN_FUNC$1) {
	    var numArgs = dyn.data.length;
	    return new Declaration(
	      true,
	      numArgs >= 1,
	      numArgs >= 2,
	      append)
	  } else if (type === DYN_THUNK) {
	    var data = dyn.data;
	    return new Declaration(
	      data.thisDep,
	      data.contextDep,
	      data.propDep,
	      append)
	  } else if (type === DYN_CONSTANT$1) {
	    return new Declaration(
	      false,
	      false,
	      false,
	      append)
	  } else if (type === DYN_ARRAY$1) {
	    var thisDep = false;
	    var contextDep = false;
	    var propDep = false;
	    for (var i = 0; i < dyn.data.length; ++i) {
	      var subDyn = dyn.data[i];
	      if (subDyn.type === DYN_PROP$1) {
	        propDep = true;
	      } else if (subDyn.type === DYN_CONTEXT$1) {
	        contextDep = true;
	      } else if (subDyn.type === DYN_STATE$1) {
	        thisDep = true;
	      } else if (subDyn.type === DYN_FUNC$1) {
	        thisDep = true;
	        var subArgs = subDyn.data;
	        if (subArgs >= 1) {
	          contextDep = true;
	        }
	        if (subArgs >= 2) {
	          propDep = true;
	        }
	      } else if (subDyn.type === DYN_THUNK) {
	        thisDep = thisDep || subDyn.data.thisDep;
	        contextDep = contextDep || subDyn.data.contextDep;
	        propDep = propDep || subDyn.data.propDep;
	      }
	    }
	    return new Declaration(
	      thisDep,
	      contextDep,
	      propDep,
	      append)
	  } else {
	    return new Declaration(
	      type === DYN_STATE$1,
	      type === DYN_CONTEXT$1,
	      type === DYN_PROP$1,
	      append)
	  }
	}

	var SCOPE_DECL = new Declaration(false, false, false, function () {});

	function reglCore (
	  gl,
	  stringStore,
	  extensions,
	  limits,
	  bufferState,
	  elementState,
	  textureState,
	  framebufferState,
	  uniformState,
	  attributeState,
	  shaderState,
	  drawState,
	  contextState,
	  timer,
	  config) {
	  var AttributeRecord = attributeState.Record;

	  var blendEquations = {
	    'add': 32774,
	    'subtract': 32778,
	    'reverse subtract': 32779
	  };
	  if (extensions.ext_blend_minmax) {
	    blendEquations.min = GL_MIN_EXT;
	    blendEquations.max = GL_MAX_EXT;
	  }

	  var extInstancing = extensions.angle_instanced_arrays;
	  var extDrawBuffers = extensions.webgl_draw_buffers;
	  var extVertexArrays = extensions.oes_vertex_array_object;

	  // ===================================================
	  // ===================================================
	  // WEBGL STATE
	  // ===================================================
	  // ===================================================
	  var currentState = {
	    dirty: true,
	    profile: config.profile
	  };
	  var nextState = {};
	  var GL_STATE_NAMES = [];
	  var GL_FLAGS = {};
	  var GL_VARIABLES = {};

	  function propName (name) {
	    return name.replace('.', '_')
	  }

	  function stateFlag (sname, cap, init) {
	    var name = propName(sname);
	    GL_STATE_NAMES.push(sname);
	    nextState[name] = currentState[name] = !!init;
	    GL_FLAGS[name] = cap;
	  }

	  function stateVariable (sname, func, init) {
	    var name = propName(sname);
	    GL_STATE_NAMES.push(sname);
	    if (Array.isArray(init)) {
	      currentState[name] = init.slice();
	      nextState[name] = init.slice();
	    } else {
	      currentState[name] = nextState[name] = init;
	    }
	    GL_VARIABLES[name] = func;
	  }

	  // Dithering
	  stateFlag(S_DITHER, GL_DITHER);

	  // Blending
	  stateFlag(S_BLEND_ENABLE, GL_BLEND);
	  stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
	  stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
	    [GL_FUNC_ADD, GL_FUNC_ADD]);
	  stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
	    [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

	  // Depth
	  stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
	  stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
	  stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
	  stateVariable(S_DEPTH_MASK, 'depthMask', true);

	  // Color mask
	  stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

	  // Face culling
	  stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
	  stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

	  // Front face orientation
	  stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

	  // Line width
	  stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

	  // Polygon offset
	  stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
	  stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

	  // Sample coverage
	  stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
	  stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
	  stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

	  // Stencil
	  stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
	  stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
	  stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
	  stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
	    [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
	  stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
	    [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

	  // Scissor
	  stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
	  stateVariable(S_SCISSOR_BOX, 'scissor',
	    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

	  // Viewport
	  stateVariable(S_VIEWPORT, S_VIEWPORT,
	    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

	  // ===================================================
	  // ===================================================
	  // ENVIRONMENT
	  // ===================================================
	  // ===================================================
	  var sharedState = {
	    gl: gl,
	    context: contextState,
	    strings: stringStore,
	    next: nextState,
	    current: currentState,
	    draw: drawState,
	    elements: elementState,
	    buffer: bufferState,
	    shader: shaderState,
	    attributes: attributeState.state,
	    vao: attributeState,
	    uniforms: uniformState,
	    framebuffer: framebufferState,
	    extensions: extensions,

	    timer: timer,
	    isBufferArgs: isBufferArgs
	  };

	  var sharedConstants = {
	    primTypes: primTypes,
	    compareFuncs: compareFuncs,
	    blendFuncs: blendFuncs,
	    blendEquations: blendEquations,
	    stencilOps: stencilOps,
	    glTypes: glTypes,
	    orientationType: orientationType
	  };

	  check$1.optional(function () {
	    sharedState.isArrayLike = isArrayLike;
	  });

	  if (extDrawBuffers) {
	    sharedConstants.backBuffer = [GL_BACK];
	    sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
	      if (i === 0) {
	        return [0]
	      }
	      return loop(i, function (j) {
	        return GL_COLOR_ATTACHMENT0$2 + j
	      })
	    });
	  }

	  var drawCallCounter = 0;
	  function createREGLEnvironment () {
	    var env = createEnvironment();
	    var link = env.link;
	    var global = env.global;
	    env.id = drawCallCounter++;

	    env.batchId = '0';

	    // link shared state
	    var SHARED = link(sharedState);
	    var shared = env.shared = {
	      props: 'a0'
	    };
	    Object.keys(sharedState).forEach(function (prop) {
	      shared[prop] = global.def(SHARED, '.', prop);
	    });

	    // Inject runtime assertion stuff for debug builds
	    check$1.optional(function () {
	      env.CHECK = link(check$1);
	      env.commandStr = check$1.guessCommand();
	      env.command = link(env.commandStr);
	      env.assert = function (block, pred, message) {
	        block(
	          'if(!(', pred, '))',
	          this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
	      };

	      sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
	    });

	    // Copy GL state variables over
	    var nextVars = env.next = {};
	    var currentVars = env.current = {};
	    Object.keys(GL_VARIABLES).forEach(function (variable) {
	      if (Array.isArray(currentState[variable])) {
	        nextVars[variable] = global.def(shared.next, '.', variable);
	        currentVars[variable] = global.def(shared.current, '.', variable);
	      }
	    });

	    // Initialize shared constants
	    var constants = env.constants = {};
	    Object.keys(sharedConstants).forEach(function (name) {
	      constants[name] = global.def(JSON.stringify(sharedConstants[name]));
	    });

	    // Helper function for calling a block
	    env.invoke = function (block, x) {
	      switch (x.type) {
	        case DYN_FUNC$1:
	          var argList = [
	            'this',
	            shared.context,
	            shared.props,
	            env.batchId
	          ];
	          return block.def(
	            link(x.data), '.call(',
	            argList.slice(0, Math.max(x.data.length + 1, 4)),
	            ')')
	        case DYN_PROP$1:
	          return block.def(shared.props, x.data)
	        case DYN_CONTEXT$1:
	          return block.def(shared.context, x.data)
	        case DYN_STATE$1:
	          return block.def('this', x.data)
	        case DYN_THUNK:
	          x.data.append(env, block);
	          return x.data.ref
	        case DYN_CONSTANT$1:
	          return x.data.toString()
	        case DYN_ARRAY$1:
	          return x.data.map(function (y) {
	            return env.invoke(block, y)
	          })
	      }
	    };

	    env.attribCache = {};

	    var scopeAttribs = {};
	    env.scopeAttrib = function (name) {
	      var id = stringStore.id(name);
	      if (id in scopeAttribs) {
	        return scopeAttribs[id]
	      }
	      var binding = attributeState.scope[id];
	      if (!binding) {
	        binding = attributeState.scope[id] = new AttributeRecord();
	      }
	      var result = scopeAttribs[id] = link(binding);
	      return result
	    };

	    return env
	  }

	  // ===================================================
	  // ===================================================
	  // PARSING
	  // ===================================================
	  // ===================================================
	  function parseProfile (options) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    var profileEnable;
	    if (S_PROFILE in staticOptions) {
	      var value = !!staticOptions[S_PROFILE];
	      profileEnable = createStaticDecl(function (env, scope) {
	        return value
	      });
	      profileEnable.enable = value;
	    } else if (S_PROFILE in dynamicOptions) {
	      var dyn = dynamicOptions[S_PROFILE];
	      profileEnable = createDynamicDecl(dyn, function (env, scope) {
	        return env.invoke(scope, dyn)
	      });
	    }

	    return profileEnable
	  }

	  function parseFramebuffer (options, env) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    if (S_FRAMEBUFFER in staticOptions) {
	      var framebuffer = staticOptions[S_FRAMEBUFFER];
	      if (framebuffer) {
	        framebuffer = framebufferState.getFramebuffer(framebuffer);
	        check$1.command(framebuffer, 'invalid framebuffer object');
	        return createStaticDecl(function (env, block) {
	          var FRAMEBUFFER = env.link(framebuffer);
	          var shared = env.shared;
	          block.set(
	            shared.framebuffer,
	            '.next',
	            FRAMEBUFFER);
	          var CONTEXT = shared.context;
	          block.set(
	            CONTEXT,
	            '.' + S_FRAMEBUFFER_WIDTH,
	            FRAMEBUFFER + '.width');
	          block.set(
	            CONTEXT,
	            '.' + S_FRAMEBUFFER_HEIGHT,
	            FRAMEBUFFER + '.height');
	          return FRAMEBUFFER
	        })
	      } else {
	        return createStaticDecl(function (env, scope) {
	          var shared = env.shared;
	          scope.set(
	            shared.framebuffer,
	            '.next',
	            'null');
	          var CONTEXT = shared.context;
	          scope.set(
	            CONTEXT,
	            '.' + S_FRAMEBUFFER_WIDTH,
	            CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
	          scope.set(
	            CONTEXT,
	            '.' + S_FRAMEBUFFER_HEIGHT,
	            CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
	          return 'null'
	        })
	      }
	    } else if (S_FRAMEBUFFER in dynamicOptions) {
	      var dyn = dynamicOptions[S_FRAMEBUFFER];
	      return createDynamicDecl(dyn, function (env, scope) {
	        var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
	        var shared = env.shared;
	        var FRAMEBUFFER_STATE = shared.framebuffer;
	        var FRAMEBUFFER = scope.def(
	          FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

	        check$1.optional(function () {
	          env.assert(scope,
	            '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
	            'invalid framebuffer object');
	        });

	        scope.set(
	          FRAMEBUFFER_STATE,
	          '.next',
	          FRAMEBUFFER);
	        var CONTEXT = shared.context;
	        scope.set(
	          CONTEXT,
	          '.' + S_FRAMEBUFFER_WIDTH,
	          FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
	          CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
	        scope.set(
	          CONTEXT,
	          '.' + S_FRAMEBUFFER_HEIGHT,
	          FRAMEBUFFER +
	          '?' + FRAMEBUFFER + '.height:' +
	          CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
	        return FRAMEBUFFER
	      })
	    } else {
	      return null
	    }
	  }

	  function parseViewportScissor (options, framebuffer, env) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    function parseBox (param) {
	      if (param in staticOptions) {
	        var box = staticOptions[param];
	        check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

	        var isStatic = true;
	        var x = box.x | 0;
	        var y = box.y | 0;
	        var w, h;
	        if ('width' in box) {
	          w = box.width | 0;
	          check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
	        } else {
	          isStatic = false;
	        }
	        if ('height' in box) {
	          h = box.height | 0;
	          check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
	        } else {
	          isStatic = false;
	        }

	        return new Declaration(
	          !isStatic && framebuffer && framebuffer.thisDep,
	          !isStatic && framebuffer && framebuffer.contextDep,
	          !isStatic && framebuffer && framebuffer.propDep,
	          function (env, scope) {
	            var CONTEXT = env.shared.context;
	            var BOX_W = w;
	            if (!('width' in box)) {
	              BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
	            }
	            var BOX_H = h;
	            if (!('height' in box)) {
	              BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
	            }
	            return [x, y, BOX_W, BOX_H]
	          })
	      } else if (param in dynamicOptions) {
	        var dynBox = dynamicOptions[param];
	        var result = createDynamicDecl(dynBox, function (env, scope) {
	          var BOX = env.invoke(scope, dynBox);

	          check$1.optional(function () {
	            env.assert(scope,
	              BOX + '&&typeof ' + BOX + '==="object"',
	              'invalid ' + param);
	          });

	          var CONTEXT = env.shared.context;
	          var BOX_X = scope.def(BOX, '.x|0');
	          var BOX_Y = scope.def(BOX, '.y|0');
	          var BOX_W = scope.def(
	            '"width" in ', BOX, '?', BOX, '.width|0:',
	            '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
	          var BOX_H = scope.def(
	            '"height" in ', BOX, '?', BOX, '.height|0:',
	            '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

	          check$1.optional(function () {
	            env.assert(scope,
	              BOX_W + '>=0&&' +
	              BOX_H + '>=0',
	              'invalid ' + param);
	          });

	          return [BOX_X, BOX_Y, BOX_W, BOX_H]
	        });
	        if (framebuffer) {
	          result.thisDep = result.thisDep || framebuffer.thisDep;
	          result.contextDep = result.contextDep || framebuffer.contextDep;
	          result.propDep = result.propDep || framebuffer.propDep;
	        }
	        return result
	      } else if (framebuffer) {
	        return new Declaration(
	          framebuffer.thisDep,
	          framebuffer.contextDep,
	          framebuffer.propDep,
	          function (env, scope) {
	            var CONTEXT = env.shared.context;
	            return [
	              0, 0,
	              scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
	              scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
	          })
	      } else {
	        return null
	      }
	    }

	    var viewport = parseBox(S_VIEWPORT);

	    if (viewport) {
	      var prevViewport = viewport;
	      viewport = new Declaration(
	        viewport.thisDep,
	        viewport.contextDep,
	        viewport.propDep,
	        function (env, scope) {
	          var VIEWPORT = prevViewport.append(env, scope);
	          var CONTEXT = env.shared.context;
	          scope.set(
	            CONTEXT,
	            '.' + S_VIEWPORT_WIDTH,
	            VIEWPORT[2]);
	          scope.set(
	            CONTEXT,
	            '.' + S_VIEWPORT_HEIGHT,
	            VIEWPORT[3]);
	          return VIEWPORT
	        });
	    }

	    return {
	      viewport: viewport,
	      scissor_box: parseBox(S_SCISSOR_BOX)
	    }
	  }

	  function parseAttribLocations (options, attributes) {
	    var staticOptions = options.static;
	    var staticProgram =
	      typeof staticOptions[S_FRAG] === 'string' &&
	      typeof staticOptions[S_VERT] === 'string';
	    if (staticProgram) {
	      if (Object.keys(attributes.dynamic).length > 0) {
	        return null
	      }
	      var staticAttributes = attributes.static;
	      var sAttributes = Object.keys(staticAttributes);
	      if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === 'number') {
	        var bindings = [];
	        for (var i = 0; i < sAttributes.length; ++i) {
	          check$1(typeof staticAttributes[sAttributes[i]] === 'number', 'must specify all vertex attribute locations when using vaos');
	          bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
	        }
	        return bindings
	      }
	    }
	    return null
	  }

	  function parseProgram (options, env, attribLocations) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    function parseShader (name) {
	      if (name in staticOptions) {
	        var id = stringStore.id(staticOptions[name]);
	        check$1.optional(function () {
	          shaderState.shader(shaderType[name], id, check$1.guessCommand());
	        });
	        var result = createStaticDecl(function () {
	          return id
	        });
	        result.id = id;
	        return result
	      } else if (name in dynamicOptions) {
	        var dyn = dynamicOptions[name];
	        return createDynamicDecl(dyn, function (env, scope) {
	          var str = env.invoke(scope, dyn);
	          var id = scope.def(env.shared.strings, '.id(', str, ')');
	          check$1.optional(function () {
	            scope(
	              env.shared.shader, '.shader(',
	              shaderType[name], ',',
	              id, ',',
	              env.command, ');');
	          });
	          return id
	        })
	      }
	      return null
	    }

	    var frag = parseShader(S_FRAG);
	    var vert = parseShader(S_VERT);

	    var program = null;
	    var progVar;
	    if (isStatic(frag) && isStatic(vert)) {
	      program = shaderState.program(vert.id, frag.id, null, attribLocations);
	      progVar = createStaticDecl(function (env, scope) {
	        return env.link(program)
	      });
	    } else {
	      progVar = new Declaration(
	        (frag && frag.thisDep) || (vert && vert.thisDep),
	        (frag && frag.contextDep) || (vert && vert.contextDep),
	        (frag && frag.propDep) || (vert && vert.propDep),
	        function (env, scope) {
	          var SHADER_STATE = env.shared.shader;
	          var fragId;
	          if (frag) {
	            fragId = frag.append(env, scope);
	          } else {
	            fragId = scope.def(SHADER_STATE, '.', S_FRAG);
	          }
	          var vertId;
	          if (vert) {
	            vertId = vert.append(env, scope);
	          } else {
	            vertId = scope.def(SHADER_STATE, '.', S_VERT);
	          }
	          var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
	          check$1.optional(function () {
	            progDef += ',' + env.command;
	          });
	          return scope.def(progDef + ')')
	        });
	    }

	    return {
	      frag: frag,
	      vert: vert,
	      progVar: progVar,
	      program: program
	    }
	  }

	  function parseDraw (options, env) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    // TODO: should use VAO to get default values for offset properties
	    // should move vao parse into here and out of the old stuff

	    var staticDraw = {};
	    var vaoActive = false;

	    function parseVAO () {
	      if (S_VAO in staticOptions) {
	        var vao = staticOptions[S_VAO];
	        if (vao !== null && attributeState.getVAO(vao) === null) {
	          vao = attributeState.createVAO(vao);
	        }

	        vaoActive = true;
	        staticDraw.vao = vao;

	        return createStaticDecl(function (env) {
	          var vaoRef = attributeState.getVAO(vao);
	          if (vaoRef) {
	            return env.link(vaoRef)
	          } else {
	            return 'null'
	          }
	        })
	      } else if (S_VAO in dynamicOptions) {
	        vaoActive = true;
	        var dyn = dynamicOptions[S_VAO];
	        return createDynamicDecl(dyn, function (env, scope) {
	          var vaoRef = env.invoke(scope, dyn);
	          return scope.def(env.shared.vao + '.getVAO(' + vaoRef + ')')
	        })
	      }
	      return null
	    }

	    var vao = parseVAO();

	    var elementsActive = false;

	    function parseElements () {
	      if (S_ELEMENTS in staticOptions) {
	        var elements = staticOptions[S_ELEMENTS];
	        staticDraw.elements = elements;
	        if (isBufferArgs(elements)) {
	          var e = staticDraw.elements = elementState.create(elements, true);
	          elements = elementState.getElements(e);
	          elementsActive = true;
	        } else if (elements) {
	          elements = elementState.getElements(elements);
	          elementsActive = true;
	          check$1.command(elements, 'invalid elements', env.commandStr);
	        }

	        var result = createStaticDecl(function (env, scope) {
	          if (elements) {
	            var result = env.link(elements);
	            env.ELEMENTS = result;
	            return result
	          }
	          env.ELEMENTS = null;
	          return null
	        });
	        result.value = elements;
	        return result
	      } else if (S_ELEMENTS in dynamicOptions) {
	        elementsActive = true;

	        var dyn = dynamicOptions[S_ELEMENTS];
	        return createDynamicDecl(dyn, function (env, scope) {
	          var shared = env.shared;

	          var IS_BUFFER_ARGS = shared.isBufferArgs;
	          var ELEMENT_STATE = shared.elements;

	          var elementDefn = env.invoke(scope, dyn);
	          var elements = scope.def('null');
	          var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

	          var ifte = env.cond(elementStream)
	            .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
	            .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

	          check$1.optional(function () {
	            env.assert(ifte.else,
	              '!' + elementDefn + '||' + elements,
	              'invalid elements');
	          });

	          scope.entry(ifte);
	          scope.exit(
	            env.cond(elementStream)
	              .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

	          env.ELEMENTS = elements;

	          return elements
	        })
	      } else if (vaoActive) {
	        return new Declaration(
	          vao.thisDep,
	          vao.contextDep,
	          vao.propDep,
	          function (env, scope) {
	            return scope.def(env.shared.vao + '.currentVAO?' + env.shared.elements + '.getElements(' + env.shared.vao + '.currentVAO.elements):null')
	          })
	      }
	      return null
	    }

	    var elements = parseElements();

	    function parsePrimitive () {
	      if (S_PRIMITIVE in staticOptions) {
	        var primitive = staticOptions[S_PRIMITIVE];
	        staticDraw.primitive = primitive;
	        check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
	        return createStaticDecl(function (env, scope) {
	          return primTypes[primitive]
	        })
	      } else if (S_PRIMITIVE in dynamicOptions) {
	        var dynPrimitive = dynamicOptions[S_PRIMITIVE];
	        return createDynamicDecl(dynPrimitive, function (env, scope) {
	          var PRIM_TYPES = env.constants.primTypes;
	          var prim = env.invoke(scope, dynPrimitive);
	          check$1.optional(function () {
	            env.assert(scope,
	              prim + ' in ' + PRIM_TYPES,
	              'invalid primitive, must be one of ' + Object.keys(primTypes));
	          });
	          return scope.def(PRIM_TYPES, '[', prim, ']')
	        })
	      } else if (elementsActive) {
	        if (isStatic(elements)) {
	          if (elements.value) {
	            return createStaticDecl(function (env, scope) {
	              return scope.def(env.ELEMENTS, '.primType')
	            })
	          } else {
	            return createStaticDecl(function () {
	              return GL_TRIANGLES$1
	            })
	          }
	        } else {
	          return new Declaration(
	            elements.thisDep,
	            elements.contextDep,
	            elements.propDep,
	            function (env, scope) {
	              var elements = env.ELEMENTS;
	              return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
	            })
	        }
	      } else if (vaoActive) {
	        return new Declaration(
	          vao.thisDep,
	          vao.contextDep,
	          vao.propDep,
	          function (env, scope) {
	            return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.primitive:' + GL_TRIANGLES$1)
	          })
	      }
	      return null
	    }

	    function parseParam (param, isOffset) {
	      if (param in staticOptions) {
	        var value = staticOptions[param] | 0;
	        if (isOffset) {
	          staticDraw.offset = value;
	        } else {
	          staticDraw.instances = value;
	        }
	        check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
	        return createStaticDecl(function (env, scope) {
	          if (isOffset) {
	            env.OFFSET = value;
	          }
	          return value
	        })
	      } else if (param in dynamicOptions) {
	        var dynValue = dynamicOptions[param];
	        return createDynamicDecl(dynValue, function (env, scope) {
	          var result = env.invoke(scope, dynValue);
	          if (isOffset) {
	            env.OFFSET = result;
	            check$1.optional(function () {
	              env.assert(scope,
	                result + '>=0',
	                'invalid ' + param);
	            });
	          }
	          return result
	        })
	      } else if (isOffset) {
	        if (elementsActive) {
	          return createStaticDecl(function (env, scope) {
	            env.OFFSET = 0;
	            return 0
	          })
	        } else if (vaoActive) {
	          return new Declaration(
	            vao.thisDep,
	            vao.contextDep,
	            vao.propDep,
	            function (env, scope) {
	              return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.offset:0')
	            })
	        }
	      } else if (vaoActive) {
	        return new Declaration(
	          vao.thisDep,
	          vao.contextDep,
	          vao.propDep,
	          function (env, scope) {
	            return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.instances:-1')
	          })
	      }
	      return null
	    }

	    var OFFSET = parseParam(S_OFFSET, true);

	    function parseVertCount () {
	      if (S_COUNT in staticOptions) {
	        var count = staticOptions[S_COUNT] | 0;
	        staticDraw.count = count;
	        check$1.command(
	          typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
	        return createStaticDecl(function () {
	          return count
	        })
	      } else if (S_COUNT in dynamicOptions) {
	        var dynCount = dynamicOptions[S_COUNT];
	        return createDynamicDecl(dynCount, function (env, scope) {
	          var result = env.invoke(scope, dynCount);
	          check$1.optional(function () {
	            env.assert(scope,
	              'typeof ' + result + '==="number"&&' +
	              result + '>=0&&' +
	              result + '===(' + result + '|0)',
	              'invalid vertex count');
	          });
	          return result
	        })
	      } else if (elementsActive) {
	        if (isStatic(elements)) {
	          if (elements) {
	            if (OFFSET) {
	              return new Declaration(
	                OFFSET.thisDep,
	                OFFSET.contextDep,
	                OFFSET.propDep,
	                function (env, scope) {
	                  var result = scope.def(
	                    env.ELEMENTS, '.vertCount-', env.OFFSET);

	                  check$1.optional(function () {
	                    env.assert(scope,
	                      result + '>=0',
	                      'invalid vertex offset/element buffer too small');
	                  });

	                  return result
	                })
	            } else {
	              return createStaticDecl(function (env, scope) {
	                return scope.def(env.ELEMENTS, '.vertCount')
	              })
	            }
	          } else {
	            var result = createStaticDecl(function () {
	              return -1
	            });
	            check$1.optional(function () {
	              result.MISSING = true;
	            });
	            return result
	          }
	        } else {
	          var variable = new Declaration(
	            elements.thisDep || OFFSET.thisDep,
	            elements.contextDep || OFFSET.contextDep,
	            elements.propDep || OFFSET.propDep,
	            function (env, scope) {
	              var elements = env.ELEMENTS;
	              if (env.OFFSET) {
	                return scope.def(elements, '?', elements, '.vertCount-',
	                  env.OFFSET, ':-1')
	              }
	              return scope.def(elements, '?', elements, '.vertCount:-1')
	            });
	          check$1.optional(function () {
	            variable.DYNAMIC = true;
	          });
	          return variable
	        }
	      } else if (vaoActive) {
	        var countVariable = new Declaration(
	          vao.thisDep,
	          vao.contextDep,
	          vao.propDep,
	          function (env, scope) {
	            return scope.def(env.shared.vao, '.currentVAO?', env.shared.vao, '.currentVAO.count:-1')
	          });
	        return countVariable
	      }
	      return null
	    }

	    var primitive = parsePrimitive();
	    var count = parseVertCount();
	    var instances = parseParam(S_INSTANCES, false);

	    return {
	      elements: elements,
	      primitive: primitive,
	      count: count,
	      instances: instances,
	      offset: OFFSET,
	      vao: vao,

	      vaoActive: vaoActive,
	      elementsActive: elementsActive,

	      // static draw props
	      static: staticDraw
	    }
	  }

	  function parseGLState (options, env) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    var STATE = {};

	    GL_STATE_NAMES.forEach(function (prop) {
	      var param = propName(prop);

	      function parseParam (parseStatic, parseDynamic) {
	        if (prop in staticOptions) {
	          var value = parseStatic(staticOptions[prop]);
	          STATE[param] = createStaticDecl(function () {
	            return value
	          });
	        } else if (prop in dynamicOptions) {
	          var dyn = dynamicOptions[prop];
	          STATE[param] = createDynamicDecl(dyn, function (env, scope) {
	            return parseDynamic(env, scope, env.invoke(scope, dyn))
	          });
	        }
	      }

	      switch (prop) {
	        case S_CULL_ENABLE:
	        case S_BLEND_ENABLE:
	        case S_DITHER:
	        case S_STENCIL_ENABLE:
	        case S_DEPTH_ENABLE:
	        case S_SCISSOR_ENABLE:
	        case S_POLYGON_OFFSET_ENABLE:
	        case S_SAMPLE_ALPHA:
	        case S_SAMPLE_ENABLE:
	        case S_DEPTH_MASK:
	          return parseParam(
	            function (value) {
	              check$1.commandType(value, 'boolean', prop, env.commandStr);
	              return value
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  'typeof ' + value + '==="boolean"',
	                  'invalid flag ' + prop, env.commandStr);
	              });
	              return value
	            })

	        case S_DEPTH_FUNC:
	          return parseParam(
	            function (value) {
	              check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
	              return compareFuncs[value]
	            },
	            function (env, scope, value) {
	              var COMPARE_FUNCS = env.constants.compareFuncs;
	              check$1.optional(function () {
	                env.assert(scope,
	                  value + ' in ' + COMPARE_FUNCS,
	                  'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
	              });
	              return scope.def(COMPARE_FUNCS, '[', value, ']')
	            })

	        case S_DEPTH_RANGE:
	          return parseParam(
	            function (value) {
	              check$1.command(
	                isArrayLike(value) &&
	                value.length === 2 &&
	                typeof value[0] === 'number' &&
	                typeof value[1] === 'number' &&
	                value[0] <= value[1],
	                'depth range is 2d array',
	                env.commandStr);
	              return value
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  env.shared.isArrayLike + '(' + value + ')&&' +
	                  value + '.length===2&&' +
	                  'typeof ' + value + '[0]==="number"&&' +
	                  'typeof ' + value + '[1]==="number"&&' +
	                  value + '[0]<=' + value + '[1]',
	                  'depth range must be a 2d array');
	              });

	              var Z_NEAR = scope.def('+', value, '[0]');
	              var Z_FAR = scope.def('+', value, '[1]');
	              return [Z_NEAR, Z_FAR]
	            })

	        case S_BLEND_FUNC:
	          return parseParam(
	            function (value) {
	              check$1.commandType(value, 'object', 'blend.func', env.commandStr);
	              var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
	              var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
	              var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
	              var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
	              check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
	              check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
	              check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
	              check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

	              check$1.command(
	                (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
	                'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

	              return [
	                blendFuncs[srcRGB],
	                blendFuncs[dstRGB],
	                blendFuncs[srcAlpha],
	                blendFuncs[dstAlpha]
	              ]
	            },
	            function (env, scope, value) {
	              var BLEND_FUNCS = env.constants.blendFuncs;

	              check$1.optional(function () {
	                env.assert(scope,
	                  value + '&&typeof ' + value + '==="object"',
	                  'invalid blend func, must be an object');
	              });

	              function read (prefix, suffix) {
	                var func = scope.def(
	                  '"', prefix, suffix, '" in ', value,
	                  '?', value, '.', prefix, suffix,
	                  ':', value, '.', prefix);

	                check$1.optional(function () {
	                  env.assert(scope,
	                    func + ' in ' + BLEND_FUNCS,
	                    'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
	                });

	                return func
	              }

	              var srcRGB = read('src', 'RGB');
	              var dstRGB = read('dst', 'RGB');

	              check$1.optional(function () {
	                var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

	                env.assert(scope,
	                  INVALID_BLEND_COMBINATIONS +
	                           '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
	                  'unallowed blending combination for (srcRGB, dstRGB)'
	                );
	              });

	              var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
	              var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
	              var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
	              var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

	              return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
	            })

	        case S_BLEND_EQUATION:
	          return parseParam(
	            function (value) {
	              if (typeof value === 'string') {
	                check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
	                return [
	                  blendEquations[value],
	                  blendEquations[value]
	                ]
	              } else if (typeof value === 'object') {
	                check$1.commandParameter(
	                  value.rgb, blendEquations, prop + '.rgb', env.commandStr);
	                check$1.commandParameter(
	                  value.alpha, blendEquations, prop + '.alpha', env.commandStr);
	                return [
	                  blendEquations[value.rgb],
	                  blendEquations[value.alpha]
	                ]
	              } else {
	                check$1.commandRaise('invalid blend.equation', env.commandStr);
	              }
	            },
	            function (env, scope, value) {
	              var BLEND_EQUATIONS = env.constants.blendEquations;

	              var RGB = scope.def();
	              var ALPHA = scope.def();

	              var ifte = env.cond('typeof ', value, '==="string"');

	              check$1.optional(function () {
	                function checkProp (block, name, value) {
	                  env.assert(block,
	                    value + ' in ' + BLEND_EQUATIONS,
	                    'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
	                }
	                checkProp(ifte.then, prop, value);

	                env.assert(ifte.else,
	                  value + '&&typeof ' + value + '==="object"',
	                  'invalid ' + prop);
	                checkProp(ifte.else, prop + '.rgb', value + '.rgb');
	                checkProp(ifte.else, prop + '.alpha', value + '.alpha');
	              });

	              ifte.then(
	                RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
	              ifte.else(
	                RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
	                ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

	              scope(ifte);

	              return [RGB, ALPHA]
	            })

	        case S_BLEND_COLOR:
	          return parseParam(
	            function (value) {
	              check$1.command(
	                isArrayLike(value) &&
	                value.length === 4,
	                'blend.color must be a 4d array', env.commandStr);
	              return loop(4, function (i) {
	                return +value[i]
	              })
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  env.shared.isArrayLike + '(' + value + ')&&' +
	                  value + '.length===4',
	                  'blend.color must be a 4d array');
	              });
	              return loop(4, function (i) {
	                return scope.def('+', value, '[', i, ']')
	              })
	            })

	        case S_STENCIL_MASK:
	          return parseParam(
	            function (value) {
	              check$1.commandType(value, 'number', param, env.commandStr);
	              return value | 0
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  'typeof ' + value + '==="number"',
	                  'invalid stencil.mask');
	              });
	              return scope.def(value, '|0')
	            })

	        case S_STENCIL_FUNC:
	          return parseParam(
	            function (value) {
	              check$1.commandType(value, 'object', param, env.commandStr);
	              var cmp = value.cmp || 'keep';
	              var ref = value.ref || 0;
	              var mask = 'mask' in value ? value.mask : -1;
	              check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
	              check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
	              check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
	              return [
	                compareFuncs[cmp],
	                ref,
	                mask
	              ]
	            },
	            function (env, scope, value) {
	              var COMPARE_FUNCS = env.constants.compareFuncs;
	              check$1.optional(function () {
	                function assert () {
	                  env.assert(scope,
	                    Array.prototype.join.call(arguments, ''),
	                    'invalid stencil.func');
	                }
	                assert(value + '&&typeof ', value, '==="object"');
	                assert('!("cmp" in ', value, ')||(',
	                  value, '.cmp in ', COMPARE_FUNCS, ')');
	              });
	              var cmp = scope.def(
	                '"cmp" in ', value,
	                '?', COMPARE_FUNCS, '[', value, '.cmp]',
	                ':', GL_KEEP);
	              var ref = scope.def(value, '.ref|0');
	              var mask = scope.def(
	                '"mask" in ', value,
	                '?', value, '.mask|0:-1');
	              return [cmp, ref, mask]
	            })

	        case S_STENCIL_OPFRONT:
	        case S_STENCIL_OPBACK:
	          return parseParam(
	            function (value) {
	              check$1.commandType(value, 'object', param, env.commandStr);
	              var fail = value.fail || 'keep';
	              var zfail = value.zfail || 'keep';
	              var zpass = value.zpass || 'keep';
	              check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
	              check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
	              check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
	              return [
	                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
	                stencilOps[fail],
	                stencilOps[zfail],
	                stencilOps[zpass]
	              ]
	            },
	            function (env, scope, value) {
	              var STENCIL_OPS = env.constants.stencilOps;

	              check$1.optional(function () {
	                env.assert(scope,
	                  value + '&&typeof ' + value + '==="object"',
	                  'invalid ' + prop);
	              });

	              function read (name) {
	                check$1.optional(function () {
	                  env.assert(scope,
	                    '!("' + name + '" in ' + value + ')||' +
	                    '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
	                    'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
	                });

	                return scope.def(
	                  '"', name, '" in ', value,
	                  '?', STENCIL_OPS, '[', value, '.', name, ']:',
	                  GL_KEEP)
	              }

	              return [
	                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
	                read('fail'),
	                read('zfail'),
	                read('zpass')
	              ]
	            })

	        case S_POLYGON_OFFSET_OFFSET:
	          return parseParam(
	            function (value) {
	              check$1.commandType(value, 'object', param, env.commandStr);
	              var factor = value.factor | 0;
	              var units = value.units | 0;
	              check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
	              check$1.commandType(units, 'number', param + '.units', env.commandStr);
	              return [factor, units]
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  value + '&&typeof ' + value + '==="object"',
	                  'invalid ' + prop);
	              });

	              var FACTOR = scope.def(value, '.factor|0');
	              var UNITS = scope.def(value, '.units|0');

	              return [FACTOR, UNITS]
	            })

	        case S_CULL_FACE:
	          return parseParam(
	            function (value) {
	              var face = 0;
	              if (value === 'front') {
	                face = GL_FRONT;
	              } else if (value === 'back') {
	                face = GL_BACK;
	              }
	              check$1.command(!!face, param, env.commandStr);
	              return face
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  value + '==="front"||' +
	                  value + '==="back"',
	                  'invalid cull.face');
	              });
	              return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
	            })

	        case S_LINE_WIDTH:
	          return parseParam(
	            function (value) {
	              check$1.command(
	                typeof value === 'number' &&
	                value >= limits.lineWidthDims[0] &&
	                value <= limits.lineWidthDims[1],
	                'invalid line width, must be a positive number between ' +
	                limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
	              return value
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  'typeof ' + value + '==="number"&&' +
	                  value + '>=' + limits.lineWidthDims[0] + '&&' +
	                  value + '<=' + limits.lineWidthDims[1],
	                  'invalid line width');
	              });

	              return value
	            })

	        case S_FRONT_FACE:
	          return parseParam(
	            function (value) {
	              check$1.commandParameter(value, orientationType, param, env.commandStr);
	              return orientationType[value]
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  value + '==="cw"||' +
	                  value + '==="ccw"',
	                  'invalid frontFace, must be one of cw,ccw');
	              });
	              return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
	            })

	        case S_COLOR_MASK:
	          return parseParam(
	            function (value) {
	              check$1.command(
	                isArrayLike(value) && value.length === 4,
	                'color.mask must be length 4 array', env.commandStr);
	              return value.map(function (v) { return !!v })
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  env.shared.isArrayLike + '(' + value + ')&&' +
	                  value + '.length===4',
	                  'invalid color.mask');
	              });
	              return loop(4, function (i) {
	                return '!!' + value + '[' + i + ']'
	              })
	            })

	        case S_SAMPLE_COVERAGE:
	          return parseParam(
	            function (value) {
	              check$1.command(typeof value === 'object' && value, param, env.commandStr);
	              var sampleValue = 'value' in value ? value.value : 1;
	              var sampleInvert = !!value.invert;
	              check$1.command(
	                typeof sampleValue === 'number' &&
	                sampleValue >= 0 && sampleValue <= 1,
	                'sample.coverage.value must be a number between 0 and 1', env.commandStr);
	              return [sampleValue, sampleInvert]
	            },
	            function (env, scope, value) {
	              check$1.optional(function () {
	                env.assert(scope,
	                  value + '&&typeof ' + value + '==="object"',
	                  'invalid sample.coverage');
	              });
	              var VALUE = scope.def(
	                '"value" in ', value, '?+', value, '.value:1');
	              var INVERT = scope.def('!!', value, '.invert');
	              return [VALUE, INVERT]
	            })
	      }
	    });

	    return STATE
	  }

	  function parseUniforms (uniforms, env) {
	    var staticUniforms = uniforms.static;
	    var dynamicUniforms = uniforms.dynamic;

	    var UNIFORMS = {};

	    Object.keys(staticUniforms).forEach(function (name) {
	      var value = staticUniforms[name];
	      var result;
	      if (typeof value === 'number' ||
	          typeof value === 'boolean') {
	        result = createStaticDecl(function () {
	          return value
	        });
	      } else if (typeof value === 'function') {
	        var reglType = value._reglType;
	        if (reglType === 'texture2d' ||
	            reglType === 'textureCube') {
	          result = createStaticDecl(function (env) {
	            return env.link(value)
	          });
	        } else if (reglType === 'framebuffer' ||
	                   reglType === 'framebufferCube') {
	          check$1.command(value.color.length > 0,
	            'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
	          result = createStaticDecl(function (env) {
	            return env.link(value.color[0])
	          });
	        } else {
	          check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
	        }
	      } else if (isArrayLike(value)) {
	        result = createStaticDecl(function (env) {
	          var ITEM = env.global.def('[',
	            loop(value.length, function (i) {
	              check$1.command(
	                typeof value[i] === 'number' ||
	                typeof value[i] === 'boolean',
	                'invalid uniform ' + name, env.commandStr);
	              return value[i]
	            }), ']');
	          return ITEM
	        });
	      } else {
	        check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
	      }
	      result.value = value;
	      UNIFORMS[name] = result;
	    });

	    Object.keys(dynamicUniforms).forEach(function (key) {
	      var dyn = dynamicUniforms[key];
	      UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
	        return env.invoke(scope, dyn)
	      });
	    });

	    return UNIFORMS
	  }

	  function parseAttributes (attributes, env) {
	    var staticAttributes = attributes.static;
	    var dynamicAttributes = attributes.dynamic;

	    var attributeDefs = {};

	    Object.keys(staticAttributes).forEach(function (attribute) {
	      var value = staticAttributes[attribute];
	      var id = stringStore.id(attribute);

	      var record = new AttributeRecord();
	      if (isBufferArgs(value)) {
	        record.state = ATTRIB_STATE_POINTER;
	        record.buffer = bufferState.getBuffer(
	          bufferState.create(value, GL_ARRAY_BUFFER$2, false, true));
	        record.type = 0;
	      } else {
	        var buffer = bufferState.getBuffer(value);
	        if (buffer) {
	          record.state = ATTRIB_STATE_POINTER;
	          record.buffer = buffer;
	          record.type = 0;
	        } else {
	          check$1.command(typeof value === 'object' && value,
	            'invalid data for attribute ' + attribute, env.commandStr);
	          if ('constant' in value) {
	            var constant = value.constant;
	            record.buffer = 'null';
	            record.state = ATTRIB_STATE_CONSTANT;
	            if (typeof constant === 'number') {
	              record.x = constant;
	            } else {
	              check$1.command(
	                isArrayLike(constant) &&
	                constant.length > 0 &&
	                constant.length <= 4,
	                'invalid constant for attribute ' + attribute, env.commandStr);
	              CUTE_COMPONENTS.forEach(function (c, i) {
	                if (i < constant.length) {
	                  record[c] = constant[i];
	                }
	              });
	            }
	          } else {
	            if (isBufferArgs(value.buffer)) {
	              buffer = bufferState.getBuffer(
	                bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true));
	            } else {
	              buffer = bufferState.getBuffer(value.buffer);
	            }
	            check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

	            var offset = value.offset | 0;
	            check$1.command(offset >= 0,
	              'invalid offset for attribute "' + attribute + '"', env.commandStr);

	            var stride = value.stride | 0;
	            check$1.command(stride >= 0 && stride < 256,
	              'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

	            var size = value.size | 0;
	            check$1.command(!('size' in value) || (size > 0 && size <= 4),
	              'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

	            var normalized = !!value.normalized;

	            var type = 0;
	            if ('type' in value) {
	              check$1.commandParameter(
	                value.type, glTypes,
	                'invalid type for attribute ' + attribute, env.commandStr);
	              type = glTypes[value.type];
	            }

	            var divisor = value.divisor | 0;
	            check$1.optional(function () {
	              if ('divisor' in value) {
	                check$1.command(divisor === 0 || extInstancing,
	                  'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
	                check$1.command(divisor >= 0,
	                  'invalid divisor for attribute "' + attribute + '"', env.commandStr);
	              }

	              var command = env.commandStr;

	              var VALID_KEYS = [
	                'buffer',
	                'offset',
	                'divisor',
	                'normalized',
	                'type',
	                'size',
	                'stride'
	              ];

	              Object.keys(value).forEach(function (prop) {
	                check$1.command(
	                  VALID_KEYS.indexOf(prop) >= 0,
	                  'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
	                  command);
	              });
	            });

	            record.buffer = buffer;
	            record.state = ATTRIB_STATE_POINTER;
	            record.size = size;
	            record.normalized = normalized;
	            record.type = type || buffer.dtype;
	            record.offset = offset;
	            record.stride = stride;
	            record.divisor = divisor;
	          }
	        }
	      }

	      attributeDefs[attribute] = createStaticDecl(function (env, scope) {
	        var cache = env.attribCache;
	        if (id in cache) {
	          return cache[id]
	        }
	        var result = {
	          isStream: false
	        };
	        Object.keys(record).forEach(function (key) {
	          result[key] = record[key];
	        });
	        if (record.buffer) {
	          result.buffer = env.link(record.buffer);
	          result.type = result.type || (result.buffer + '.dtype');
	        }
	        cache[id] = result;
	        return result
	      });
	    });

	    Object.keys(dynamicAttributes).forEach(function (attribute) {
	      var dyn = dynamicAttributes[attribute];

	      function appendAttributeCode (env, block) {
	        var VALUE = env.invoke(block, dyn);

	        var shared = env.shared;
	        var constants = env.constants;

	        var IS_BUFFER_ARGS = shared.isBufferArgs;
	        var BUFFER_STATE = shared.buffer;

	        // Perform validation on attribute
	        check$1.optional(function () {
	          env.assert(block,
	            VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
	            VALUE + '==="function")&&(' +
	            IS_BUFFER_ARGS + '(' + VALUE + ')||' +
	            BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
	            BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
	            IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
	            '("constant" in ' + VALUE +
	            '&&(typeof ' + VALUE + '.constant==="number"||' +
	            shared.isArrayLike + '(' + VALUE + '.constant))))',
	            'invalid dynamic attribute "' + attribute + '"');
	        });

	        // allocate names for result
	        var result = {
	          isStream: block.def(false)
	        };
	        var defaultRecord = new AttributeRecord();
	        defaultRecord.state = ATTRIB_STATE_POINTER;
	        Object.keys(defaultRecord).forEach(function (key) {
	          result[key] = block.def('' + defaultRecord[key]);
	        });

	        var BUFFER = result.buffer;
	        var TYPE = result.type;
	        block(
	          'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
	          result.isStream, '=true;',
	          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, ');',
	          TYPE, '=', BUFFER, '.dtype;',
	          '}else{',
	          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
	          'if(', BUFFER, '){',
	          TYPE, '=', BUFFER, '.dtype;',
	          '}else if("constant" in ', VALUE, '){',
	          result.state, '=', ATTRIB_STATE_CONSTANT, ';',
	          'if(typeof ' + VALUE + '.constant === "number"){',
	          result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
	          CUTE_COMPONENTS.slice(1).map(function (n) {
	            return result[n]
	          }).join('='), '=0;',
	          '}else{',
	          CUTE_COMPONENTS.map(function (name, i) {
	            return (
	              result[name] + '=' + VALUE + '.constant.length>' + i +
	              '?' + VALUE + '.constant[' + i + ']:0;'
	            )
	          }).join(''),
	          '}}else{',
	          'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
	          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, '.buffer);',
	          '}else{',
	          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
	          '}',
	          TYPE, '="type" in ', VALUE, '?',
	          constants.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
	          result.normalized, '=!!', VALUE, '.normalized;');
	        function emitReadRecord (name) {
	          block(result[name], '=', VALUE, '.', name, '|0;');
	        }
	        emitReadRecord('size');
	        emitReadRecord('offset');
	        emitReadRecord('stride');
	        emitReadRecord('divisor');

	        block('}}');

	        block.exit(
	          'if(', result.isStream, '){',
	          BUFFER_STATE, '.destroyStream(', BUFFER, ');',
	          '}');

	        return result
	      }

	      attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
	    });

	    return attributeDefs
	  }

	  function parseContext (context) {
	    var staticContext = context.static;
	    var dynamicContext = context.dynamic;
	    var result = {};

	    Object.keys(staticContext).forEach(function (name) {
	      var value = staticContext[name];
	      result[name] = createStaticDecl(function (env, scope) {
	        if (typeof value === 'number' || typeof value === 'boolean') {
	          return '' + value
	        } else {
	          return env.link(value)
	        }
	      });
	    });

	    Object.keys(dynamicContext).forEach(function (name) {
	      var dyn = dynamicContext[name];
	      result[name] = createDynamicDecl(dyn, function (env, scope) {
	        return env.invoke(scope, dyn)
	      });
	    });

	    return result
	  }

	  function parseArguments (options, attributes, uniforms, context, env) {
	    var staticOptions = options.static;
	    var dynamicOptions = options.dynamic;

	    check$1.optional(function () {
	      var KEY_NAMES = [
	        S_FRAMEBUFFER,
	        S_VERT,
	        S_FRAG,
	        S_ELEMENTS,
	        S_PRIMITIVE,
	        S_OFFSET,
	        S_COUNT,
	        S_INSTANCES,
	        S_PROFILE,
	        S_VAO
	      ].concat(GL_STATE_NAMES);

	      function checkKeys (dict) {
	        Object.keys(dict).forEach(function (key) {
	          check$1.command(
	            KEY_NAMES.indexOf(key) >= 0,
	            'unknown parameter "' + key + '"',
	            env.commandStr);
	        });
	      }

	      checkKeys(staticOptions);
	      checkKeys(dynamicOptions);
	    });

	    var attribLocations = parseAttribLocations(options, attributes);

	    var framebuffer = parseFramebuffer(options);
	    var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
	    var draw = parseDraw(options, env);
	    var state = parseGLState(options, env);
	    var shader = parseProgram(options, env, attribLocations);

	    function copyBox (name) {
	      var defn = viewportAndScissor[name];
	      if (defn) {
	        state[name] = defn;
	      }
	    }
	    copyBox(S_VIEWPORT);
	    copyBox(propName(S_SCISSOR_BOX));

	    var dirty = Object.keys(state).length > 0;

	    var result = {
	      framebuffer: framebuffer,
	      draw: draw,
	      shader: shader,
	      state: state,
	      dirty: dirty,
	      scopeVAO: null,
	      drawVAO: null,
	      useVAO: false,
	      attributes: {}
	    };

	    result.profile = parseProfile(options);
	    result.uniforms = parseUniforms(uniforms, env);
	    result.drawVAO = result.scopeVAO = draw.vao;
	    // special case: check if we can statically allocate a vertex array object for this program
	    if (!result.drawVAO &&
	      shader.program &&
	      !attribLocations &&
	      extensions.angle_instanced_arrays &&
	      draw.static.elements) {
	      var useVAO = true;
	      var staticBindings = shader.program.attributes.map(function (attr) {
	        var binding = attributes.static[attr];
	        useVAO = useVAO && !!binding;
	        return binding
	      });
	      if (useVAO && staticBindings.length > 0) {
	        var vao = attributeState.getVAO(attributeState.createVAO({
	          attributes: staticBindings,
	          elements: draw.static.elements
	        }));
	        result.drawVAO = new Declaration(null, null, null, function (env, scope) {
	          return env.link(vao)
	        });
	        result.useVAO = true;
	      }
	    }
	    if (attribLocations) {
	      result.useVAO = true;
	    } else {
	      result.attributes = parseAttributes(attributes, env);
	    }
	    result.context = parseContext(context);
	    return result
	  }

	  // ===================================================
	  // ===================================================
	  // COMMON UPDATE FUNCTIONS
	  // ===================================================
	  // ===================================================
	  function emitContext (env, scope, context) {
	    var shared = env.shared;
	    var CONTEXT = shared.context;

	    var contextEnter = env.scope();

	    Object.keys(context).forEach(function (name) {
	      scope.save(CONTEXT, '.' + name);
	      var defn = context[name];
	      var value = defn.append(env, scope);
	      if (Array.isArray(value)) {
	        contextEnter(CONTEXT, '.', name, '=[', value.join(), '];');
	      } else {
	        contextEnter(CONTEXT, '.', name, '=', value, ';');
	      }
	    });

	    scope(contextEnter);
	  }

	  // ===================================================
	  // ===================================================
	  // COMMON DRAWING FUNCTIONS
	  // ===================================================
	  // ===================================================
	  function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
	    var shared = env.shared;

	    var GL = shared.gl;
	    var FRAMEBUFFER_STATE = shared.framebuffer;
	    var EXT_DRAW_BUFFERS;
	    if (extDrawBuffers) {
	      EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
	    }

	    var constants = env.constants;

	    var DRAW_BUFFERS = constants.drawBuffer;
	    var BACK_BUFFER = constants.backBuffer;

	    var NEXT;
	    if (framebuffer) {
	      NEXT = framebuffer.append(env, scope);
	    } else {
	      NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
	    }

	    if (!skipCheck) {
	      scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
	    }
	    scope(
	      'if(', NEXT, '){',
	      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
	    if (extDrawBuffers) {
	      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
	        DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
	    }
	    scope('}else{',
	      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
	    if (extDrawBuffers) {
	      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
	    }
	    scope(
	      '}',
	      FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
	    if (!skipCheck) {
	      scope('}');
	    }
	  }

	  function emitPollState (env, scope, args) {
	    var shared = env.shared;

	    var GL = shared.gl;

	    var CURRENT_VARS = env.current;
	    var NEXT_VARS = env.next;
	    var CURRENT_STATE = shared.current;
	    var NEXT_STATE = shared.next;

	    var block = env.cond(CURRENT_STATE, '.dirty');

	    GL_STATE_NAMES.forEach(function (prop) {
	      var param = propName(prop);
	      if (param in args.state) {
	        return
	      }

	      var NEXT, CURRENT;
	      if (param in NEXT_VARS) {
	        NEXT = NEXT_VARS[param];
	        CURRENT = CURRENT_VARS[param];
	        var parts = loop(currentState[param].length, function (i) {
	          return block.def(NEXT, '[', i, ']')
	        });
	        block(env.cond(parts.map(function (p, i) {
	          return p + '!==' + CURRENT + '[' + i + ']'
	        }).join('||'))
	          .then(
	            GL, '.', GL_VARIABLES[param], '(', parts, ');',
	            parts.map(function (p, i) {
	              return CURRENT + '[' + i + ']=' + p
	            }).join(';'), ';'));
	      } else {
	        NEXT = block.def(NEXT_STATE, '.', param);
	        var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
	        block(ifte);
	        if (param in GL_FLAGS) {
	          ifte(
	            env.cond(NEXT)
	              .then(GL, '.enable(', GL_FLAGS[param], ');')
	              .else(GL, '.disable(', GL_FLAGS[param], ');'),
	            CURRENT_STATE, '.', param, '=', NEXT, ';');
	        } else {
	          ifte(
	            GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
	            CURRENT_STATE, '.', param, '=', NEXT, ';');
	        }
	      }
	    });
	    if (Object.keys(args.state).length === 0) {
	      block(CURRENT_STATE, '.dirty=false;');
	    }
	    scope(block);
	  }

	  function emitSetOptions (env, scope, options, filter) {
	    var shared = env.shared;
	    var CURRENT_VARS = env.current;
	    var CURRENT_STATE = shared.current;
	    var GL = shared.gl;
	    sortState(Object.keys(options)).forEach(function (param) {
	      var defn = options[param];
	      if (filter && !filter(defn)) {
	        return
	      }
	      var variable = defn.append(env, scope);
	      if (GL_FLAGS[param]) {
	        var flag = GL_FLAGS[param];
	        if (isStatic(defn)) {
	          if (variable) {
	            scope(GL, '.enable(', flag, ');');
	          } else {
	            scope(GL, '.disable(', flag, ');');
	          }
	        } else {
	          scope(env.cond(variable)
	            .then(GL, '.enable(', flag, ');')
	            .else(GL, '.disable(', flag, ');'));
	        }
	        scope(CURRENT_STATE, '.', param, '=', variable, ';');
	      } else if (isArrayLike(variable)) {
	        var CURRENT = CURRENT_VARS[param];
	        scope(
	          GL, '.', GL_VARIABLES[param], '(', variable, ');',
	          variable.map(function (v, i) {
	            return CURRENT + '[' + i + ']=' + v
	          }).join(';'), ';');
	      } else {
	        scope(
	          GL, '.', GL_VARIABLES[param], '(', variable, ');',
	          CURRENT_STATE, '.', param, '=', variable, ';');
	      }
	    });
	  }

	  function injectExtensions (env, scope) {
	    if (extInstancing) {
	      env.instancing = scope.def(
	        env.shared.extensions, '.angle_instanced_arrays');
	    }
	  }

	  function emitProfile (env, scope, args, useScope, incrementCounter) {
	    var shared = env.shared;
	    var STATS = env.stats;
	    var CURRENT_STATE = shared.current;
	    var TIMER = shared.timer;
	    var profileArg = args.profile;

	    function perfCounter () {
	      if (typeof performance === 'undefined') {
	        return 'Date.now()'
	      } else {
	        return 'performance.now()'
	      }
	    }

	    var CPU_START, QUERY_COUNTER;
	    function emitProfileStart (block) {
	      CPU_START = scope.def();
	      block(CPU_START, '=', perfCounter(), ';');
	      if (typeof incrementCounter === 'string') {
	        block(STATS, '.count+=', incrementCounter, ';');
	      } else {
	        block(STATS, '.count++;');
	      }
	      if (timer) {
	        if (useScope) {
	          QUERY_COUNTER = scope.def();
	          block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
	        } else {
	          block(TIMER, '.beginQuery(', STATS, ');');
	        }
	      }
	    }

	    function emitProfileEnd (block) {
	      block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
	      if (timer) {
	        if (useScope) {
	          block(TIMER, '.pushScopeStats(',
	            QUERY_COUNTER, ',',
	            TIMER, '.getNumPendingQueries(),',
	            STATS, ');');
	        } else {
	          block(TIMER, '.endQuery();');
	        }
	      }
	    }

	    function scopeProfile (value) {
	      var prev = scope.def(CURRENT_STATE, '.profile');
	      scope(CURRENT_STATE, '.profile=', value, ';');
	      scope.exit(CURRENT_STATE, '.profile=', prev, ';');
	    }

	    var USE_PROFILE;
	    if (profileArg) {
	      if (isStatic(profileArg)) {
	        if (profileArg.enable) {
	          emitProfileStart(scope);
	          emitProfileEnd(scope.exit);
	          scopeProfile('true');
	        } else {
	          scopeProfile('false');
	        }
	        return
	      }
	      USE_PROFILE = profileArg.append(env, scope);
	      scopeProfile(USE_PROFILE);
	    } else {
	      USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
	    }

	    var start = env.block();
	    emitProfileStart(start);
	    scope('if(', USE_PROFILE, '){', start, '}');
	    var end = env.block();
	    emitProfileEnd(end);
	    scope.exit('if(', USE_PROFILE, '){', end, '}');
	  }

	  function emitAttributes (env, scope, args, attributes, filter) {
	    var shared = env.shared;

	    function typeLength (x) {
	      switch (x) {
	        case GL_FLOAT_VEC2:
	        case GL_INT_VEC2:
	        case GL_BOOL_VEC2:
	          return 2
	        case GL_FLOAT_VEC3:
	        case GL_INT_VEC3:
	        case GL_BOOL_VEC3:
	          return 3
	        case GL_FLOAT_VEC4:
	        case GL_INT_VEC4:
	        case GL_BOOL_VEC4:
	          return 4
	        default:
	          return 1
	      }
	    }

	    function emitBindAttribute (ATTRIBUTE, size, record) {
	      var GL = shared.gl;

	      var LOCATION = scope.def(ATTRIBUTE, '.location');
	      var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

	      var STATE = record.state;
	      var BUFFER = record.buffer;
	      var CONST_COMPONENTS = [
	        record.x,
	        record.y,
	        record.z,
	        record.w
	      ];

	      var COMMON_KEYS = [
	        'buffer',
	        'normalized',
	        'offset',
	        'stride'
	      ];

	      function emitBuffer () {
	        scope(
	          'if(!', BINDING, '.buffer){',
	          GL, '.enableVertexAttribArray(', LOCATION, ');}');

	        var TYPE = record.type;
	        var SIZE;
	        if (!record.size) {
	          SIZE = size;
	        } else {
	          SIZE = scope.def(record.size, '||', size);
	        }

	        scope('if(',
	          BINDING, '.type!==', TYPE, '||',
	          BINDING, '.size!==', SIZE, '||',
	          COMMON_KEYS.map(function (key) {
	            return BINDING + '.' + key + '!==' + record[key]
	          }).join('||'),
	          '){',
	          GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BUFFER, '.buffer);',
	          GL, '.vertexAttribPointer(', [
	            LOCATION,
	            SIZE,
	            TYPE,
	            record.normalized,
	            record.stride,
	            record.offset
	          ], ');',
	          BINDING, '.type=', TYPE, ';',
	          BINDING, '.size=', SIZE, ';',
	          COMMON_KEYS.map(function (key) {
	            return BINDING + '.' + key + '=' + record[key] + ';'
	          }).join(''),
	          '}');

	        if (extInstancing) {
	          var DIVISOR = record.divisor;
	          scope(
	            'if(', BINDING, '.divisor!==', DIVISOR, '){',
	            env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
	            BINDING, '.divisor=', DIVISOR, ';}');
	        }
	      }

	      function emitConstant () {
	        scope(
	          'if(', BINDING, '.buffer){',
	          GL, '.disableVertexAttribArray(', LOCATION, ');',
	          BINDING, '.buffer=null;',
	          '}if(', CUTE_COMPONENTS.map(function (c, i) {
	            return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
	          }).join('||'), '){',
	          GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
	          CUTE_COMPONENTS.map(function (c, i) {
	            return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
	          }).join(''),
	          '}');
	      }

	      if (STATE === ATTRIB_STATE_POINTER) {
	        emitBuffer();
	      } else if (STATE === ATTRIB_STATE_CONSTANT) {
	        emitConstant();
	      } else {
	        scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
	        emitBuffer();
	        scope('}else{');
	        emitConstant();
	        scope('}');
	      }
	    }

	    attributes.forEach(function (attribute) {
	      var name = attribute.name;
	      var arg = args.attributes[name];
	      var record;
	      if (arg) {
	        if (!filter(arg)) {
	          return
	        }
	        record = arg.append(env, scope);
	      } else {
	        if (!filter(SCOPE_DECL)) {
	          return
	        }
	        var scopeAttrib = env.scopeAttrib(name);
	        check$1.optional(function () {
	          env.assert(scope,
	            scopeAttrib + '.state',
	            'missing attribute ' + name);
	        });
	        record = {};
	        Object.keys(new AttributeRecord()).forEach(function (key) {
	          record[key] = scope.def(scopeAttrib, '.', key);
	        });
	      }
	      emitBindAttribute(
	        env.link(attribute), typeLength(attribute.info.type), record);
	    });
	  }

	  function emitUniforms (env, scope, args, uniforms, filter, isBatchInnerLoop) {
	    var shared = env.shared;
	    var GL = shared.gl;

	    var definedArrUniforms = {};
	    var infix;
	    for (var i = 0; i < uniforms.length; ++i) {
	      var uniform = uniforms[i];
	      var name = uniform.name;
	      var type = uniform.info.type;
	      var size = uniform.info.size;
	      var arg = args.uniforms[name];
	      if (size > 1) {
	        // either foo[n] or foos, avoid define both
	        if (!arg) {
	          continue
	        }
	        var arrUniformName = name.replace('[0]', '');
	        if (definedArrUniforms[arrUniformName]) {
	          continue
	        }
	        definedArrUniforms[arrUniformName] = 1;
	      }
	      var UNIFORM = env.link(uniform);
	      var LOCATION = UNIFORM + '.location';

	      var VALUE;
	      if (arg) {
	        if (!filter(arg)) {
	          continue
	        }
	        if (isStatic(arg)) {
	          var value = arg.value;
	          check$1.command(
	            value !== null && typeof value !== 'undefined',
	            'missing uniform "' + name + '"', env.commandStr);
	          if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
	            check$1.command(
	              typeof value === 'function' &&
	              ((type === GL_SAMPLER_2D &&
	                (value._reglType === 'texture2d' ||
	                value._reglType === 'framebuffer')) ||
	              (type === GL_SAMPLER_CUBE &&
	                (value._reglType === 'textureCube' ||
	                value._reglType === 'framebufferCube'))),
	              'invalid texture for uniform ' + name, env.commandStr);
	            var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
	            scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
	            scope.exit(TEX_VALUE, '.unbind();');
	          } else if (
	            type === GL_FLOAT_MAT2 ||
	            type === GL_FLOAT_MAT3 ||
	            type === GL_FLOAT_MAT4) {
	            check$1.optional(function () {
	              check$1.command(isArrayLike(value),
	                'invalid matrix for uniform ' + name, env.commandStr);
	              check$1.command(
	                (type === GL_FLOAT_MAT2 && value.length === 4) ||
	                (type === GL_FLOAT_MAT3 && value.length === 9) ||
	                (type === GL_FLOAT_MAT4 && value.length === 16),
	                'invalid length for matrix uniform ' + name, env.commandStr);
	            });
	            var MAT_VALUE = env.global.def('new Float32Array([' +
	              Array.prototype.slice.call(value) + '])');
	            var dim = 2;
	            if (type === GL_FLOAT_MAT3) {
	              dim = 3;
	            } else if (type === GL_FLOAT_MAT4) {
	              dim = 4;
	            }
	            scope(
	              GL, '.uniformMatrix', dim, 'fv(',
	              LOCATION, ',false,', MAT_VALUE, ');');
	          } else {
	            switch (type) {
	              case GL_FLOAT$8:
	                if (size === 1) {
	                  check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
	                } else {
	                  check$1.command(
	                    isArrayLike(value) && (value.length === size),
	                    'uniform ' + name, env.commandStr);
	                }
	                infix = '1f';
	                break
	              case GL_FLOAT_VEC2:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
	                  'uniform ' + name, env.commandStr);
	                infix = '2f';
	                break
	              case GL_FLOAT_VEC3:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
	                  'uniform ' + name, env.commandStr);
	                infix = '3f';
	                break
	              case GL_FLOAT_VEC4:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
	                  'uniform ' + name, env.commandStr);
	                infix = '4f';
	                break
	              case GL_BOOL:
	                if (size === 1) {
	                  check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
	                } else {
	                  check$1.command(
	                    isArrayLike(value) && (value.length === size),
	                    'uniform ' + name, env.commandStr);
	                }
	                infix = '1i';
	                break
	              case GL_INT$3:
	                if (size === 1) {
	                  check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
	                } else {
	                  check$1.command(
	                    isArrayLike(value) && (value.length === size),
	                    'uniform ' + name, env.commandStr);
	                }
	                infix = '1i';
	                break
	              case GL_BOOL_VEC2:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
	                  'uniform ' + name, env.commandStr);
	                infix = '2i';
	                break
	              case GL_INT_VEC2:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2),
	                  'uniform ' + name, env.commandStr);
	                infix = '2i';
	                break
	              case GL_BOOL_VEC3:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
	                  'uniform ' + name, env.commandStr);
	                infix = '3i';
	                break
	              case GL_INT_VEC3:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3),
	                  'uniform ' + name, env.commandStr);
	                infix = '3i';
	                break
	              case GL_BOOL_VEC4:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
	                  'uniform ' + name, env.commandStr);
	                infix = '4i';
	                break
	              case GL_INT_VEC4:
	                check$1.command(
	                  isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4),
	                  'uniform ' + name, env.commandStr);
	                infix = '4i';
	                break
	            }
	            if (size > 1) {
	              infix += 'v';
	              value = env.global.def('[' +
	              Array.prototype.slice.call(value) + ']');
	            } else {
	              value = isArrayLike(value) ? Array.prototype.slice.call(value) : value;
	            }
	            scope(GL, '.uniform', infix, '(', LOCATION, ',',
	              value,
	              ');');
	          }
	          continue
	        } else {
	          VALUE = arg.append(env, scope);
	        }
	      } else {
	        if (!filter(SCOPE_DECL)) {
	          continue
	        }
	        VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
	      }

	      if (type === GL_SAMPLER_2D) {
	        check$1(!Array.isArray(VALUE), 'must specify a scalar prop for textures');
	        scope(
	          'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
	          VALUE, '=', VALUE, '.color[0];',
	          '}');
	      } else if (type === GL_SAMPLER_CUBE) {
	        check$1(!Array.isArray(VALUE), 'must specify a scalar prop for cube maps');
	        scope(
	          'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
	          VALUE, '=', VALUE, '.color[0];',
	          '}');
	      }

	      // perform type validation
	      check$1.optional(function () {
	        function emitCheck (pred, message) {
	          env.assert(scope, pred,
	            'bad data or missing for uniform "' + name + '".  ' + message);
	        }

	        function checkType (type, size) {
	          if (size === 1) {
	            check$1(!Array.isArray(VALUE), 'must not specify an array type for uniform');
	          }
	          emitCheck(
	            'Array.isArray(' + VALUE + ') && typeof ' + VALUE + '[0]===" ' + type + '"' +
	            ' || typeof ' + VALUE + '==="' + type + '"',
	            'invalid type, expected ' + type);
	        }

	        function checkVector (n, type, size) {
	          if (Array.isArray(VALUE)) {
	            check$1(VALUE.length && VALUE.length % n === 0 && VALUE.length <= n * size, 'must have length of ' + (size === 1 ? '' : 'n * ') + n);
	          } else {
	            emitCheck(
	              shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length && ' + VALUE + '.length % ' + n + ' === 0' +
	              ' && ' + VALUE + '.length<=' + n * size,
	              'invalid vector, should have length of ' + (size === 1 ? '' : 'n * ') + n, env.commandStr);
	          }
	        }

	        function checkTexture (target) {
	          check$1(!Array.isArray(VALUE), 'must not specify a value type');
	          emitCheck(
	            'typeof ' + VALUE + '==="function"&&' +
	            VALUE + '._reglType==="texture' +
	            (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"',
	            'invalid texture type', env.commandStr);
	        }

	        switch (type) {
	          case GL_INT$3:
	            checkType('number', size);
	            break
	          case GL_INT_VEC2:
	            checkVector(2, 'number', size);
	            break
	          case GL_INT_VEC3:
	            checkVector(3, 'number', size);
	            break
	          case GL_INT_VEC4:
	            checkVector(4, 'number', size);
	            break
	          case GL_FLOAT$8:
	            checkType('number', size);
	            break
	          case GL_FLOAT_VEC2:
	            checkVector(2, 'number', size);
	            break
	          case GL_FLOAT_VEC3:
	            checkVector(3, 'number', size);
	            break
	          case GL_FLOAT_VEC4:
	            checkVector(4, 'number', size);
	            break
	          case GL_BOOL:
	            checkType('boolean', size);
	            break
	          case GL_BOOL_VEC2:
	            checkVector(2, 'boolean', size);
	            break
	          case GL_BOOL_VEC3:
	            checkVector(3, 'boolean', size);
	            break
	          case GL_BOOL_VEC4:
	            checkVector(4, 'boolean', size);
	            break
	          case GL_FLOAT_MAT2:
	            checkVector(4, 'number', size);
	            break
	          case GL_FLOAT_MAT3:
	            checkVector(9, 'number', size);
	            break
	          case GL_FLOAT_MAT4:
	            checkVector(16, 'number', size);
	            break
	          case GL_SAMPLER_2D:
	            checkTexture(GL_TEXTURE_2D$3);
	            break
	          case GL_SAMPLER_CUBE:
	            checkTexture(GL_TEXTURE_CUBE_MAP$2);
	            break
	        }
	      });

	      var unroll = 1;
	      switch (type) {
	        case GL_SAMPLER_2D:
	        case GL_SAMPLER_CUBE:
	          var TEX = scope.def(VALUE, '._texture');
	          scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
	          scope.exit(TEX, '.unbind();');
	          continue

	        case GL_INT$3:
	        case GL_BOOL:
	          infix = '1i';
	          break

	        case GL_INT_VEC2:
	        case GL_BOOL_VEC2:
	          infix = '2i';
	          unroll = 2;
	          break

	        case GL_INT_VEC3:
	        case GL_BOOL_VEC3:
	          infix = '3i';
	          unroll = 3;
	          break

	        case GL_INT_VEC4:
	        case GL_BOOL_VEC4:
	          infix = '4i';
	          unroll = 4;
	          break

	        case GL_FLOAT$8:
	          infix = '1f';
	          break

	        case GL_FLOAT_VEC2:
	          infix = '2f';
	          unroll = 2;
	          break

	        case GL_FLOAT_VEC3:
	          infix = '3f';
	          unroll = 3;
	          break

	        case GL_FLOAT_VEC4:
	          infix = '4f';
	          unroll = 4;
	          break

	        case GL_FLOAT_MAT2:
	          infix = 'Matrix2fv';
	          break

	        case GL_FLOAT_MAT3:
	          infix = 'Matrix3fv';
	          break

	        case GL_FLOAT_MAT4:
	          infix = 'Matrix4fv';
	          break
	      }

	      if (infix.indexOf('Matrix') === -1 && size > 1) {
	        infix += 'v';
	        unroll = 1;
	      }

	      if (infix.charAt(0) === 'M') {
	        scope(GL, '.uniform', infix, '(', LOCATION, ',');
	        var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
	        var STORAGE = env.global.def('new Float32Array(', matSize, ')');
	        if (Array.isArray(VALUE)) {
	          scope(
	            'false,(',
	            loop(matSize, function (i) {
	              return STORAGE + '[' + i + ']=' + VALUE[i]
	            }), ',', STORAGE, ')');
	        } else {
	          scope(
	            'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
	            loop(matSize, function (i) {
	              return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
	            }), ',', STORAGE, ')');
	        }
	        scope(');');
	      } else if (unroll > 1) {
	        var prev = [];
	        var cur = [];
	        for (var j = 0; j < unroll; ++j) {
	          if (Array.isArray(VALUE)) {
	            cur.push(VALUE[j]);
	          } else {
	            cur.push(scope.def(VALUE + '[' + j + ']'));
	          }
	          if (isBatchInnerLoop) {
	            prev.push(scope.def());
	          }
	        }
	        if (isBatchInnerLoop) {
	          scope('if(!', env.batchId, '||', prev.map(function (p, i) {
	            return p + '!==' + cur[i]
	          }).join('||'), '){', prev.map(function (p, i) {
	            return p + '=' + cur[i] + ';'
	          }).join(''));
	        }
	        scope(GL, '.uniform', infix, '(', LOCATION, ',', cur.join(','), ');');
	        if (isBatchInnerLoop) {
	          scope('}');
	        }
	      } else {
	        check$1(!Array.isArray(VALUE), 'uniform value must not be an array');
	        if (isBatchInnerLoop) {
	          var prevS = scope.def();
	          scope('if(!', env.batchId, '||', prevS, '!==', VALUE, '){',
	            prevS, '=', VALUE, ';');
	        }
	        scope(GL, '.uniform', infix, '(', LOCATION, ',', VALUE, ');');
	        if (isBatchInnerLoop) {
	          scope('}');
	        }
	      }
	    }
	  }

	  function emitDraw (env, outer, inner, args) {
	    var shared = env.shared;
	    var GL = shared.gl;
	    var DRAW_STATE = shared.draw;

	    var drawOptions = args.draw;

	    function emitElements () {
	      var defn = drawOptions.elements;
	      var ELEMENTS;
	      var scope = outer;
	      if (defn) {
	        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
	          scope = inner;
	        }
	        ELEMENTS = defn.append(env, scope);
	        if (drawOptions.elementsActive) {
	          scope(
	            'if(' + ELEMENTS + ')' +
	            GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);');
	        }
	      } else {
	        ELEMENTS = scope.def();
	        scope(
	          ELEMENTS, '=', DRAW_STATE, '.', S_ELEMENTS, ';',
	          'if(', ELEMENTS, '){',
	          GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER$2, ',', ELEMENTS, '.buffer.buffer);}',
	          'else if(', shared.vao, '.currentVAO){',
	          ELEMENTS, '=', env.shared.elements + '.getElements(' + shared.vao, '.currentVAO.elements);',
	          (!extVertexArrays ? 'if(' + ELEMENTS + ')' + GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);' : ''),
	          '}');
	      }
	      return ELEMENTS
	    }

	    function emitCount () {
	      var defn = drawOptions.count;
	      var COUNT;
	      var scope = outer;
	      if (defn) {
	        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
	          scope = inner;
	        }
	        COUNT = defn.append(env, scope);
	        check$1.optional(function () {
	          if (defn.MISSING) {
	            env.assert(outer, 'false', 'missing vertex count');
	          }
	          if (defn.DYNAMIC) {
	            env.assert(scope, COUNT + '>=0', 'missing vertex count');
	          }
	        });
	      } else {
	        COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
	        check$1.optional(function () {
	          env.assert(scope, COUNT + '>=0', 'missing vertex count');
	        });
	      }
	      return COUNT
	    }

	    var ELEMENTS = emitElements();
	    function emitValue (name) {
	      var defn = drawOptions[name];
	      if (defn) {
	        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
	          return defn.append(env, inner)
	        } else {
	          return defn.append(env, outer)
	        }
	      } else {
	        return outer.def(DRAW_STATE, '.', name)
	      }
	    }

	    var PRIMITIVE = emitValue(S_PRIMITIVE);
	    var OFFSET = emitValue(S_OFFSET);

	    var COUNT = emitCount();
	    if (typeof COUNT === 'number') {
	      if (COUNT === 0) {
	        return
	      }
	    } else {
	      inner('if(', COUNT, '){');
	      inner.exit('}');
	    }

	    var INSTANCES, EXT_INSTANCING;
	    if (extInstancing) {
	      INSTANCES = emitValue(S_INSTANCES);
	      EXT_INSTANCING = env.instancing;
	    }

	    var ELEMENT_TYPE = ELEMENTS + '.type';

	    var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements) && !drawOptions.vaoActive;

	    function emitInstancing () {
	      function drawElements () {
	        inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
	          PRIMITIVE,
	          COUNT,
	          ELEMENT_TYPE,
	          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
	          INSTANCES
	        ], ');');
	      }

	      function drawArrays () {
	        inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
	          [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
	      }

	      if (ELEMENTS && ELEMENTS !== 'null') {
	        if (!elementsStatic) {
	          inner('if(', ELEMENTS, '){');
	          drawElements();
	          inner('}else{');
	          drawArrays();
	          inner('}');
	        } else {
	          drawElements();
	        }
	      } else {
	        drawArrays();
	      }
	    }

	    function emitRegular () {
	      function drawElements () {
	        inner(GL + '.drawElements(' + [
	          PRIMITIVE,
	          COUNT,
	          ELEMENT_TYPE,
	          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
	        ] + ');');
	      }

	      function drawArrays () {
	        inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
	      }

	      if (ELEMENTS && ELEMENTS !== 'null') {
	        if (!elementsStatic) {
	          inner('if(', ELEMENTS, '){');
	          drawElements();
	          inner('}else{');
	          drawArrays();
	          inner('}');
	        } else {
	          drawElements();
	        }
	      } else {
	        drawArrays();
	      }
	    }

	    if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
	      if (typeof INSTANCES === 'string') {
	        inner('if(', INSTANCES, '>0){');
	        emitInstancing();
	        inner('}else if(', INSTANCES, '<0){');
	        emitRegular();
	        inner('}');
	      } else {
	        emitInstancing();
	      }
	    } else {
	      emitRegular();
	    }
	  }

	  function createBody (emitBody, parentEnv, args, program, count) {
	    var env = createREGLEnvironment();
	    var scope = env.proc('body', count);
	    check$1.optional(function () {
	      env.commandStr = parentEnv.commandStr;
	      env.command = env.link(parentEnv.commandStr);
	    });
	    if (extInstancing) {
	      env.instancing = scope.def(
	        env.shared.extensions, '.angle_instanced_arrays');
	    }
	    emitBody(env, scope, args, program);
	    return env.compile().body
	  }

	  // ===================================================
	  // ===================================================
	  // DRAW PROC
	  // ===================================================
	  // ===================================================
	  function emitDrawBody (env, draw, args, program) {
	    injectExtensions(env, draw);
	    if (args.useVAO) {
	      if (args.drawVAO) {
	        draw(env.shared.vao, '.setVAO(', args.drawVAO.append(env, draw), ');');
	      } else {
	        draw(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
	      }
	    } else {
	      draw(env.shared.vao, '.setVAO(null);');
	      emitAttributes(env, draw, args, program.attributes, function () {
	        return true
	      });
	    }
	    emitUniforms(env, draw, args, program.uniforms, function () {
	      return true
	    }, false);
	    emitDraw(env, draw, draw, args);
	  }

	  function emitDrawProc (env, args) {
	    var draw = env.proc('draw', 1);

	    injectExtensions(env, draw);

	    emitContext(env, draw, args.context);
	    emitPollFramebuffer(env, draw, args.framebuffer);

	    emitPollState(env, draw, args);
	    emitSetOptions(env, draw, args.state);

	    emitProfile(env, draw, args, false, true);

	    var program = args.shader.progVar.append(env, draw);
	    draw(env.shared.gl, '.useProgram(', program, '.program);');

	    if (args.shader.program) {
	      emitDrawBody(env, draw, args, args.shader.program);
	    } else {
	      draw(env.shared.vao, '.setVAO(null);');
	      var drawCache = env.global.def('{}');
	      var PROG_ID = draw.def(program, '.id');
	      var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
	      draw(
	        env.cond(CACHED_PROC)
	          .then(CACHED_PROC, '.call(this,a0);')
	          .else(
	            CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
	            env.link(function (program) {
	              return createBody(emitDrawBody, env, args, program, 1)
	            }), '(', program, ');',
	            CACHED_PROC, '.call(this,a0);'));
	    }

	    if (Object.keys(args.state).length > 0) {
	      draw(env.shared.current, '.dirty=true;');
	    }

	    if (env.shared.vao) {
	      draw(env.shared.vao, '.setVAO(null);');
	    }
	  }

	  // ===================================================
	  // ===================================================
	  // BATCH PROC
	  // ===================================================
	  // ===================================================

	  function emitBatchDynamicShaderBody (env, scope, args, program) {
	    env.batchId = 'a1';

	    injectExtensions(env, scope);

	    function all () {
	      return true
	    }

	    emitAttributes(env, scope, args, program.attributes, all);
	    emitUniforms(env, scope, args, program.uniforms, all, false);
	    emitDraw(env, scope, scope, args);
	  }

	  function emitBatchBody (env, scope, args, program) {
	    injectExtensions(env, scope);

	    var contextDynamic = args.contextDep;

	    var BATCH_ID = scope.def();
	    var PROP_LIST = 'a0';
	    var NUM_PROPS = 'a1';
	    var PROPS = scope.def();
	    env.shared.props = PROPS;
	    env.batchId = BATCH_ID;

	    var outer = env.scope();
	    var inner = env.scope();

	    scope(
	      outer.entry,
	      'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
	      PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
	      inner,
	      '}',
	      outer.exit);

	    function isInnerDefn (defn) {
	      return ((defn.contextDep && contextDynamic) || defn.propDep)
	    }

	    function isOuterDefn (defn) {
	      return !isInnerDefn(defn)
	    }

	    if (args.needsContext) {
	      emitContext(env, inner, args.context);
	    }
	    if (args.needsFramebuffer) {
	      emitPollFramebuffer(env, inner, args.framebuffer);
	    }
	    emitSetOptions(env, inner, args.state, isInnerDefn);

	    if (args.profile && isInnerDefn(args.profile)) {
	      emitProfile(env, inner, args, false, true);
	    }

	    if (!program) {
	      var progCache = env.global.def('{}');
	      var PROGRAM = args.shader.progVar.append(env, inner);
	      var PROG_ID = inner.def(PROGRAM, '.id');
	      var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
	      inner(
	        env.shared.gl, '.useProgram(', PROGRAM, '.program);',
	        'if(!', CACHED_PROC, '){',
	        CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
	        env.link(function (program) {
	          return createBody(
	            emitBatchDynamicShaderBody, env, args, program, 2)
	        }), '(', PROGRAM, ');}',
	        CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
	    } else {
	      if (args.useVAO) {
	        if (args.drawVAO) {
	          if (isInnerDefn(args.drawVAO)) {
	            // vao is a prop
	            inner(env.shared.vao, '.setVAO(', args.drawVAO.append(env, inner), ');');
	          } else {
	            // vao is invariant
	            outer(env.shared.vao, '.setVAO(', args.drawVAO.append(env, outer), ');');
	          }
	        } else {
	          // scoped vao binding
	          outer(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
	        }
	      } else {
	        outer(env.shared.vao, '.setVAO(null);');
	        emitAttributes(env, outer, args, program.attributes, isOuterDefn);
	        emitAttributes(env, inner, args, program.attributes, isInnerDefn);
	      }
	      emitUniforms(env, outer, args, program.uniforms, isOuterDefn, false);
	      emitUniforms(env, inner, args, program.uniforms, isInnerDefn, true);
	      emitDraw(env, outer, inner, args);
	    }
	  }

	  function emitBatchProc (env, args) {
	    var batch = env.proc('batch', 2);
	    env.batchId = '0';

	    injectExtensions(env, batch);

	    // Check if any context variables depend on props
	    var contextDynamic = false;
	    var needsContext = true;
	    Object.keys(args.context).forEach(function (name) {
	      contextDynamic = contextDynamic || args.context[name].propDep;
	    });
	    if (!contextDynamic) {
	      emitContext(env, batch, args.context);
	      needsContext = false;
	    }

	    // framebuffer state affects framebufferWidth/height context vars
	    var framebuffer = args.framebuffer;
	    var needsFramebuffer = false;
	    if (framebuffer) {
	      if (framebuffer.propDep) {
	        contextDynamic = needsFramebuffer = true;
	      } else if (framebuffer.contextDep && contextDynamic) {
	        needsFramebuffer = true;
	      }
	      if (!needsFramebuffer) {
	        emitPollFramebuffer(env, batch, framebuffer);
	      }
	    } else {
	      emitPollFramebuffer(env, batch, null);
	    }

	    // viewport is weird because it can affect context vars
	    if (args.state.viewport && args.state.viewport.propDep) {
	      contextDynamic = true;
	    }

	    function isInnerDefn (defn) {
	      return (defn.contextDep && contextDynamic) || defn.propDep
	    }

	    // set webgl options
	    emitPollState(env, batch, args);
	    emitSetOptions(env, batch, args.state, function (defn) {
	      return !isInnerDefn(defn)
	    });

	    if (!args.profile || !isInnerDefn(args.profile)) {
	      emitProfile(env, batch, args, false, 'a1');
	    }

	    // Save these values to args so that the batch body routine can use them
	    args.contextDep = contextDynamic;
	    args.needsContext = needsContext;
	    args.needsFramebuffer = needsFramebuffer;

	    // determine if shader is dynamic
	    var progDefn = args.shader.progVar;
	    if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
	      emitBatchBody(
	        env,
	        batch,
	        args,
	        null);
	    } else {
	      var PROGRAM = progDefn.append(env, batch);
	      batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
	      if (args.shader.program) {
	        emitBatchBody(
	          env,
	          batch,
	          args,
	          args.shader.program);
	      } else {
	        batch(env.shared.vao, '.setVAO(null);');
	        var batchCache = env.global.def('{}');
	        var PROG_ID = batch.def(PROGRAM, '.id');
	        var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
	        batch(
	          env.cond(CACHED_PROC)
	            .then(CACHED_PROC, '.call(this,a0,a1);')
	            .else(
	              CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
	              env.link(function (program) {
	                return createBody(emitBatchBody, env, args, program, 2)
	              }), '(', PROGRAM, ');',
	              CACHED_PROC, '.call(this,a0,a1);'));
	      }
	    }

	    if (Object.keys(args.state).length > 0) {
	      batch(env.shared.current, '.dirty=true;');
	    }

	    if (env.shared.vao) {
	      batch(env.shared.vao, '.setVAO(null);');
	    }
	  }

	  // ===================================================
	  // ===================================================
	  // SCOPE COMMAND
	  // ===================================================
	  // ===================================================
	  function emitScopeProc (env, args) {
	    var scope = env.proc('scope', 3);
	    env.batchId = 'a2';

	    var shared = env.shared;
	    var CURRENT_STATE = shared.current;

	    emitContext(env, scope, args.context);

	    if (args.framebuffer) {
	      args.framebuffer.append(env, scope);
	    }

	    sortState(Object.keys(args.state)).forEach(function (name) {
	      var defn = args.state[name];
	      var value = defn.append(env, scope);
	      if (isArrayLike(value)) {
	        value.forEach(function (v, i) {
	          scope.set(env.next[name], '[' + i + ']', v);
	        });
	      } else {
	        scope.set(shared.next, '.' + name, value);
	      }
	    });

	    emitProfile(env, scope, args, true, true)

	    ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
	      function (opt) {
	        var variable = args.draw[opt];
	        if (!variable) {
	          return
	        }
	        scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
	      });

	    Object.keys(args.uniforms).forEach(function (opt) {
	      var value = args.uniforms[opt].append(env, scope);
	      if (Array.isArray(value)) {
	        value = '[' + value.join() + ']';
	      }
	      scope.set(
	        shared.uniforms,
	        '[' + stringStore.id(opt) + ']',
	        value);
	    });

	    Object.keys(args.attributes).forEach(function (name) {
	      var record = args.attributes[name].append(env, scope);
	      var scopeAttrib = env.scopeAttrib(name);
	      Object.keys(new AttributeRecord()).forEach(function (prop) {
	        scope.set(scopeAttrib, '.' + prop, record[prop]);
	      });
	    });

	    if (args.scopeVAO) {
	      scope.set(shared.vao, '.targetVAO', args.scopeVAO.append(env, scope));
	    }

	    function saveShader (name) {
	      var shader = args.shader[name];
	      if (shader) {
	        scope.set(shared.shader, '.' + name, shader.append(env, scope));
	      }
	    }
	    saveShader(S_VERT);
	    saveShader(S_FRAG);

	    if (Object.keys(args.state).length > 0) {
	      scope(CURRENT_STATE, '.dirty=true;');
	      scope.exit(CURRENT_STATE, '.dirty=true;');
	    }

	    scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
	  }

	  function isDynamicObject (object) {
	    if (typeof object !== 'object' || isArrayLike(object)) {
	      return
	    }
	    var props = Object.keys(object);
	    for (var i = 0; i < props.length; ++i) {
	      if (dynamic.isDynamic(object[props[i]])) {
	        return true
	      }
	    }
	    return false
	  }

	  function splatObject (env, options, name) {
	    var object = options.static[name];
	    if (!object || !isDynamicObject(object)) {
	      return
	    }

	    var globals = env.global;
	    var keys = Object.keys(object);
	    var thisDep = false;
	    var contextDep = false;
	    var propDep = false;
	    var objectRef = env.global.def('{}');
	    keys.forEach(function (key) {
	      var value = object[key];
	      if (dynamic.isDynamic(value)) {
	        if (typeof value === 'function') {
	          value = object[key] = dynamic.unbox(value);
	        }
	        var deps = createDynamicDecl(value, null);
	        thisDep = thisDep || deps.thisDep;
	        propDep = propDep || deps.propDep;
	        contextDep = contextDep || deps.contextDep;
	      } else {
	        globals(objectRef, '.', key, '=');
	        switch (typeof value) {
	          case 'number':
	            globals(value);
	            break
	          case 'string':
	            globals('"', value, '"');
	            break
	          case 'object':
	            if (Array.isArray(value)) {
	              globals('[', value.join(), ']');
	            }
	            break
	          default:
	            globals(env.link(value));
	            break
	        }
	        globals(';');
	      }
	    });

	    function appendBlock (env, block) {
	      keys.forEach(function (key) {
	        var value = object[key];
	        if (!dynamic.isDynamic(value)) {
	          return
	        }
	        var ref = env.invoke(block, value);
	        block(objectRef, '.', key, '=', ref, ';');
	      });
	    }

	    options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
	      thisDep: thisDep,
	      contextDep: contextDep,
	      propDep: propDep,
	      ref: objectRef,
	      append: appendBlock
	    });
	    delete options.static[name];
	  }

	  // ===========================================================================
	  // ===========================================================================
	  // MAIN DRAW COMMAND
	  // ===========================================================================
	  // ===========================================================================
	  function compileCommand (options, attributes, uniforms, context, stats) {
	    var env = createREGLEnvironment();

	    // link stats, so that we can easily access it in the program.
	    env.stats = env.link(stats);

	    // splat options and attributes to allow for dynamic nested properties
	    Object.keys(attributes.static).forEach(function (key) {
	      splatObject(env, attributes, key);
	    });
	    NESTED_OPTIONS.forEach(function (name) {
	      splatObject(env, options, name);
	    });

	    var args = parseArguments(options, attributes, uniforms, context, env);

	    emitDrawProc(env, args);
	    emitScopeProc(env, args);
	    emitBatchProc(env, args);

	    return extend(env.compile(), {
	      destroy: function () {
	        args.shader.program.destroy();
	      }
	    })
	  }

	  // ===========================================================================
	  // ===========================================================================
	  // POLL / REFRESH
	  // ===========================================================================
	  // ===========================================================================
	  return {
	    next: nextState,
	    current: currentState,
	    procs: (function () {
	      var env = createREGLEnvironment();
	      var poll = env.proc('poll');
	      var refresh = env.proc('refresh');
	      var common = env.block();
	      poll(common);
	      refresh(common);

	      var shared = env.shared;
	      var GL = shared.gl;
	      var NEXT_STATE = shared.next;
	      var CURRENT_STATE = shared.current;

	      common(CURRENT_STATE, '.dirty=false;');

	      emitPollFramebuffer(env, poll);
	      emitPollFramebuffer(env, refresh, null, true);

	      // Refresh updates all attribute state changes
	      var INSTANCING;
	      if (extInstancing) {
	        INSTANCING = env.link(extInstancing);
	      }

	      // update vertex array bindings
	      if (extensions.oes_vertex_array_object) {
	        refresh(env.link(extensions.oes_vertex_array_object), '.bindVertexArrayOES(null);');
	      }
	      for (var i = 0; i < limits.maxAttributes; ++i) {
	        var BINDING = refresh.def(shared.attributes, '[', i, ']');
	        var ifte = env.cond(BINDING, '.buffer');
	        ifte.then(
	          GL, '.enableVertexAttribArray(', i, ');',
	          GL, '.bindBuffer(',
	          GL_ARRAY_BUFFER$2, ',',
	          BINDING, '.buffer.buffer);',
	          GL, '.vertexAttribPointer(',
	          i, ',',
	          BINDING, '.size,',
	          BINDING, '.type,',
	          BINDING, '.normalized,',
	          BINDING, '.stride,',
	          BINDING, '.offset);'
	        ).else(
	          GL, '.disableVertexAttribArray(', i, ');',
	          GL, '.vertexAttrib4f(',
	          i, ',',
	          BINDING, '.x,',
	          BINDING, '.y,',
	          BINDING, '.z,',
	          BINDING, '.w);',
	          BINDING, '.buffer=null;');
	        refresh(ifte);
	        if (extInstancing) {
	          refresh(
	            INSTANCING, '.vertexAttribDivisorANGLE(',
	            i, ',',
	            BINDING, '.divisor);');
	        }
	      }
	      refresh(
	        env.shared.vao, '.currentVAO=null;',
	        env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');

	      Object.keys(GL_FLAGS).forEach(function (flag) {
	        var cap = GL_FLAGS[flag];
	        var NEXT = common.def(NEXT_STATE, '.', flag);
	        var block = env.block();
	        block('if(', NEXT, '){',
	          GL, '.enable(', cap, ')}else{',
	          GL, '.disable(', cap, ')}',
	          CURRENT_STATE, '.', flag, '=', NEXT, ';');
	        refresh(block);
	        poll(
	          'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
	          block,
	          '}');
	      });

	      Object.keys(GL_VARIABLES).forEach(function (name) {
	        var func = GL_VARIABLES[name];
	        var init = currentState[name];
	        var NEXT, CURRENT;
	        var block = env.block();
	        block(GL, '.', func, '(');
	        if (isArrayLike(init)) {
	          var n = init.length;
	          NEXT = env.global.def(NEXT_STATE, '.', name);
	          CURRENT = env.global.def(CURRENT_STATE, '.', name);
	          block(
	            loop(n, function (i) {
	              return NEXT + '[' + i + ']'
	            }), ');',
	            loop(n, function (i) {
	              return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
	            }).join(''));
	          poll(
	            'if(', loop(n, function (i) {
	              return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
	            }).join('||'), '){',
	            block,
	            '}');
	        } else {
	          NEXT = common.def(NEXT_STATE, '.', name);
	          CURRENT = common.def(CURRENT_STATE, '.', name);
	          block(
	            NEXT, ');',
	            CURRENT_STATE, '.', name, '=', NEXT, ';');
	          poll(
	            'if(', NEXT, '!==', CURRENT, '){',
	            block,
	            '}');
	        }
	        refresh(block);
	      });

	      return env.compile()
	    })(),
	    compile: compileCommand
	  }
	}

	function stats () {
	  return {
	    vaoCount: 0,
	    bufferCount: 0,
	    elementsCount: 0,
	    framebufferCount: 0,
	    shaderCount: 0,
	    textureCount: 0,
	    cubeCount: 0,
	    renderbufferCount: 0,
	    maxTextureUnits: 0
	  }
	}

	var GL_QUERY_RESULT_EXT = 0x8866;
	var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
	var GL_TIME_ELAPSED_EXT = 0x88BF;

	var createTimer = function (gl, extensions) {
	  if (!extensions.ext_disjoint_timer_query) {
	    return null
	  }

	  // QUERY POOL BEGIN
	  var queryPool = [];
	  function allocQuery () {
	    return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT()
	  }
	  function freeQuery (query) {
	    queryPool.push(query);
	  }
	  // QUERY POOL END

	  var pendingQueries = [];
	  function beginQuery (stats) {
	    var query = allocQuery();
	    extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
	    pendingQueries.push(query);
	    pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
	  }

	  function endQuery () {
	    extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
	  }

	  //
	  // Pending stats pool.
	  //
	  function PendingStats () {
	    this.startQueryIndex = -1;
	    this.endQueryIndex = -1;
	    this.sum = 0;
	    this.stats = null;
	  }
	  var pendingStatsPool = [];
	  function allocPendingStats () {
	    return pendingStatsPool.pop() || new PendingStats()
	  }
	  function freePendingStats (pendingStats) {
	    pendingStatsPool.push(pendingStats);
	  }
	  // Pending stats pool end

	  var pendingStats = [];
	  function pushScopeStats (start, end, stats) {
	    var ps = allocPendingStats();
	    ps.startQueryIndex = start;
	    ps.endQueryIndex = end;
	    ps.sum = 0;
	    ps.stats = stats;
	    pendingStats.push(ps);
	  }

	  // we should call this at the beginning of the frame,
	  // in order to update gpuTime
	  var timeSum = [];
	  var queryPtr = [];
	  function update () {
	    var ptr, i;

	    var n = pendingQueries.length;
	    if (n === 0) {
	      return
	    }

	    // Reserve space
	    queryPtr.length = Math.max(queryPtr.length, n + 1);
	    timeSum.length = Math.max(timeSum.length, n + 1);
	    timeSum[0] = 0;
	    queryPtr[0] = 0;

	    // Update all pending timer queries
	    var queryTime = 0;
	    ptr = 0;
	    for (i = 0; i < pendingQueries.length; ++i) {
	      var query = pendingQueries[i];
	      if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
	        queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
	        freeQuery(query);
	      } else {
	        pendingQueries[ptr++] = query;
	      }
	      timeSum[i + 1] = queryTime;
	      queryPtr[i + 1] = ptr;
	    }
	    pendingQueries.length = ptr;

	    // Update all pending stat queries
	    ptr = 0;
	    for (i = 0; i < pendingStats.length; ++i) {
	      var stats = pendingStats[i];
	      var start = stats.startQueryIndex;
	      var end = stats.endQueryIndex;
	      stats.sum += timeSum[end] - timeSum[start];
	      var startPtr = queryPtr[start];
	      var endPtr = queryPtr[end];
	      if (endPtr === startPtr) {
	        stats.stats.gpuTime += stats.sum / 1e6;
	        freePendingStats(stats);
	      } else {
	        stats.startQueryIndex = startPtr;
	        stats.endQueryIndex = endPtr;
	        pendingStats[ptr++] = stats;
	      }
	    }
	    pendingStats.length = ptr;
	  }

	  return {
	    beginQuery: beginQuery,
	    endQuery: endQuery,
	    pushScopeStats: pushScopeStats,
	    update: update,
	    getNumPendingQueries: function () {
	      return pendingQueries.length
	    },
	    clear: function () {
	      queryPool.push.apply(queryPool, pendingQueries);
	      for (var i = 0; i < queryPool.length; i++) {
	        extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
	      }
	      pendingQueries.length = 0;
	      queryPool.length = 0;
	    },
	    restore: function () {
	      pendingQueries.length = 0;
	      queryPool.length = 0;
	    }
	  }
	};

	var GL_COLOR_BUFFER_BIT = 16384;
	var GL_DEPTH_BUFFER_BIT = 256;
	var GL_STENCIL_BUFFER_BIT = 1024;

	var GL_ARRAY_BUFFER = 34962;

	var CONTEXT_LOST_EVENT = 'webglcontextlost';
	var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

	var DYN_PROP = 1;
	var DYN_CONTEXT = 2;
	var DYN_STATE = 3;

	function find (haystack, needle) {
	  for (var i = 0; i < haystack.length; ++i) {
	    if (haystack[i] === needle) {
	      return i
	    }
	  }
	  return -1
	}

	function wrapREGL (args) {
	  var config = parseArgs(args);
	  if (!config) {
	    return null
	  }

	  var gl = config.gl;
	  var glAttributes = gl.getContextAttributes();
	  var contextLost = gl.isContextLost();

	  var extensionState = createExtensionCache(gl, config);
	  if (!extensionState) {
	    return null
	  }

	  var stringStore = createStringStore();
	  var stats$$1 = stats();
	  var extensions = extensionState.extensions;
	  var timer = createTimer(gl, extensions);

	  var START_TIME = clock();
	  var WIDTH = gl.drawingBufferWidth;
	  var HEIGHT = gl.drawingBufferHeight;

	  var contextState = {
	    tick: 0,
	    time: 0,
	    viewportWidth: WIDTH,
	    viewportHeight: HEIGHT,
	    framebufferWidth: WIDTH,
	    framebufferHeight: HEIGHT,
	    drawingBufferWidth: WIDTH,
	    drawingBufferHeight: HEIGHT,
	    pixelRatio: config.pixelRatio
	  };
	  var uniformState = {};
	  var drawState = {
	    elements: null,
	    primitive: 4, // GL_TRIANGLES
	    count: -1,
	    offset: 0,
	    instances: -1
	  };

	  var limits = wrapLimits(gl, extensions);
	  var bufferState = wrapBufferState(
	    gl,
	    stats$$1,
	    config,
	    destroyBuffer);
	  var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
	  var attributeState = wrapAttributeState(
	    gl,
	    extensions,
	    limits,
	    stats$$1,
	    bufferState,
	    elementState,
	    drawState);
	  function destroyBuffer (buffer) {
	    return attributeState.destroyBuffer(buffer)
	  }
	  var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
	  var textureState = createTextureSet(
	    gl,
	    extensions,
	    limits,
	    function () { core.procs.poll(); },
	    contextState,
	    stats$$1,
	    config);
	  var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
	  var framebufferState = wrapFBOState(
	    gl,
	    extensions,
	    limits,
	    textureState,
	    renderbufferState,
	    stats$$1);
	  var core = reglCore(
	    gl,
	    stringStore,
	    extensions,
	    limits,
	    bufferState,
	    elementState,
	    textureState,
	    framebufferState,
	    uniformState,
	    attributeState,
	    shaderState,
	    drawState,
	    contextState,
	    timer,
	    config);
	  var readPixels = wrapReadPixels(
	    gl,
	    framebufferState,
	    core.procs.poll,
	    contextState,
	    glAttributes, extensions, limits);

	  var nextState = core.next;
	  var canvas = gl.canvas;

	  var rafCallbacks = [];
	  var lossCallbacks = [];
	  var restoreCallbacks = [];
	  var destroyCallbacks = [config.onDestroy];

	  var activeRAF = null;
	  function handleRAF () {
	    if (rafCallbacks.length === 0) {
	      if (timer) {
	        timer.update();
	      }
	      activeRAF = null;
	      return
	    }

	    // schedule next animation frame
	    activeRAF = raf.next(handleRAF);

	    // poll for changes
	    poll();

	    // fire a callback for all pending rafs
	    for (var i = rafCallbacks.length - 1; i >= 0; --i) {
	      var cb = rafCallbacks[i];
	      if (cb) {
	        cb(contextState, null, 0);
	      }
	    }

	    // flush all pending webgl calls
	    gl.flush();

	    // poll GPU timers *after* gl.flush so we don't delay command dispatch
	    if (timer) {
	      timer.update();
	    }
	  }

	  function startRAF () {
	    if (!activeRAF && rafCallbacks.length > 0) {
	      activeRAF = raf.next(handleRAF);
	    }
	  }

	  function stopRAF () {
	    if (activeRAF) {
	      raf.cancel(handleRAF);
	      activeRAF = null;
	    }
	  }

	  function handleContextLoss (event) {
	    event.preventDefault();

	    // set context lost flag
	    contextLost = true;

	    // pause request animation frame
	    stopRAF();

	    // lose context
	    lossCallbacks.forEach(function (cb) {
	      cb();
	    });
	  }

	  function handleContextRestored (event) {
	    // clear error code
	    gl.getError();

	    // clear context lost flag
	    contextLost = false;

	    // refresh state
	    extensionState.restore();
	    shaderState.restore();
	    bufferState.restore();
	    textureState.restore();
	    renderbufferState.restore();
	    framebufferState.restore();
	    attributeState.restore();
	    if (timer) {
	      timer.restore();
	    }

	    // refresh state
	    core.procs.refresh();

	    // restart RAF
	    startRAF();

	    // restore context
	    restoreCallbacks.forEach(function (cb) {
	      cb();
	    });
	  }

	  if (canvas) {
	    canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
	    canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
	  }

	  function destroy () {
	    rafCallbacks.length = 0;
	    stopRAF();

	    if (canvas) {
	      canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
	      canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
	    }

	    shaderState.clear();
	    framebufferState.clear();
	    renderbufferState.clear();
	    attributeState.clear();
	    textureState.clear();
	    elementState.clear();
	    bufferState.clear();

	    if (timer) {
	      timer.clear();
	    }

	    destroyCallbacks.forEach(function (cb) {
	      cb();
	    });
	  }

	  function compileProcedure (options) {
	    check$1(!!options, 'invalid args to regl({...})');
	    check$1.type(options, 'object', 'invalid args to regl({...})');

	    function flattenNestedOptions (options) {
	      var result = extend({}, options);
	      delete result.uniforms;
	      delete result.attributes;
	      delete result.context;
	      delete result.vao;

	      if ('stencil' in result && result.stencil.op) {
	        result.stencil.opBack = result.stencil.opFront = result.stencil.op;
	        delete result.stencil.op;
	      }

	      function merge (name) {
	        if (name in result) {
	          var child = result[name];
	          delete result[name];
	          Object.keys(child).forEach(function (prop) {
	            result[name + '.' + prop] = child[prop];
	          });
	        }
	      }
	      merge('blend');
	      merge('depth');
	      merge('cull');
	      merge('stencil');
	      merge('polygonOffset');
	      merge('scissor');
	      merge('sample');

	      if ('vao' in options) {
	        result.vao = options.vao;
	      }

	      return result
	    }

	    function separateDynamic (object, useArrays) {
	      var staticItems = {};
	      var dynamicItems = {};
	      Object.keys(object).forEach(function (option) {
	        var value = object[option];
	        if (dynamic.isDynamic(value)) {
	          dynamicItems[option] = dynamic.unbox(value, option);
	          return
	        } else if (useArrays && Array.isArray(value)) {
	          for (var i = 0; i < value.length; ++i) {
	            if (dynamic.isDynamic(value[i])) {
	              dynamicItems[option] = dynamic.unbox(value, option);
	              return
	            }
	          }
	        }
	        staticItems[option] = value;
	      });
	      return {
	        dynamic: dynamicItems,
	        static: staticItems
	      }
	    }

	    // Treat context variables separate from other dynamic variables
	    var context = separateDynamic(options.context || {}, true);
	    var uniforms = separateDynamic(options.uniforms || {}, true);
	    var attributes = separateDynamic(options.attributes || {}, false);
	    var opts = separateDynamic(flattenNestedOptions(options), false);

	    var stats$$1 = {
	      gpuTime: 0.0,
	      cpuTime: 0.0,
	      count: 0
	    };

	    var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

	    var draw = compiled.draw;
	    var batch = compiled.batch;
	    var scope = compiled.scope;

	    // FIXME: we should modify code generation for batch commands so this
	    // isn't necessary
	    var EMPTY_ARRAY = [];
	    function reserve (count) {
	      while (EMPTY_ARRAY.length < count) {
	        EMPTY_ARRAY.push(null);
	      }
	      return EMPTY_ARRAY
	    }

	    function REGLCommand (args, body) {
	      var i;
	      if (contextLost) {
	        check$1.raise('context lost');
	      }
	      if (typeof args === 'function') {
	        return scope.call(this, null, args, 0)
	      } else if (typeof body === 'function') {
	        if (typeof args === 'number') {
	          for (i = 0; i < args; ++i) {
	            scope.call(this, null, body, i);
	          }
	        } else if (Array.isArray(args)) {
	          for (i = 0; i < args.length; ++i) {
	            scope.call(this, args[i], body, i);
	          }
	        } else {
	          return scope.call(this, args, body, 0)
	        }
	      } else if (typeof args === 'number') {
	        if (args > 0) {
	          return batch.call(this, reserve(args | 0), args | 0)
	        }
	      } else if (Array.isArray(args)) {
	        if (args.length) {
	          return batch.call(this, args, args.length)
	        }
	      } else {
	        return draw.call(this, args)
	      }
	    }

	    return extend(REGLCommand, {
	      stats: stats$$1,
	      destroy: function () {
	        compiled.destroy();
	      }
	    })
	  }

	  var setFBO = framebufferState.setFBO = compileProcedure({
	    framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
	  });

	  function clearImpl (_, options) {
	    var clearFlags = 0;
	    core.procs.poll();

	    var c = options.color;
	    if (c) {
	      gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
	      clearFlags |= GL_COLOR_BUFFER_BIT;
	    }
	    if ('depth' in options) {
	      gl.clearDepth(+options.depth);
	      clearFlags |= GL_DEPTH_BUFFER_BIT;
	    }
	    if ('stencil' in options) {
	      gl.clearStencil(options.stencil | 0);
	      clearFlags |= GL_STENCIL_BUFFER_BIT;
	    }

	    check$1(!!clearFlags, 'called regl.clear with no buffer specified');
	    gl.clear(clearFlags);
	  }

	  function clear (options) {
	    check$1(
	      typeof options === 'object' && options,
	      'regl.clear() takes an object as input');
	    if ('framebuffer' in options) {
	      if (options.framebuffer &&
	          options.framebuffer_reglType === 'framebufferCube') {
	        for (var i = 0; i < 6; ++i) {
	          setFBO(extend({
	            framebuffer: options.framebuffer.faces[i]
	          }, options), clearImpl);
	        }
	      } else {
	        setFBO(options, clearImpl);
	      }
	    } else {
	      clearImpl(null, options);
	    }
	  }

	  function frame (cb) {
	    check$1.type(cb, 'function', 'regl.frame() callback must be a function');
	    rafCallbacks.push(cb);

	    function cancel () {
	      // FIXME:  should we check something other than equals cb here?
	      // what if a user calls frame twice with the same callback...
	      //
	      var i = find(rafCallbacks, cb);
	      check$1(i >= 0, 'cannot cancel a frame twice');
	      function pendingCancel () {
	        var index = find(rafCallbacks, pendingCancel);
	        rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
	        rafCallbacks.length -= 1;
	        if (rafCallbacks.length <= 0) {
	          stopRAF();
	        }
	      }
	      rafCallbacks[i] = pendingCancel;
	    }

	    startRAF();

	    return {
	      cancel: cancel
	    }
	  }

	  // poll viewport
	  function pollViewport () {
	    var viewport = nextState.viewport;
	    var scissorBox = nextState.scissor_box;
	    viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
	    contextState.viewportWidth =
	      contextState.framebufferWidth =
	      contextState.drawingBufferWidth =
	      viewport[2] =
	      scissorBox[2] = gl.drawingBufferWidth;
	    contextState.viewportHeight =
	      contextState.framebufferHeight =
	      contextState.drawingBufferHeight =
	      viewport[3] =
	      scissorBox[3] = gl.drawingBufferHeight;
	  }

	  function poll () {
	    contextState.tick += 1;
	    contextState.time = now();
	    pollViewport();
	    core.procs.poll();
	  }

	  function refresh () {
	    textureState.refresh();
	    pollViewport();
	    core.procs.refresh();
	    if (timer) {
	      timer.update();
	    }
	  }

	  function now () {
	    return (clock() - START_TIME) / 1000.0
	  }

	  refresh();

	  function addListener (event, callback) {
	    check$1.type(callback, 'function', 'listener callback must be a function');

	    var callbacks;
	    switch (event) {
	      case 'frame':
	        return frame(callback)
	      case 'lost':
	        callbacks = lossCallbacks;
	        break
	      case 'restore':
	        callbacks = restoreCallbacks;
	        break
	      case 'destroy':
	        callbacks = destroyCallbacks;
	        break
	      default:
	        check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
	    }

	    callbacks.push(callback);
	    return {
	      cancel: function () {
	        for (var i = 0; i < callbacks.length; ++i) {
	          if (callbacks[i] === callback) {
	            callbacks[i] = callbacks[callbacks.length - 1];
	            callbacks.pop();
	            return
	          }
	        }
	      }
	    }
	  }

	  var regl = extend(compileProcedure, {
	    // Clear current FBO
	    clear: clear,

	    // Short cuts for dynamic variables
	    prop: dynamic.define.bind(null, DYN_PROP),
	    context: dynamic.define.bind(null, DYN_CONTEXT),
	    this: dynamic.define.bind(null, DYN_STATE),

	    // executes an empty draw command
	    draw: compileProcedure({}),

	    // Resources
	    buffer: function (options) {
	      return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
	    },
	    elements: function (options) {
	      return elementState.create(options, false)
	    },
	    texture: textureState.create2D,
	    cube: textureState.createCube,
	    renderbuffer: renderbufferState.create,
	    framebuffer: framebufferState.create,
	    framebufferCube: framebufferState.createCube,
	    vao: attributeState.createVAO,

	    // Expose context attributes
	    attributes: glAttributes,

	    // Frame rendering
	    frame: frame,
	    on: addListener,

	    // System limits
	    limits: limits,
	    hasExtension: function (name) {
	      return limits.extensions.indexOf(name.toLowerCase()) >= 0
	    },

	    // Read pixels
	    read: readPixels,

	    // Destroy regl and all associated resources
	    destroy: destroy,

	    // Direct GL state manipulation
	    _gl: gl,
	    _refresh: refresh,

	    poll: function () {
	      poll();
	      if (timer) {
	        timer.update();
	      }
	    },

	    // Current time
	    now: now,

	    // regl Statistics Information
	    stats: stats$$1
	  });

	  config.onDone(null, regl);

	  return regl
	}

	return wrapREGL;

	})));

	}(regl));

	var d$1 = regl.exports;

	/**
	 * Common utilities
	 * @module glMatrix
	 */

	// Configuration Constants
	var EPSILON = 0.000001;
	var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
	var RANDOM = Math.random;

	/**
	 * Sets the type of array used when creating new vectors and matrices
	 *
	 * @param {Type} type Array type, such as Float32Array or Array
	 */
	function setMatrixArrayType(type) {
	  ARRAY_TYPE = type;
	}

	var degree = Math.PI / 180;

	/**
	 * Convert Degree To Radian
	 *
	 * @param {Number} a Angle in Degrees
	 */
	function toRadian(a) {
	  return a * degree;
	}

	/**
	 * Tests whether or not the arguments have approximately the same value, within an absolute
	 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
	 * than or equal to 1.0, and a relative tolerance is used for larger values)
	 *
	 * @param {Number} a The first number to test.
	 * @param {Number} b The second number to test.
	 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
	 */
	function equals$9(a, b) {
	  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
	}

	var common = /*#__PURE__*/Object.freeze({
		__proto__: null,
		EPSILON: EPSILON,
		get ARRAY_TYPE () { return ARRAY_TYPE; },
		RANDOM: RANDOM,
		setMatrixArrayType: setMatrixArrayType,
		toRadian: toRadian,
		equals: equals$9
	});

	/**
	 * 2x2 Matrix
	 * @module mat2
	 */

	/**
	 * Creates a new identity mat2
	 *
	 * @returns {mat2} a new 2x2 matrix
	 */
	function create$8() {
	  var out = new ARRAY_TYPE(4);
	  if (ARRAY_TYPE != Float32Array) {
	    out[1] = 0;
	    out[2] = 0;
	  }
	  out[0] = 1;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Creates a new mat2 initialized with values from an existing matrix
	 *
	 * @param {mat2} a matrix to clone
	 * @returns {mat2} a new 2x2 matrix
	 */
	function clone$8(a) {
	  var out = new ARRAY_TYPE(4);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Copy the values from one mat2 to another
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function copy$8(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Set a mat2 to the identity matrix
	 *
	 * @param {mat2} out the receiving matrix
	 * @returns {mat2} out
	 */
	function identity$5(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Create a new mat2 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m10 Component in column 1, row 0 position (index 2)
	 * @param {Number} m11 Component in column 1, row 1 position (index 3)
	 * @returns {mat2} out A new 2x2 matrix
	 */
	function fromValues$8(m00, m01, m10, m11) {
	  var out = new ARRAY_TYPE(4);
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m10;
	  out[3] = m11;
	  return out;
	}

	/**
	 * Set the components of a mat2 to the given values
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m10 Component in column 1, row 0 position (index 2)
	 * @param {Number} m11 Component in column 1, row 1 position (index 3)
	 * @returns {mat2} out
	 */
	function set$8(out, m00, m01, m10, m11) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m10;
	  out[3] = m11;
	  return out;
	}

	/**
	 * Transpose the values of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function transpose$2(out, a) {
	  // If we are transposing ourselves we can skip a few steps but have to cache
	  // some values
	  if (out === a) {
	    var a1 = a[1];
	    out[1] = a[2];
	    out[2] = a1;
	  } else {
	    out[0] = a[0];
	    out[1] = a[2];
	    out[2] = a[1];
	    out[3] = a[3];
	  }

	  return out;
	}

	/**
	 * Inverts a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function invert$5(out, a) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];

	  // Calculate the determinant
	  var det = a0 * a3 - a2 * a1;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = a3 * det;
	  out[1] = -a1 * det;
	  out[2] = -a2 * det;
	  out[3] = a0 * det;

	  return out;
	}

	/**
	 * Calculates the adjugate of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function adjoint$2(out, a) {
	  // Caching this value is nessecary if out == a
	  var a0 = a[0];
	  out[0] = a[3];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = a0;

	  return out;
	}

	/**
	 * Calculates the determinant of a mat2
	 *
	 * @param {mat2} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant$3(a) {
	  return a[0] * a[3] - a[2] * a[1];
	}

	/**
	 * Multiplies two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	function multiply$8(out, a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  out[0] = a0 * b0 + a2 * b1;
	  out[1] = a1 * b0 + a3 * b1;
	  out[2] = a0 * b2 + a2 * b3;
	  out[3] = a1 * b2 + a3 * b3;
	  return out;
	}

	/**
	 * Rotates a mat2 by the given angle
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	function rotate$4(out, a, rad) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  out[0] = a0 * c + a2 * s;
	  out[1] = a1 * c + a3 * s;
	  out[2] = a0 * -s + a2 * c;
	  out[3] = a1 * -s + a3 * c;
	  return out;
	}

	/**
	 * Scales the mat2 by the dimensions in the given vec2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2} out
	 **/
	function scale$8(out, a, v) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var v0 = v[0],
	      v1 = v[1];
	  out[0] = a0 * v0;
	  out[1] = a1 * v0;
	  out[2] = a2 * v1;
	  out[3] = a3 * v1;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.rotate(dest, dest, rad);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	function fromRotation$4(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  out[0] = c;
	  out[1] = s;
	  out[2] = -s;
	  out[3] = c;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.scale(dest, dest, vec);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2} out
	 */
	function fromScaling$3(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = v[1];
	  return out;
	}

	/**
	 * Returns a string representation of a mat2
	 *
	 * @param {mat2} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str$8(a) {
	  return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat2
	 *
	 * @param {mat2} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob$3(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
	}

	/**
	 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
	 * @param {mat2} L the lower triangular matrix
	 * @param {mat2} D the diagonal matrix
	 * @param {mat2} U the upper triangular matrix
	 * @param {mat2} a the input matrix to factorize
	 */

	function LDU(L, D, U, a) {
	  L[2] = a[2] / a[0];
	  U[0] = a[0];
	  U[1] = a[1];
	  U[3] = a[3] - L[2] * U[1];
	  return [L, D, U];
	}

	/**
	 * Adds two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	function add$8(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	function subtract$6(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat2} a The first matrix.
	 * @param {mat2} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals$8(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat2} a The first matrix.
	 * @param {mat2} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals$8(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat2} out
	 */
	function multiplyScalar$3(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  return out;
	}

	/**
	 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat2} out the receiving vector
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat2} out
	 */
	function multiplyScalarAndAdd$3(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  return out;
	}

	/**
	 * Alias for {@link mat2.multiply}
	 * @function
	 */
	var mul$8 = multiply$8;

	/**
	 * Alias for {@link mat2.subtract}
	 * @function
	 */
	var sub$6 = subtract$6;

	var mat2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$8,
		clone: clone$8,
		copy: copy$8,
		identity: identity$5,
		fromValues: fromValues$8,
		set: set$8,
		transpose: transpose$2,
		invert: invert$5,
		adjoint: adjoint$2,
		determinant: determinant$3,
		multiply: multiply$8,
		rotate: rotate$4,
		scale: scale$8,
		fromRotation: fromRotation$4,
		fromScaling: fromScaling$3,
		str: str$8,
		frob: frob$3,
		LDU: LDU,
		add: add$8,
		subtract: subtract$6,
		exactEquals: exactEquals$8,
		equals: equals$8,
		multiplyScalar: multiplyScalar$3,
		multiplyScalarAndAdd: multiplyScalarAndAdd$3,
		mul: mul$8,
		sub: sub$6
	});

	/**
	 * 2x3 Matrix
	 * @module mat2d
	 *
	 * @description
	 * A mat2d contains six elements defined as:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty]
	 * </pre>
	 * This is a short form for the 3x3 matrix:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty,
	 *  0, 0, 1]
	 * </pre>
	 * The last row is ignored so the array is shorter and operations are faster.
	 */

	/**
	 * Creates a new identity mat2d
	 *
	 * @returns {mat2d} a new 2x3 matrix
	 */
	function create$7() {
	  var out = new ARRAY_TYPE(6);
	  if (ARRAY_TYPE != Float32Array) {
	    out[1] = 0;
	    out[2] = 0;
	    out[4] = 0;
	    out[5] = 0;
	  }
	  out[0] = 1;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Creates a new mat2d initialized with values from an existing matrix
	 *
	 * @param {mat2d} a matrix to clone
	 * @returns {mat2d} a new 2x3 matrix
	 */
	function clone$7(a) {
	  var out = new ARRAY_TYPE(6);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  return out;
	}

	/**
	 * Copy the values from one mat2d to another
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	function copy$7(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  return out;
	}

	/**
	 * Set a mat2d to the identity matrix
	 *
	 * @param {mat2d} out the receiving matrix
	 * @returns {mat2d} out
	 */
	function identity$4(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Create a new mat2d with the given values
	 *
	 * @param {Number} a Component A (index 0)
	 * @param {Number} b Component B (index 1)
	 * @param {Number} c Component C (index 2)
	 * @param {Number} d Component D (index 3)
	 * @param {Number} tx Component TX (index 4)
	 * @param {Number} ty Component TY (index 5)
	 * @returns {mat2d} A new mat2d
	 */
	function fromValues$7(a, b, c, d, tx, ty) {
	  var out = new ARRAY_TYPE(6);
	  out[0] = a;
	  out[1] = b;
	  out[2] = c;
	  out[3] = d;
	  out[4] = tx;
	  out[5] = ty;
	  return out;
	}

	/**
	 * Set the components of a mat2d to the given values
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {Number} a Component A (index 0)
	 * @param {Number} b Component B (index 1)
	 * @param {Number} c Component C (index 2)
	 * @param {Number} d Component D (index 3)
	 * @param {Number} tx Component TX (index 4)
	 * @param {Number} ty Component TY (index 5)
	 * @returns {mat2d} out
	 */
	function set$7(out, a, b, c, d, tx, ty) {
	  out[0] = a;
	  out[1] = b;
	  out[2] = c;
	  out[3] = d;
	  out[4] = tx;
	  out[5] = ty;
	  return out;
	}

	/**
	 * Inverts a mat2d
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	function invert$4(out, a) {
	  var aa = a[0],
	      ab = a[1],
	      ac = a[2],
	      ad = a[3];
	  var atx = a[4],
	      aty = a[5];

	  var det = aa * ad - ab * ac;
	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = ad * det;
	  out[1] = -ab * det;
	  out[2] = -ac * det;
	  out[3] = aa * det;
	  out[4] = (ac * aty - ad * atx) * det;
	  out[5] = (ab * atx - aa * aty) * det;
	  return out;
	}

	/**
	 * Calculates the determinant of a mat2d
	 *
	 * @param {mat2d} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant$2(a) {
	  return a[0] * a[3] - a[1] * a[2];
	}

	/**
	 * Multiplies two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	function multiply$7(out, a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5];
	  out[0] = a0 * b0 + a2 * b1;
	  out[1] = a1 * b0 + a3 * b1;
	  out[2] = a0 * b2 + a2 * b3;
	  out[3] = a1 * b2 + a3 * b3;
	  out[4] = a0 * b4 + a2 * b5 + a4;
	  out[5] = a1 * b4 + a3 * b5 + a5;
	  return out;
	}

	/**
	 * Rotates a mat2d by the given angle
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	function rotate$3(out, a, rad) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  out[0] = a0 * c + a2 * s;
	  out[1] = a1 * c + a3 * s;
	  out[2] = a0 * -s + a2 * c;
	  out[3] = a1 * -s + a3 * c;
	  out[4] = a4;
	  out[5] = a5;
	  return out;
	}

	/**
	 * Scales the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2d} out
	 **/
	function scale$7(out, a, v) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var v0 = v[0],
	      v1 = v[1];
	  out[0] = a0 * v0;
	  out[1] = a1 * v0;
	  out[2] = a2 * v1;
	  out[3] = a3 * v1;
	  out[4] = a4;
	  out[5] = a5;
	  return out;
	}

	/**
	 * Translates the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to translate the matrix by
	 * @returns {mat2d} out
	 **/
	function translate$3(out, a, v) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var v0 = v[0],
	      v1 = v[1];
	  out[0] = a0;
	  out[1] = a1;
	  out[2] = a2;
	  out[3] = a3;
	  out[4] = a0 * v0 + a2 * v1 + a4;
	  out[5] = a1 * v0 + a3 * v1 + a5;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.rotate(dest, dest, rad);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	function fromRotation$3(out, rad) {
	  var s = Math.sin(rad),
	      c = Math.cos(rad);
	  out[0] = c;
	  out[1] = s;
	  out[2] = -s;
	  out[3] = c;
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.scale(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2d} out
	 */
	function fromScaling$2(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = v[1];
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.translate(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat2d} out
	 */
	function fromTranslation$3(out, v) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = v[0];
	  out[5] = v[1];
	  return out;
	}

	/**
	 * Returns a string representation of a mat2d
	 *
	 * @param {mat2d} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str$7(a) {
	  return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat2d
	 *
	 * @param {mat2d} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob$2(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
	}

	/**
	 * Adds two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	function add$7(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	function subtract$5(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  out[4] = a[4] - b[4];
	  out[5] = a[5] - b[5];
	  return out;
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat2d} out
	 */
	function multiplyScalar$2(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  return out;
	}

	/**
	 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat2d} out the receiving vector
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat2d} out
	 */
	function multiplyScalarAndAdd$2(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  out[4] = a[4] + b[4] * scale;
	  out[5] = a[5] + b[5] * scale;
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat2d} a The first matrix.
	 * @param {mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals$7(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat2d} a The first matrix.
	 * @param {mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals$7(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
	}

	/**
	 * Alias for {@link mat2d.multiply}
	 * @function
	 */
	var mul$7 = multiply$7;

	/**
	 * Alias for {@link mat2d.subtract}
	 * @function
	 */
	var sub$5 = subtract$5;

	var mat2d = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$7,
		clone: clone$7,
		copy: copy$7,
		identity: identity$4,
		fromValues: fromValues$7,
		set: set$7,
		invert: invert$4,
		determinant: determinant$2,
		multiply: multiply$7,
		rotate: rotate$3,
		scale: scale$7,
		translate: translate$3,
		fromRotation: fromRotation$3,
		fromScaling: fromScaling$2,
		fromTranslation: fromTranslation$3,
		str: str$7,
		frob: frob$2,
		add: add$7,
		subtract: subtract$5,
		multiplyScalar: multiplyScalar$2,
		multiplyScalarAndAdd: multiplyScalarAndAdd$2,
		exactEquals: exactEquals$7,
		equals: equals$7,
		mul: mul$7,
		sub: sub$5
	});

	/**
	 * 3x3 Matrix
	 * @module mat3
	 */

	/**
	 * Creates a new identity mat3
	 *
	 * @returns {mat3} a new 3x3 matrix
	 */
	function create$6() {
	  var out = new ARRAY_TYPE(9);
	  if (ARRAY_TYPE != Float32Array) {
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[5] = 0;
	    out[6] = 0;
	    out[7] = 0;
	  }
	  out[0] = 1;
	  out[4] = 1;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Copies the upper-left 3x3 values into the given mat3.
	 *
	 * @param {mat3} out the receiving 3x3 matrix
	 * @param {mat4} a   the source 4x4 matrix
	 * @returns {mat3} out
	 */
	function fromMat4$1(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[4];
	  out[4] = a[5];
	  out[5] = a[6];
	  out[6] = a[8];
	  out[7] = a[9];
	  out[8] = a[10];
	  return out;
	}

	/**
	 * Creates a new mat3 initialized with values from an existing matrix
	 *
	 * @param {mat3} a matrix to clone
	 * @returns {mat3} a new 3x3 matrix
	 */
	function clone$6(a) {
	  var out = new ARRAY_TYPE(9);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}

	/**
	 * Copy the values from one mat3 to another
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function copy$6(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}

	/**
	 * Create a new mat3 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} A new mat3
	 */
	function fromValues$6(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	  var out = new ARRAY_TYPE(9);
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m10;
	  out[4] = m11;
	  out[5] = m12;
	  out[6] = m20;
	  out[7] = m21;
	  out[8] = m22;
	  return out;
	}

	/**
	 * Set the components of a mat3 to the given values
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} out
	 */
	function set$6(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m10;
	  out[4] = m11;
	  out[5] = m12;
	  out[6] = m20;
	  out[7] = m21;
	  out[8] = m22;
	  return out;
	}

	/**
	 * Set a mat3 to the identity matrix
	 *
	 * @param {mat3} out the receiving matrix
	 * @returns {mat3} out
	 */
	function identity$3(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 1;
	  out[5] = 0;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Transpose the values of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function transpose$1(out, a) {
	  // If we are transposing ourselves we can skip a few steps but have to cache some values
	  if (out === a) {
	    var a01 = a[1],
	        a02 = a[2],
	        a12 = a[5];
	    out[1] = a[3];
	    out[2] = a[6];
	    out[3] = a01;
	    out[5] = a[7];
	    out[6] = a02;
	    out[7] = a12;
	  } else {
	    out[0] = a[0];
	    out[1] = a[3];
	    out[2] = a[6];
	    out[3] = a[1];
	    out[4] = a[4];
	    out[5] = a[7];
	    out[6] = a[2];
	    out[7] = a[5];
	    out[8] = a[8];
	  }

	  return out;
	}

	/**
	 * Inverts a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function invert$3(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  var b01 = a22 * a11 - a12 * a21;
	  var b11 = -a22 * a10 + a12 * a20;
	  var b21 = a21 * a10 - a11 * a20;

	  // Calculate the determinant
	  var det = a00 * b01 + a01 * b11 + a02 * b21;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = b01 * det;
	  out[1] = (-a22 * a01 + a02 * a21) * det;
	  out[2] = (a12 * a01 - a02 * a11) * det;
	  out[3] = b11 * det;
	  out[4] = (a22 * a00 - a02 * a20) * det;
	  out[5] = (-a12 * a00 + a02 * a10) * det;
	  out[6] = b21 * det;
	  out[7] = (-a21 * a00 + a01 * a20) * det;
	  out[8] = (a11 * a00 - a01 * a10) * det;
	  return out;
	}

	/**
	 * Calculates the adjugate of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function adjoint$1(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  out[0] = a11 * a22 - a12 * a21;
	  out[1] = a02 * a21 - a01 * a22;
	  out[2] = a01 * a12 - a02 * a11;
	  out[3] = a12 * a20 - a10 * a22;
	  out[4] = a00 * a22 - a02 * a20;
	  out[5] = a02 * a10 - a00 * a12;
	  out[6] = a10 * a21 - a11 * a20;
	  out[7] = a01 * a20 - a00 * a21;
	  out[8] = a00 * a11 - a01 * a10;
	  return out;
	}

	/**
	 * Calculates the determinant of a mat3
	 *
	 * @param {mat3} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant$1(a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
	}

	/**
	 * Multiplies two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	function multiply$6(out, a, b) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  var b00 = b[0],
	      b01 = b[1],
	      b02 = b[2];
	  var b10 = b[3],
	      b11 = b[4],
	      b12 = b[5];
	  var b20 = b[6],
	      b21 = b[7],
	      b22 = b[8];

	  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

	  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

	  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	  return out;
	}

	/**
	 * Translate a mat3 by the given vector
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to translate
	 * @param {vec2} v vector to translate by
	 * @returns {mat3} out
	 */
	function translate$2(out, a, v) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a10 = a[3],
	      a11 = a[4],
	      a12 = a[5],
	      a20 = a[6],
	      a21 = a[7],
	      a22 = a[8],
	      x = v[0],
	      y = v[1];

	  out[0] = a00;
	  out[1] = a01;
	  out[2] = a02;

	  out[3] = a10;
	  out[4] = a11;
	  out[5] = a12;

	  out[6] = x * a00 + y * a10 + a20;
	  out[7] = x * a01 + y * a11 + a21;
	  out[8] = x * a02 + y * a12 + a22;
	  return out;
	}

	/**
	 * Rotates a mat3 by the given angle
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	function rotate$2(out, a, rad) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a10 = a[3],
	      a11 = a[4],
	      a12 = a[5],
	      a20 = a[6],
	      a21 = a[7],
	      a22 = a[8],
	      s = Math.sin(rad),
	      c = Math.cos(rad);

	  out[0] = c * a00 + s * a10;
	  out[1] = c * a01 + s * a11;
	  out[2] = c * a02 + s * a12;

	  out[3] = c * a10 - s * a00;
	  out[4] = c * a11 - s * a01;
	  out[5] = c * a12 - s * a02;

	  out[6] = a20;
	  out[7] = a21;
	  out[8] = a22;
	  return out;
	}
	/**
	 * Scales the mat3 by the dimensions in the given vec2
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat3} out
	 **/
	function scale$6(out, a, v) {
	  var x = v[0],
	      y = v[1];

	  out[0] = x * a[0];
	  out[1] = x * a[1];
	  out[2] = x * a[2];

	  out[3] = y * a[3];
	  out[4] = y * a[4];
	  out[5] = y * a[5];

	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.translate(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat3} out
	 */
	function fromTranslation$2(out, v) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 1;
	  out[5] = 0;
	  out[6] = v[0];
	  out[7] = v[1];
	  out[8] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.rotate(dest, dest, rad);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	function fromRotation$2(out, rad) {
	  var s = Math.sin(rad),
	      c = Math.cos(rad);

	  out[0] = c;
	  out[1] = s;
	  out[2] = 0;

	  out[3] = -s;
	  out[4] = c;
	  out[5] = 0;

	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.scale(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat3} out
	 */
	function fromScaling$1(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;

	  out[3] = 0;
	  out[4] = v[1];
	  out[5] = 0;

	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Copies the values from a mat2d into a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat2d} a the matrix to copy
	 * @returns {mat3} out
	 **/
	function fromMat2d(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = 0;

	  out[3] = a[2];
	  out[4] = a[3];
	  out[5] = 0;

	  out[6] = a[4];
	  out[7] = a[5];
	  out[8] = 1;
	  return out;
	}

	/**
	* Calculates a 3x3 matrix from the given quaternion
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {quat} q Quaternion to create matrix from
	*
	* @returns {mat3} out
	*/
	function fromQuat$1(out, q) {
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var yx = y * x2;
	  var yy = y * y2;
	  var zx = z * x2;
	  var zy = z * y2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  out[0] = 1 - yy - zz;
	  out[3] = yx - wz;
	  out[6] = zx + wy;

	  out[1] = yx + wz;
	  out[4] = 1 - xx - zz;
	  out[7] = zy - wx;

	  out[2] = zx - wy;
	  out[5] = zy + wx;
	  out[8] = 1 - xx - yy;

	  return out;
	}

	/**
	* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {mat4} a Mat4 to derive the normal matrix from
	*
	* @returns {mat3} out
	*/
	function normalFromMat4(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  var b00 = a00 * a11 - a01 * a10;
	  var b01 = a00 * a12 - a02 * a10;
	  var b02 = a00 * a13 - a03 * a10;
	  var b03 = a01 * a12 - a02 * a11;
	  var b04 = a01 * a13 - a03 * a11;
	  var b05 = a02 * a13 - a03 * a12;
	  var b06 = a20 * a31 - a21 * a30;
	  var b07 = a20 * a32 - a22 * a30;
	  var b08 = a20 * a33 - a23 * a30;
	  var b09 = a21 * a32 - a22 * a31;
	  var b10 = a21 * a33 - a23 * a31;
	  var b11 = a22 * a33 - a23 * a32;

	  // Calculate the determinant
	  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

	  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

	  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

	  return out;
	}

	/**
	 * Generates a 2D projection matrix with the given bounds
	 *
	 * @param {mat3} out mat3 frustum matrix will be written into
	 * @param {number} width Width of your gl context
	 * @param {number} height Height of gl context
	 * @returns {mat3} out
	 */
	function projection(out, width, height) {
	  out[0] = 2 / width;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = -2 / height;
	  out[5] = 0;
	  out[6] = -1;
	  out[7] = 1;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Returns a string representation of a mat3
	 *
	 * @param {mat3} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str$6(a) {
	  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat3
	 *
	 * @param {mat3} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob$1(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
	}

	/**
	 * Adds two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	function add$6(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  out[6] = a[6] + b[6];
	  out[7] = a[7] + b[7];
	  out[8] = a[8] + b[8];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	function subtract$4(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  out[4] = a[4] - b[4];
	  out[5] = a[5] - b[5];
	  out[6] = a[6] - b[6];
	  out[7] = a[7] - b[7];
	  out[8] = a[8] - b[8];
	  return out;
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat3} out
	 */
	function multiplyScalar$1(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  out[6] = a[6] * b;
	  out[7] = a[7] * b;
	  out[8] = a[8] * b;
	  return out;
	}

	/**
	 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat3} out the receiving vector
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat3} out
	 */
	function multiplyScalarAndAdd$1(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  out[4] = a[4] + b[4] * scale;
	  out[5] = a[5] + b[5] * scale;
	  out[6] = a[6] + b[6] * scale;
	  out[7] = a[7] + b[7] * scale;
	  out[8] = a[8] + b[8] * scale;
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat3} a The first matrix.
	 * @param {mat3} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals$6(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat3} a The first matrix.
	 * @param {mat3} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals$6(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5],
	      a6 = a[6],
	      a7 = a[7],
	      a8 = a[8];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5],
	      b6 = b[6],
	      b7 = b[7],
	      b8 = b[8];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
	}

	/**
	 * Alias for {@link mat3.multiply}
	 * @function
	 */
	var mul$6 = multiply$6;

	/**
	 * Alias for {@link mat3.subtract}
	 * @function
	 */
	var sub$4 = subtract$4;

	var mat3 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$6,
		fromMat4: fromMat4$1,
		clone: clone$6,
		copy: copy$6,
		fromValues: fromValues$6,
		set: set$6,
		identity: identity$3,
		transpose: transpose$1,
		invert: invert$3,
		adjoint: adjoint$1,
		determinant: determinant$1,
		multiply: multiply$6,
		translate: translate$2,
		rotate: rotate$2,
		scale: scale$6,
		fromTranslation: fromTranslation$2,
		fromRotation: fromRotation$2,
		fromScaling: fromScaling$1,
		fromMat2d: fromMat2d,
		fromQuat: fromQuat$1,
		normalFromMat4: normalFromMat4,
		projection: projection,
		str: str$6,
		frob: frob$1,
		add: add$6,
		subtract: subtract$4,
		multiplyScalar: multiplyScalar$1,
		multiplyScalarAndAdd: multiplyScalarAndAdd$1,
		exactEquals: exactEquals$6,
		equals: equals$6,
		mul: mul$6,
		sub: sub$4
	});

	/**
	 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
	 * @module mat4
	 */

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	function create$5() {
	  var out = new ARRAY_TYPE(16);
	  if (ARRAY_TYPE != Float32Array) {
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	  }
	  out[0] = 1;
	  out[5] = 1;
	  out[10] = 1;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	function clone$5(a) {
	  var out = new ARRAY_TYPE(16);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  out[9] = a[9];
	  out[10] = a[10];
	  out[11] = a[11];
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}

	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function copy$5(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  out[9] = a[9];
	  out[10] = a[10];
	  out[11] = a[11];
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}

	/**
	 * Create a new mat4 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} A new mat4
	 */
	function fromValues$5(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	  var out = new ARRAY_TYPE(16);
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m03;
	  out[4] = m10;
	  out[5] = m11;
	  out[6] = m12;
	  out[7] = m13;
	  out[8] = m20;
	  out[9] = m21;
	  out[10] = m22;
	  out[11] = m23;
	  out[12] = m30;
	  out[13] = m31;
	  out[14] = m32;
	  out[15] = m33;
	  return out;
	}

	/**
	 * Set the components of a mat4 to the given values
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} out
	 */
	function set$5(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m03;
	  out[4] = m10;
	  out[5] = m11;
	  out[6] = m12;
	  out[7] = m13;
	  out[8] = m20;
	  out[9] = m21;
	  out[10] = m22;
	  out[11] = m23;
	  out[12] = m30;
	  out[13] = m31;
	  out[14] = m32;
	  out[15] = m33;
	  return out;
	}

	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	function identity$2(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function transpose(out, a) {
	  // If we are transposing ourselves we can skip a few steps but have to cache some values
	  if (out === a) {
	    var a01 = a[1],
	        a02 = a[2],
	        a03 = a[3];
	    var a12 = a[6],
	        a13 = a[7];
	    var a23 = a[11];

	    out[1] = a[4];
	    out[2] = a[8];
	    out[3] = a[12];
	    out[4] = a01;
	    out[6] = a[9];
	    out[7] = a[13];
	    out[8] = a02;
	    out[9] = a12;
	    out[11] = a[14];
	    out[12] = a03;
	    out[13] = a13;
	    out[14] = a23;
	  } else {
	    out[0] = a[0];
	    out[1] = a[4];
	    out[2] = a[8];
	    out[3] = a[12];
	    out[4] = a[1];
	    out[5] = a[5];
	    out[6] = a[9];
	    out[7] = a[13];
	    out[8] = a[2];
	    out[9] = a[6];
	    out[10] = a[10];
	    out[11] = a[14];
	    out[12] = a[3];
	    out[13] = a[7];
	    out[14] = a[11];
	    out[15] = a[15];
	  }

	  return out;
	}

	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function invert$2(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  var b00 = a00 * a11 - a01 * a10;
	  var b01 = a00 * a12 - a02 * a10;
	  var b02 = a00 * a13 - a03 * a10;
	  var b03 = a01 * a12 - a02 * a11;
	  var b04 = a01 * a13 - a03 * a11;
	  var b05 = a02 * a13 - a03 * a12;
	  var b06 = a20 * a31 - a21 * a30;
	  var b07 = a20 * a32 - a22 * a30;
	  var b08 = a20 * a33 - a23 * a30;
	  var b09 = a21 * a32 - a22 * a31;
	  var b10 = a21 * a33 - a23 * a31;
	  var b11 = a22 * a33 - a23 * a32;

	  // Calculate the determinant
	  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	  return out;
	}

	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function adjoint(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
	  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
	  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
	  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
	  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
	  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
	  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
	  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
	  return out;
	}

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  var b00 = a00 * a11 - a01 * a10;
	  var b01 = a00 * a12 - a02 * a10;
	  var b02 = a00 * a13 - a03 * a10;
	  var b03 = a01 * a12 - a02 * a11;
	  var b04 = a01 * a13 - a03 * a11;
	  var b05 = a02 * a13 - a03 * a12;
	  var b06 = a20 * a31 - a21 * a30;
	  var b07 = a20 * a32 - a22 * a30;
	  var b08 = a20 * a33 - a23 * a30;
	  var b09 = a21 * a32 - a22 * a31;
	  var b10 = a21 * a33 - a23 * a31;
	  var b11 = a22 * a33 - a23 * a32;

	  // Calculate the determinant
	  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	}

	/**
	 * Multiplies two mat4s
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function multiply$5(out, a, b) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  // Cache only the current line of the second matrix
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	  b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];
	  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	  b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];
	  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	  b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];
	  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  return out;
	}

	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	function translate$1(out, a, v) {
	  var x = v[0],
	      y = v[1],
	      z = v[2];
	  var a00 = void 0,
	      a01 = void 0,
	      a02 = void 0,
	      a03 = void 0;
	  var a10 = void 0,
	      a11 = void 0,
	      a12 = void 0,
	      a13 = void 0;
	  var a20 = void 0,
	      a21 = void 0,
	      a22 = void 0,
	      a23 = void 0;

	  if (a === out) {
	    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	  } else {
	    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	    out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
	    out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
	    out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

	    out[12] = a00 * x + a10 * y + a20 * z + a[12];
	    out[13] = a01 * x + a11 * y + a21 * z + a[13];
	    out[14] = a02 * x + a12 * y + a22 * z + a[14];
	    out[15] = a03 * x + a13 * y + a23 * z + a[15];
	  }

	  return out;
	}

	/**
	 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	function scale$5(out, a, v) {
	  var x = v[0],
	      y = v[1],
	      z = v[2];

	  out[0] = a[0] * x;
	  out[1] = a[1] * x;
	  out[2] = a[2] * x;
	  out[3] = a[3] * x;
	  out[4] = a[4] * y;
	  out[5] = a[5] * y;
	  out[6] = a[6] * y;
	  out[7] = a[7] * y;
	  out[8] = a[8] * z;
	  out[9] = a[9] * z;
	  out[10] = a[10] * z;
	  out[11] = a[11] * z;
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}

	/**
	 * Rotates a mat4 by the given angle around the given axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function rotate$1(out, a, rad, axis) {
	  var x = axis[0],
	      y = axis[1],
	      z = axis[2];
	  var len = Math.sqrt(x * x + y * y + z * z);
	  var s = void 0,
	      c = void 0,
	      t = void 0;
	  var a00 = void 0,
	      a01 = void 0,
	      a02 = void 0,
	      a03 = void 0;
	  var a10 = void 0,
	      a11 = void 0,
	      a12 = void 0,
	      a13 = void 0;
	  var a20 = void 0,
	      a21 = void 0,
	      a22 = void 0,
	      a23 = void 0;
	  var b00 = void 0,
	      b01 = void 0,
	      b02 = void 0;
	  var b10 = void 0,
	      b11 = void 0,
	      b12 = void 0;
	  var b20 = void 0,
	      b21 = void 0,
	      b22 = void 0;

	  if (len < EPSILON) {
	    return null;
	  }

	  len = 1 / len;
	  x *= len;
	  y *= len;
	  z *= len;

	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  t = 1 - c;

	  a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	  a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	  a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	  // Construct the elements of the rotation matrix
	  b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
	  b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
	  b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

	  // Perform rotation-specific matrix multiplication
	  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged last row
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }
	  return out;
	}

	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateX$3(out, a, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  var a10 = a[4];
	  var a11 = a[5];
	  var a12 = a[6];
	  var a13 = a[7];
	  var a20 = a[8];
	  var a21 = a[9];
	  var a22 = a[10];
	  var a23 = a[11];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged rows
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }

	  // Perform axis-specific matrix multiplication
	  out[4] = a10 * c + a20 * s;
	  out[5] = a11 * c + a21 * s;
	  out[6] = a12 * c + a22 * s;
	  out[7] = a13 * c + a23 * s;
	  out[8] = a20 * c - a10 * s;
	  out[9] = a21 * c - a11 * s;
	  out[10] = a22 * c - a12 * s;
	  out[11] = a23 * c - a13 * s;
	  return out;
	}

	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateY$3(out, a, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  var a00 = a[0];
	  var a01 = a[1];
	  var a02 = a[2];
	  var a03 = a[3];
	  var a20 = a[8];
	  var a21 = a[9];
	  var a22 = a[10];
	  var a23 = a[11];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged rows
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }

	  // Perform axis-specific matrix multiplication
	  out[0] = a00 * c - a20 * s;
	  out[1] = a01 * c - a21 * s;
	  out[2] = a02 * c - a22 * s;
	  out[3] = a03 * c - a23 * s;
	  out[8] = a00 * s + a20 * c;
	  out[9] = a01 * s + a21 * c;
	  out[10] = a02 * s + a22 * c;
	  out[11] = a03 * s + a23 * c;
	  return out;
	}

	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateZ$3(out, a, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  var a00 = a[0];
	  var a01 = a[1];
	  var a02 = a[2];
	  var a03 = a[3];
	  var a10 = a[4];
	  var a11 = a[5];
	  var a12 = a[6];
	  var a13 = a[7];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged last row
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }

	  // Perform axis-specific matrix multiplication
	  out[0] = a00 * c + a10 * s;
	  out[1] = a01 * c + a11 * s;
	  out[2] = a02 * c + a12 * s;
	  out[3] = a03 * c + a13 * s;
	  out[4] = a10 * c - a00 * s;
	  out[5] = a11 * c - a01 * s;
	  out[6] = a12 * c - a02 * s;
	  out[7] = a13 * c - a03 * s;
	  return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromTranslation$1(out, v) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.scale(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Scaling vector
	 * @returns {mat4} out
	 */
	function fromScaling(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = v[1];
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = v[2];
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle around a given axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotate(dest, dest, rad, axis);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function fromRotation$1(out, rad, axis) {
	  var x = axis[0],
	      y = axis[1],
	      z = axis[2];
	  var len = Math.sqrt(x * x + y * y + z * z);
	  var s = void 0,
	      c = void 0,
	      t = void 0;

	  if (len < EPSILON) {
	    return null;
	  }

	  len = 1 / len;
	  x *= len;
	  y *= len;
	  z *= len;

	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  t = 1 - c;

	  // Perform rotation-specific matrix multiplication
	  out[0] = x * x * t + c;
	  out[1] = y * x * t + z * s;
	  out[2] = z * x * t - y * s;
	  out[3] = 0;
	  out[4] = x * y * t - z * s;
	  out[5] = y * y * t + c;
	  out[6] = z * y * t + x * s;
	  out[7] = 0;
	  out[8] = x * z * t + y * s;
	  out[9] = y * z * t - x * s;
	  out[10] = z * z * t + c;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from the given angle around the X axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateX(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function fromXRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);

	  // Perform axis-specific matrix multiplication
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = c;
	  out[6] = s;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = -s;
	  out[10] = c;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from the given angle around the Y axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateY(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function fromYRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);

	  // Perform axis-specific matrix multiplication
	  out[0] = c;
	  out[1] = 0;
	  out[2] = -s;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = s;
	  out[9] = 0;
	  out[10] = c;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from the given angle around the Z axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateZ(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function fromZRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);

	  // Perform axis-specific matrix multiplication
	  out[0] = c;
	  out[1] = s;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = -s;
	  out[5] = c;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslation$1(out, q, v) {
	  // Quaternion math
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var xy = x * y2;
	  var xz = x * z2;
	  var yy = y * y2;
	  var yz = y * z2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  out[0] = 1 - (yy + zz);
	  out[1] = xy + wz;
	  out[2] = xz - wy;
	  out[3] = 0;
	  out[4] = xy - wz;
	  out[5] = 1 - (xx + zz);
	  out[6] = yz + wx;
	  out[7] = 0;
	  out[8] = xz + wy;
	  out[9] = yz - wx;
	  out[10] = 1 - (xx + yy);
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;

	  return out;
	}

	/**
	 * Creates a new mat4 from a dual quat.
	 *
	 * @param {mat4} out Matrix
	 * @param {quat2} a Dual Quaternion
	 * @returns {mat4} mat4 receiving operation result
	 */
	function fromQuat2(out, a) {
	  var translation = new ARRAY_TYPE(3);
	  var bx = -a[0],
	      by = -a[1],
	      bz = -a[2],
	      bw = a[3],
	      ax = a[4],
	      ay = a[5],
	      az = a[6],
	      aw = a[7];

	  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
	  //Only scale if it makes sense
	  if (magnitude > 0) {
	    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
	    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
	    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
	  } else {
	    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
	    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
	    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
	  }
	  fromRotationTranslation$1(out, a, translation);
	  return out;
	}

	/**
	 * Returns the translation vector component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslation,
	 *  the returned vector will be the same as the translation vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive translation component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */
	function getTranslation$1(out, mat) {
	  out[0] = mat[12];
	  out[1] = mat[13];
	  out[2] = mat[14];

	  return out;
	}

	/**
	 * Returns the scaling factor component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslationScale
	 *  with a normalized Quaternion paramter, the returned vector will be
	 *  the same as the scaling vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive scaling factor component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */
	function getScaling(out, mat) {
	  var m11 = mat[0];
	  var m12 = mat[1];
	  var m13 = mat[2];
	  var m21 = mat[4];
	  var m22 = mat[5];
	  var m23 = mat[6];
	  var m31 = mat[8];
	  var m32 = mat[9];
	  var m33 = mat[10];

	  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
	  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
	  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

	  return out;
	}

	/**
	 * Returns a quaternion representing the rotational component
	 *  of a transformation matrix. If a matrix is built with
	 *  fromRotationTranslation, the returned quaternion will be the
	 *  same as the quaternion originally supplied.
	 * @param {quat} out Quaternion to receive the rotation component
	 * @param {mat4} mat Matrix to be decomposed (input)
	 * @return {quat} out
	 */
	function getRotation(out, mat) {
	  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	  var trace = mat[0] + mat[5] + mat[10];
	  var S = 0;

	  if (trace > 0) {
	    S = Math.sqrt(trace + 1.0) * 2;
	    out[3] = 0.25 * S;
	    out[0] = (mat[6] - mat[9]) / S;
	    out[1] = (mat[8] - mat[2]) / S;
	    out[2] = (mat[1] - mat[4]) / S;
	  } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
	    out[3] = (mat[6] - mat[9]) / S;
	    out[0] = 0.25 * S;
	    out[1] = (mat[1] + mat[4]) / S;
	    out[2] = (mat[8] + mat[2]) / S;
	  } else if (mat[5] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
	    out[3] = (mat[8] - mat[2]) / S;
	    out[0] = (mat[1] + mat[4]) / S;
	    out[1] = 0.25 * S;
	    out[2] = (mat[6] + mat[9]) / S;
	  } else {
	    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
	    out[3] = (mat[1] - mat[4]) / S;
	    out[0] = (mat[8] + mat[2]) / S;
	    out[1] = (mat[6] + mat[9]) / S;
	    out[2] = 0.25 * S;
	  }

	  return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslationScale(out, q, v, s) {
	  // Quaternion math
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var xy = x * y2;
	  var xz = x * z2;
	  var yy = y * y2;
	  var yz = y * z2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;
	  var sx = s[0];
	  var sy = s[1];
	  var sz = s[2];

	  out[0] = (1 - (yy + zz)) * sx;
	  out[1] = (xy + wz) * sx;
	  out[2] = (xz - wy) * sx;
	  out[3] = 0;
	  out[4] = (xy - wz) * sy;
	  out[5] = (1 - (xx + zz)) * sy;
	  out[6] = (yz + wx) * sy;
	  out[7] = 0;
	  out[8] = (xz + wy) * sz;
	  out[9] = (yz - wx) * sz;
	  out[10] = (1 - (xx + yy)) * sz;
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;

	  return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     mat4.translate(dest, origin);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *     mat4.translate(dest, negativeOrigin);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @param {vec3} o The origin vector around which to scale and rotate
	 * @returns {mat4} out
	 */
	function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
	  // Quaternion math
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var xy = x * y2;
	  var xz = x * z2;
	  var yy = y * y2;
	  var yz = y * z2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  var sx = s[0];
	  var sy = s[1];
	  var sz = s[2];

	  var ox = o[0];
	  var oy = o[1];
	  var oz = o[2];

	  var out0 = (1 - (yy + zz)) * sx;
	  var out1 = (xy + wz) * sx;
	  var out2 = (xz - wy) * sx;
	  var out4 = (xy - wz) * sy;
	  var out5 = (1 - (xx + zz)) * sy;
	  var out6 = (yz + wx) * sy;
	  var out8 = (xz + wy) * sz;
	  var out9 = (yz - wx) * sz;
	  var out10 = (1 - (xx + yy)) * sz;

	  out[0] = out0;
	  out[1] = out1;
	  out[2] = out2;
	  out[3] = 0;
	  out[4] = out4;
	  out[5] = out5;
	  out[6] = out6;
	  out[7] = 0;
	  out[8] = out8;
	  out[9] = out9;
	  out[10] = out10;
	  out[11] = 0;
	  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
	  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
	  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
	  out[15] = 1;

	  return out;
	}

	/**
	 * Calculates a 4x4 matrix from the given quaternion
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat} q Quaternion to create matrix from
	 *
	 * @returns {mat4} out
	 */
	function fromQuat(out, q) {
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var yx = y * x2;
	  var yy = y * y2;
	  var zx = z * x2;
	  var zy = z * y2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  out[0] = 1 - yy - zz;
	  out[1] = yx + wz;
	  out[2] = zx - wy;
	  out[3] = 0;

	  out[4] = yx - wz;
	  out[5] = 1 - xx - zz;
	  out[6] = zy + wx;
	  out[7] = 0;

	  out[8] = zx + wy;
	  out[9] = zy - wx;
	  out[10] = 1 - xx - yy;
	  out[11] = 0;

	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;

	  return out;
	}

	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function frustum(out, left, right, bottom, top, near, far) {
	  var rl = 1 / (right - left);
	  var tb = 1 / (top - bottom);
	  var nf = 1 / (near - far);
	  out[0] = near * 2 * rl;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = near * 2 * tb;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = (right + left) * rl;
	  out[9] = (top + bottom) * tb;
	  out[10] = (far + near) * nf;
	  out[11] = -1;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = far * near * 2 * nf;
	  out[15] = 0;
	  return out;
	}

	/**
	 * Generates a perspective projection matrix with the given bounds.
	 * Passing null/undefined/no value for far will generate infinite projection matrix.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum, can be null or Infinity
	 * @returns {mat4} out
	 */
	function perspective(out, fovy, aspect, near, far) {
	  var f = 1.0 / Math.tan(fovy / 2),
	      nf = void 0;
	  out[0] = f / aspect;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = f;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[11] = -1;
	  out[12] = 0;
	  out[13] = 0;
	  out[15] = 0;
	  if (far != null && far !== Infinity) {
	    nf = 1 / (near - far);
	    out[10] = (far + near) * nf;
	    out[14] = 2 * far * near * nf;
	  } else {
	    out[10] = -1;
	    out[14] = -2 * near;
	  }
	  return out;
	}

	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspectiveFromFieldOfView(out, fov, near, far) {
	  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
	  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
	  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
	  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
	  var xScale = 2.0 / (leftTan + rightTan);
	  var yScale = 2.0 / (upTan + downTan);

	  out[0] = xScale;
	  out[1] = 0.0;
	  out[2] = 0.0;
	  out[3] = 0.0;
	  out[4] = 0.0;
	  out[5] = yScale;
	  out[6] = 0.0;
	  out[7] = 0.0;
	  out[8] = -((leftTan - rightTan) * xScale * 0.5);
	  out[9] = (upTan - downTan) * yScale * 0.5;
	  out[10] = far / (near - far);
	  out[11] = -1.0;
	  out[12] = 0.0;
	  out[13] = 0.0;
	  out[14] = far * near / (near - far);
	  out[15] = 0.0;
	  return out;
	}

	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function ortho(out, left, right, bottom, top, near, far) {
	  var lr = 1 / (left - right);
	  var bt = 1 / (bottom - top);
	  var nf = 1 / (near - far);
	  out[0] = -2 * lr;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = -2 * bt;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 2 * nf;
	  out[11] = 0;
	  out[12] = (left + right) * lr;
	  out[13] = (top + bottom) * bt;
	  out[14] = (far + near) * nf;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis.
	 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	function lookAt(out, eye, center, up) {
	  var x0 = void 0,
	      x1 = void 0,
	      x2 = void 0,
	      y0 = void 0,
	      y1 = void 0,
	      y2 = void 0,
	      z0 = void 0,
	      z1 = void 0,
	      z2 = void 0,
	      len = void 0;
	  var eyex = eye[0];
	  var eyey = eye[1];
	  var eyez = eye[2];
	  var upx = up[0];
	  var upy = up[1];
	  var upz = up[2];
	  var centerx = center[0];
	  var centery = center[1];
	  var centerz = center[2];

	  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
	    return identity$2(out);
	  }

	  z0 = eyex - centerx;
	  z1 = eyey - centery;
	  z2 = eyez - centerz;

	  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	  z0 *= len;
	  z1 *= len;
	  z2 *= len;

	  x0 = upy * z2 - upz * z1;
	  x1 = upz * z0 - upx * z2;
	  x2 = upx * z1 - upy * z0;
	  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	  if (!len) {
	    x0 = 0;
	    x1 = 0;
	    x2 = 0;
	  } else {
	    len = 1 / len;
	    x0 *= len;
	    x1 *= len;
	    x2 *= len;
	  }

	  y0 = z1 * x2 - z2 * x1;
	  y1 = z2 * x0 - z0 * x2;
	  y2 = z0 * x1 - z1 * x0;

	  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	  if (!len) {
	    y0 = 0;
	    y1 = 0;
	    y2 = 0;
	  } else {
	    len = 1 / len;
	    y0 *= len;
	    y1 *= len;
	    y2 *= len;
	  }

	  out[0] = x0;
	  out[1] = y0;
	  out[2] = z0;
	  out[3] = 0;
	  out[4] = x1;
	  out[5] = y1;
	  out[6] = z1;
	  out[7] = 0;
	  out[8] = x2;
	  out[9] = y2;
	  out[10] = z2;
	  out[11] = 0;
	  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	  out[15] = 1;

	  return out;
	}

	/**
	 * Generates a matrix that makes something look at something else.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	function targetTo(out, eye, target, up) {
	  var eyex = eye[0],
	      eyey = eye[1],
	      eyez = eye[2],
	      upx = up[0],
	      upy = up[1],
	      upz = up[2];

	  var z0 = eyex - target[0],
	      z1 = eyey - target[1],
	      z2 = eyez - target[2];

	  var len = z0 * z0 + z1 * z1 + z2 * z2;
	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;
	  }

	  var x0 = upy * z2 - upz * z1,
	      x1 = upz * z0 - upx * z2,
	      x2 = upx * z1 - upy * z0;

	  len = x0 * x0 + x1 * x1 + x2 * x2;
	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    x0 *= len;
	    x1 *= len;
	    x2 *= len;
	  }

	  out[0] = x0;
	  out[1] = x1;
	  out[2] = x2;
	  out[3] = 0;
	  out[4] = z1 * x2 - z2 * x1;
	  out[5] = z2 * x0 - z0 * x2;
	  out[6] = z0 * x1 - z1 * x0;
	  out[7] = 0;
	  out[8] = z0;
	  out[9] = z1;
	  out[10] = z2;
	  out[11] = 0;
	  out[12] = eyex;
	  out[13] = eyey;
	  out[14] = eyez;
	  out[15] = 1;
	  return out;
	}
	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str$5(a) {
	  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat4
	 *
	 * @param {mat4} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
	}

	/**
	 * Adds two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function add$5(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  out[6] = a[6] + b[6];
	  out[7] = a[7] + b[7];
	  out[8] = a[8] + b[8];
	  out[9] = a[9] + b[9];
	  out[10] = a[10] + b[10];
	  out[11] = a[11] + b[11];
	  out[12] = a[12] + b[12];
	  out[13] = a[13] + b[13];
	  out[14] = a[14] + b[14];
	  out[15] = a[15] + b[15];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function subtract$3(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  out[4] = a[4] - b[4];
	  out[5] = a[5] - b[5];
	  out[6] = a[6] - b[6];
	  out[7] = a[7] - b[7];
	  out[8] = a[8] - b[8];
	  out[9] = a[9] - b[9];
	  out[10] = a[10] - b[10];
	  out[11] = a[11] - b[11];
	  out[12] = a[12] - b[12];
	  out[13] = a[13] - b[13];
	  out[14] = a[14] - b[14];
	  out[15] = a[15] - b[15];
	  return out;
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat4} out
	 */
	function multiplyScalar(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  out[6] = a[6] * b;
	  out[7] = a[7] * b;
	  out[8] = a[8] * b;
	  out[9] = a[9] * b;
	  out[10] = a[10] * b;
	  out[11] = a[11] * b;
	  out[12] = a[12] * b;
	  out[13] = a[13] * b;
	  out[14] = a[14] * b;
	  out[15] = a[15] * b;
	  return out;
	}

	/**
	 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat4} out the receiving vector
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat4} out
	 */
	function multiplyScalarAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  out[4] = a[4] + b[4] * scale;
	  out[5] = a[5] + b[5] * scale;
	  out[6] = a[6] + b[6] * scale;
	  out[7] = a[7] + b[7] * scale;
	  out[8] = a[8] + b[8] * scale;
	  out[9] = a[9] + b[9] * scale;
	  out[10] = a[10] + b[10] * scale;
	  out[11] = a[11] + b[11] * scale;
	  out[12] = a[12] + b[12] * scale;
	  out[13] = a[13] + b[13] * scale;
	  out[14] = a[14] + b[14] * scale;
	  out[15] = a[15] + b[15] * scale;
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat4} a The first matrix.
	 * @param {mat4} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals$5(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat4} a The first matrix.
	 * @param {mat4} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals$5(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var a4 = a[4],
	      a5 = a[5],
	      a6 = a[6],
	      a7 = a[7];
	  var a8 = a[8],
	      a9 = a[9],
	      a10 = a[10],
	      a11 = a[11];
	  var a12 = a[12],
	      a13 = a[13],
	      a14 = a[14],
	      a15 = a[15];

	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  var b4 = b[4],
	      b5 = b[5],
	      b6 = b[6],
	      b7 = b[7];
	  var b8 = b[8],
	      b9 = b[9],
	      b10 = b[10],
	      b11 = b[11];
	  var b12 = b[12],
	      b13 = b[13],
	      b14 = b[14],
	      b15 = b[15];

	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
	}

	/**
	 * Alias for {@link mat4.multiply}
	 * @function
	 */
	var mul$5 = multiply$5;

	/**
	 * Alias for {@link mat4.subtract}
	 * @function
	 */
	var sub$3 = subtract$3;

	var mat4 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$5,
		clone: clone$5,
		copy: copy$5,
		fromValues: fromValues$5,
		set: set$5,
		identity: identity$2,
		transpose: transpose,
		invert: invert$2,
		adjoint: adjoint,
		determinant: determinant,
		multiply: multiply$5,
		translate: translate$1,
		scale: scale$5,
		rotate: rotate$1,
		rotateX: rotateX$3,
		rotateY: rotateY$3,
		rotateZ: rotateZ$3,
		fromTranslation: fromTranslation$1,
		fromScaling: fromScaling,
		fromRotation: fromRotation$1,
		fromXRotation: fromXRotation,
		fromYRotation: fromYRotation,
		fromZRotation: fromZRotation,
		fromRotationTranslation: fromRotationTranslation$1,
		fromQuat2: fromQuat2,
		getTranslation: getTranslation$1,
		getScaling: getScaling,
		getRotation: getRotation,
		fromRotationTranslationScale: fromRotationTranslationScale,
		fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
		fromQuat: fromQuat,
		frustum: frustum,
		perspective: perspective,
		perspectiveFromFieldOfView: perspectiveFromFieldOfView,
		ortho: ortho,
		lookAt: lookAt,
		targetTo: targetTo,
		str: str$5,
		frob: frob,
		add: add$5,
		subtract: subtract$3,
		multiplyScalar: multiplyScalar,
		multiplyScalarAndAdd: multiplyScalarAndAdd,
		exactEquals: exactEquals$5,
		equals: equals$5,
		mul: mul$5,
		sub: sub$3
	});

	/**
	 * 3 Dimensional Vector
	 * @module vec3
	 */

	/**
	 * Creates a new, empty vec3
	 *
	 * @returns {vec3} a new 3D vector
	 */
	function create$4() {
	  var out = new ARRAY_TYPE(3);
	  if (ARRAY_TYPE != Float32Array) {
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	  }
	  return out;
	}

	/**
	 * Creates a new vec3 initialized with values from an existing vector
	 *
	 * @param {vec3} a vector to clone
	 * @returns {vec3} a new 3D vector
	 */
	function clone$4(a) {
	  var out = new ARRAY_TYPE(3);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  return out;
	}

	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length$4(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  return Math.sqrt(x * x + y * y + z * z);
	}

	/**
	 * Creates a new vec3 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} a new 3D vector
	 */
	function fromValues$4(x, y, z) {
	  var out = new ARRAY_TYPE(3);
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  return out;
	}

	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */
	function copy$4(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  return out;
	}

	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */
	function set$4(out, x, y, z) {
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  return out;
	}

	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function add$4(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  return out;
	}

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function subtract$2(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  return out;
	}

	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function multiply$4(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	  return out;
	}

	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function divide$2(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	  return out;
	}

	/**
	 * Math.ceil the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to ceil
	 * @returns {vec3} out
	 */
	function ceil$2(out, a) {
	  out[0] = Math.ceil(a[0]);
	  out[1] = Math.ceil(a[1]);
	  out[2] = Math.ceil(a[2]);
	  return out;
	}

	/**
	 * Math.floor the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to floor
	 * @returns {vec3} out
	 */
	function floor$2(out, a) {
	  out[0] = Math.floor(a[0]);
	  out[1] = Math.floor(a[1]);
	  out[2] = Math.floor(a[2]);
	  return out;
	}

	/**
	 * Returns the minimum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function min$2(out, a, b) {
	  out[0] = Math.min(a[0], b[0]);
	  out[1] = Math.min(a[1], b[1]);
	  out[2] = Math.min(a[2], b[2]);
	  return out;
	}

	/**
	 * Returns the maximum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function max$2(out, a, b) {
	  out[0] = Math.max(a[0], b[0]);
	  out[1] = Math.max(a[1], b[1]);
	  out[2] = Math.max(a[2], b[2]);
	  return out;
	}

	/**
	 * Math.round the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to round
	 * @returns {vec3} out
	 */
	function round$2(out, a) {
	  out[0] = Math.round(a[0]);
	  out[1] = Math.round(a[1]);
	  out[2] = Math.round(a[2]);
	  return out;
	}

	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
	function scale$4(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  return out;
	}

	/**
	 * Adds two vec3's after scaling the second operand by a scalar value
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec3} out
	 */
	function scaleAndAdd$2(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  return out;
	}

	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance$2(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  return Math.sqrt(x * x + y * y + z * z);
	}

	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance$2(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  return x * x + y * y + z * z;
	}

	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength$4(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  return x * x + y * y + z * z;
	}

	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */
	function negate$2(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  return out;
	}

	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */
	function inverse$2(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  return out;
	}

	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	function normalize$4(out, a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var len = x * x + y * y + z * z;
	  if (len > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len = 1 / Math.sqrt(len);
	    out[0] = a[0] * len;
	    out[1] = a[1] * len;
	    out[2] = a[2] * len;
	  }
	  return out;
	}

	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot$4(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function cross$1(out, a, b) {
	  var ax = a[0],
	      ay = a[1],
	      az = a[2];
	  var bx = b[0],
	      by = b[1],
	      bz = b[2];

	  out[0] = ay * bz - az * by;
	  out[1] = az * bx - ax * bz;
	  out[2] = ax * by - ay * bx;
	  return out;
	}

	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {vec3} out
	 */
	function lerp$4(out, a, b, t) {
	  var ax = a[0];
	  var ay = a[1];
	  var az = a[2];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  out[2] = az + t * (b[2] - az);
	  return out;
	}

	/**
	 * Performs a hermite interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {vec3} out
	 */
	function hermite(out, a, b, c, d, t) {
	  var factorTimes2 = t * t;
	  var factor1 = factorTimes2 * (2 * t - 3) + 1;
	  var factor2 = factorTimes2 * (t - 2) + t;
	  var factor3 = factorTimes2 * (t - 1);
	  var factor4 = factorTimes2 * (3 - 2 * t);

	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

	  return out;
	}

	/**
	 * Performs a bezier interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {vec3} out
	 */
	function bezier(out, a, b, c, d, t) {
	  var inverseFactor = 1 - t;
	  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
	  var factorTimes2 = t * t;
	  var factor1 = inverseFactorTimesTwo * inverseFactor;
	  var factor2 = 3 * t * inverseFactorTimesTwo;
	  var factor3 = 3 * factorTimes2 * inverseFactor;
	  var factor4 = factorTimes2 * t;

	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

	  return out;
	}

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec3} out
	 */
	function random$3(out, scale) {
	  scale = scale || 1.0;

	  var r = RANDOM() * 2.0 * Math.PI;
	  var z = RANDOM() * 2.0 - 1.0;
	  var zScale = Math.sqrt(1.0 - z * z) * scale;

	  out[0] = Math.cos(r) * zScale;
	  out[1] = Math.sin(r) * zScale;
	  out[2] = z * scale;
	  return out;
	}

	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */
	function transformMat4$2(out, a, m) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
	  w = w || 1.0;
	  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	  return out;
	}

	/**
	 * Transforms the vec3 with a mat3.
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat3} m the 3x3 matrix to transform with
	 * @returns {vec3} out
	 */
	function transformMat3$1(out, a, m) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  out[0] = x * m[0] + y * m[3] + z * m[6];
	  out[1] = x * m[1] + y * m[4] + z * m[7];
	  out[2] = x * m[2] + y * m[5] + z * m[8];
	  return out;
	}

	/**
	 * Transforms the vec3 with a quat
	 * Can also be used for dual quaternions. (Multiply it with the real part)
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */
	function transformQuat$1(out, a, q) {
	  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
	  var qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3];
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  // var qvec = [qx, qy, qz];
	  // var uv = vec3.cross([], qvec, a);
	  var uvx = qy * z - qz * y,
	      uvy = qz * x - qx * z,
	      uvz = qx * y - qy * x;
	  // var uuv = vec3.cross([], qvec, uv);
	  var uuvx = qy * uvz - qz * uvy,
	      uuvy = qz * uvx - qx * uvz,
	      uuvz = qx * uvy - qy * uvx;
	  // vec3.scale(uv, uv, 2 * w);
	  var w2 = qw * 2;
	  uvx *= w2;
	  uvy *= w2;
	  uvz *= w2;
	  // vec3.scale(uuv, uuv, 2);
	  uuvx *= 2;
	  uuvy *= 2;
	  uuvz *= 2;
	  // return vec3.add(out, a, vec3.add(out, uv, uuv));
	  out[0] = x + uvx + uuvx;
	  out[1] = y + uvy + uuvy;
	  out[2] = z + uvz + uuvz;
	  return out;
	}

	/**
	 * Rotate a 3D vector around the x-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateX$2(out, a, b, c) {
	  var p = [],
	      r = [];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	  p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
	  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	  return out;
	}

	/**
	 * Rotate a 3D vector around the y-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateY$2(out, a, b, c) {
	  var p = [],
	      r = [];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	  p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
	  r[1] = p[1];
	  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	  return out;
	}

	/**
	 * Rotate a 3D vector around the z-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateZ$2(out, a, b, c) {
	  var p = [],
	      r = [];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	  p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
	  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
	  r[2] = p[2];

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	  return out;
	}

	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */
	function angle$1(a, b) {
	  var tempA = fromValues$4(a[0], a[1], a[2]);
	  var tempB = fromValues$4(b[0], b[1], b[2]);

	  normalize$4(tempA, tempA);
	  normalize$4(tempB, tempB);

	  var cosine = dot$4(tempA, tempB);

	  if (cosine > 1.0) {
	    return 0;
	  } else if (cosine < -1.0) {
	    return Math.PI;
	  } else {
	    return Math.acos(cosine);
	  }
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec3} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str$4(a) {
	  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
	}

	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function exactEquals$4(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function equals$4(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
	}

	/**
	 * Alias for {@link vec3.subtract}
	 * @function
	 */
	var sub$2 = subtract$2;

	/**
	 * Alias for {@link vec3.multiply}
	 * @function
	 */
	var mul$4 = multiply$4;

	/**
	 * Alias for {@link vec3.divide}
	 * @function
	 */
	var div$2 = divide$2;

	/**
	 * Alias for {@link vec3.distance}
	 * @function
	 */
	var dist$2 = distance$2;

	/**
	 * Alias for {@link vec3.squaredDistance}
	 * @function
	 */
	var sqrDist$2 = squaredDistance$2;

	/**
	 * Alias for {@link vec3.length}
	 * @function
	 */
	var len$4 = length$4;

	/**
	 * Alias for {@link vec3.squaredLength}
	 * @function
	 */
	var sqrLen$4 = squaredLength$4;

	/**
	 * Perform some operation over an array of vec3s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	var forEach$2 = function () {
	  var vec = create$4();

	  return function (a, stride, offset, count, fn, arg) {
	    var i = void 0,
	        l = void 0;
	    if (!stride) {
	      stride = 3;
	    }

	    if (!offset) {
	      offset = 0;
	    }

	    if (count) {
	      l = Math.min(count * stride + offset, a.length);
	    } else {
	      l = a.length;
	    }

	    for (i = offset; i < l; i += stride) {
	      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];
	      fn(vec, vec, arg);
	      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];
	    }

	    return a;
	  };
	}();

	var vec3 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$4,
		clone: clone$4,
		length: length$4,
		fromValues: fromValues$4,
		copy: copy$4,
		set: set$4,
		add: add$4,
		subtract: subtract$2,
		multiply: multiply$4,
		divide: divide$2,
		ceil: ceil$2,
		floor: floor$2,
		min: min$2,
		max: max$2,
		round: round$2,
		scale: scale$4,
		scaleAndAdd: scaleAndAdd$2,
		distance: distance$2,
		squaredDistance: squaredDistance$2,
		squaredLength: squaredLength$4,
		negate: negate$2,
		inverse: inverse$2,
		normalize: normalize$4,
		dot: dot$4,
		cross: cross$1,
		lerp: lerp$4,
		hermite: hermite,
		bezier: bezier,
		random: random$3,
		transformMat4: transformMat4$2,
		transformMat3: transformMat3$1,
		transformQuat: transformQuat$1,
		rotateX: rotateX$2,
		rotateY: rotateY$2,
		rotateZ: rotateZ$2,
		angle: angle$1,
		str: str$4,
		exactEquals: exactEquals$4,
		equals: equals$4,
		sub: sub$2,
		mul: mul$4,
		div: div$2,
		dist: dist$2,
		sqrDist: sqrDist$2,
		len: len$4,
		sqrLen: sqrLen$4,
		forEach: forEach$2
	});

	/**
	 * 4 Dimensional Vector
	 * @module vec4
	 */

	/**
	 * Creates a new, empty vec4
	 *
	 * @returns {vec4} a new 4D vector
	 */
	function create$3() {
	  var out = new ARRAY_TYPE(4);
	  if (ARRAY_TYPE != Float32Array) {
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	  }
	  return out;
	}

	/**
	 * Creates a new vec4 initialized with values from an existing vector
	 *
	 * @param {vec4} a vector to clone
	 * @returns {vec4} a new 4D vector
	 */
	function clone$3(a) {
	  var out = new ARRAY_TYPE(4);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Creates a new vec4 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} a new 4D vector
	 */
	function fromValues$3(x, y, z, w) {
	  var out = new ARRAY_TYPE(4);
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = w;
	  return out;
	}

	/**
	 * Copy the values from one vec4 to another
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the source vector
	 * @returns {vec4} out
	 */
	function copy$3(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Set the components of a vec4 to the given values
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} out
	 */
	function set$3(out, x, y, z, w) {
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = w;
	  return out;
	}

	/**
	 * Adds two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function add$3(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  return out;
	}

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function subtract$1(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  return out;
	}

	/**
	 * Multiplies two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function multiply$3(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	  out[3] = a[3] * b[3];
	  return out;
	}

	/**
	 * Divides two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function divide$1(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	  out[3] = a[3] / b[3];
	  return out;
	}

	/**
	 * Math.ceil the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to ceil
	 * @returns {vec4} out
	 */
	function ceil$1(out, a) {
	  out[0] = Math.ceil(a[0]);
	  out[1] = Math.ceil(a[1]);
	  out[2] = Math.ceil(a[2]);
	  out[3] = Math.ceil(a[3]);
	  return out;
	}

	/**
	 * Math.floor the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to floor
	 * @returns {vec4} out
	 */
	function floor$1(out, a) {
	  out[0] = Math.floor(a[0]);
	  out[1] = Math.floor(a[1]);
	  out[2] = Math.floor(a[2]);
	  out[3] = Math.floor(a[3]);
	  return out;
	}

	/**
	 * Returns the minimum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function min$1(out, a, b) {
	  out[0] = Math.min(a[0], b[0]);
	  out[1] = Math.min(a[1], b[1]);
	  out[2] = Math.min(a[2], b[2]);
	  out[3] = Math.min(a[3], b[3]);
	  return out;
	}

	/**
	 * Returns the maximum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function max$1(out, a, b) {
	  out[0] = Math.max(a[0], b[0]);
	  out[1] = Math.max(a[1], b[1]);
	  out[2] = Math.max(a[2], b[2]);
	  out[3] = Math.max(a[3], b[3]);
	  return out;
	}

	/**
	 * Math.round the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to round
	 * @returns {vec4} out
	 */
	function round$1(out, a) {
	  out[0] = Math.round(a[0]);
	  out[1] = Math.round(a[1]);
	  out[2] = Math.round(a[2]);
	  out[3] = Math.round(a[3]);
	  return out;
	}

	/**
	 * Scales a vec4 by a scalar number
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec4} out
	 */
	function scale$3(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  return out;
	}

	/**
	 * Adds two vec4's after scaling the second operand by a scalar value
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec4} out
	 */
	function scaleAndAdd$1(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  return out;
	}

	/**
	 * Calculates the euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance$1(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  var w = b[3] - a[3];
	  return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	/**
	 * Calculates the squared euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance$1(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  var w = b[3] - a[3];
	  return x * x + y * y + z * z + w * w;
	}

	/**
	 * Calculates the length of a vec4
	 *
	 * @param {vec4} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length$3(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var w = a[3];
	  return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	/**
	 * Calculates the squared length of a vec4
	 *
	 * @param {vec4} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength$3(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var w = a[3];
	  return x * x + y * y + z * z + w * w;
	}

	/**
	 * Negates the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to negate
	 * @returns {vec4} out
	 */
	function negate$1(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = -a[3];
	  return out;
	}

	/**
	 * Returns the inverse of the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to invert
	 * @returns {vec4} out
	 */
	function inverse$1(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  out[3] = 1.0 / a[3];
	  return out;
	}

	/**
	 * Normalize a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to normalize
	 * @returns {vec4} out
	 */
	function normalize$3(out, a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var w = a[3];
	  var len = x * x + y * y + z * z + w * w;
	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    out[0] = x * len;
	    out[1] = y * len;
	    out[2] = z * len;
	    out[3] = w * len;
	  }
	  return out;
	}

	/**
	 * Calculates the dot product of two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot$3(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	}

	/**
	 * Performs a linear interpolation between two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {vec4} out
	 */
	function lerp$3(out, a, b, t) {
	  var ax = a[0];
	  var ay = a[1];
	  var az = a[2];
	  var aw = a[3];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  out[2] = az + t * (b[2] - az);
	  out[3] = aw + t * (b[3] - aw);
	  return out;
	}

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec4} out
	 */
	function random$2(out, scale) {
	  scale = scale || 1.0;

	  // Marsaglia, George. Choosing a Point from the Surface of a
	  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
	  // http://projecteuclid.org/euclid.aoms/1177692644;
	  var v1, v2, v3, v4;
	  var s1, s2;
	  do {
	    v1 = RANDOM() * 2 - 1;
	    v2 = RANDOM() * 2 - 1;
	    s1 = v1 * v1 + v2 * v2;
	  } while (s1 >= 1);
	  do {
	    v3 = RANDOM() * 2 - 1;
	    v4 = RANDOM() * 2 - 1;
	    s2 = v3 * v3 + v4 * v4;
	  } while (s2 >= 1);

	  var d = Math.sqrt((1 - s1) / s2);
	  out[0] = scale * v1;
	  out[1] = scale * v2;
	  out[2] = scale * v3 * d;
	  out[3] = scale * v4 * d;
	  return out;
	}

	/**
	 * Transforms the vec4 with a mat4.
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec4} out
	 */
	function transformMat4$1(out, a, m) {
	  var x = a[0],
	      y = a[1],
	      z = a[2],
	      w = a[3];
	  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
	  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
	  return out;
	}

	/**
	 * Transforms the vec4 with a quat
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec4} out
	 */
	function transformQuat(out, a, q) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  var qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3];

	  // calculate quat * vec
	  var ix = qw * x + qy * z - qz * y;
	  var iy = qw * y + qz * x - qx * z;
	  var iz = qw * z + qx * y - qy * x;
	  var iw = -qx * x - qy * y - qz * z;

	  // calculate result * inverse quat
	  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec4} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str$3(a) {
	  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	}

	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec4} a The first vector.
	 * @param {vec4} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function exactEquals$3(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec4} a The first vector.
	 * @param {vec4} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function equals$3(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
	}

	/**
	 * Alias for {@link vec4.subtract}
	 * @function
	 */
	var sub$1 = subtract$1;

	/**
	 * Alias for {@link vec4.multiply}
	 * @function
	 */
	var mul$3 = multiply$3;

	/**
	 * Alias for {@link vec4.divide}
	 * @function
	 */
	var div$1 = divide$1;

	/**
	 * Alias for {@link vec4.distance}
	 * @function
	 */
	var dist$1 = distance$1;

	/**
	 * Alias for {@link vec4.squaredDistance}
	 * @function
	 */
	var sqrDist$1 = squaredDistance$1;

	/**
	 * Alias for {@link vec4.length}
	 * @function
	 */
	var len$3 = length$3;

	/**
	 * Alias for {@link vec4.squaredLength}
	 * @function
	 */
	var sqrLen$3 = squaredLength$3;

	/**
	 * Perform some operation over an array of vec4s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	var forEach$1 = function () {
	  var vec = create$3();

	  return function (a, stride, offset, count, fn, arg) {
	    var i = void 0,
	        l = void 0;
	    if (!stride) {
	      stride = 4;
	    }

	    if (!offset) {
	      offset = 0;
	    }

	    if (count) {
	      l = Math.min(count * stride + offset, a.length);
	    } else {
	      l = a.length;
	    }

	    for (i = offset; i < l; i += stride) {
	      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];vec[3] = a[i + 3];
	      fn(vec, vec, arg);
	      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];a[i + 3] = vec[3];
	    }

	    return a;
	  };
	}();

	var vec4 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$3,
		clone: clone$3,
		fromValues: fromValues$3,
		copy: copy$3,
		set: set$3,
		add: add$3,
		subtract: subtract$1,
		multiply: multiply$3,
		divide: divide$1,
		ceil: ceil$1,
		floor: floor$1,
		min: min$1,
		max: max$1,
		round: round$1,
		scale: scale$3,
		scaleAndAdd: scaleAndAdd$1,
		distance: distance$1,
		squaredDistance: squaredDistance$1,
		length: length$3,
		squaredLength: squaredLength$3,
		negate: negate$1,
		inverse: inverse$1,
		normalize: normalize$3,
		dot: dot$3,
		lerp: lerp$3,
		random: random$2,
		transformMat4: transformMat4$1,
		transformQuat: transformQuat,
		str: str$3,
		exactEquals: exactEquals$3,
		equals: equals$3,
		sub: sub$1,
		mul: mul$3,
		div: div$1,
		dist: dist$1,
		sqrDist: sqrDist$1,
		len: len$3,
		sqrLen: sqrLen$3,
		forEach: forEach$1
	});

	/**
	 * Quaternion
	 * @module quat
	 */

	/**
	 * Creates a new identity quat
	 *
	 * @returns {quat} a new quaternion
	 */
	function create$2() {
	  var out = new ARRAY_TYPE(4);
	  if (ARRAY_TYPE != Float32Array) {
	    out[0] = 0;
	    out[1] = 0;
	    out[2] = 0;
	  }
	  out[3] = 1;
	  return out;
	}

	/**
	 * Set a quat to the identity quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */
	function identity$1(out) {
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Sets a quat from the given angle and rotation axis,
	 * then returns it.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} axis the axis around which to rotate
	 * @param {Number} rad the angle in radians
	 * @returns {quat} out
	 **/
	function setAxisAngle(out, axis, rad) {
	  rad = rad * 0.5;
	  var s = Math.sin(rad);
	  out[0] = s * axis[0];
	  out[1] = s * axis[1];
	  out[2] = s * axis[2];
	  out[3] = Math.cos(rad);
	  return out;
	}

	/**
	 * Gets the rotation axis and angle for a given
	 *  quaternion. If a quaternion is created with
	 *  setAxisAngle, this method will return the same
	 *  values as providied in the original parameter list
	 *  OR functionally equivalent values.
	 * Example: The quaternion formed by axis [0, 0, 1] and
	 *  angle -90 is the same as the quaternion formed by
	 *  [0, 0, 1] and 270. This method favors the latter.
	 * @param  {vec3} out_axis  Vector receiving the axis of rotation
	 * @param  {quat} q     Quaternion to be decomposed
	 * @return {Number}     Angle, in radians, of the rotation
	 */
	function getAxisAngle(out_axis, q) {
	  var rad = Math.acos(q[3]) * 2.0;
	  var s = Math.sin(rad / 2.0);
	  if (s > EPSILON) {
	    out_axis[0] = q[0] / s;
	    out_axis[1] = q[1] / s;
	    out_axis[2] = q[2] / s;
	  } else {
	    // If s is zero, return any axis (no rotation - axis does not matter)
	    out_axis[0] = 1;
	    out_axis[1] = 0;
	    out_axis[2] = 0;
	  }
	  return rad;
	}

	/**
	 * Multiplies two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 */
	function multiply$2(out, a, b) {
	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bx = b[0],
	      by = b[1],
	      bz = b[2],
	      bw = b[3];

	  out[0] = ax * bw + aw * bx + ay * bz - az * by;
	  out[1] = ay * bw + aw * by + az * bx - ax * bz;
	  out[2] = az * bw + aw * bz + ax * by - ay * bx;
	  out[3] = aw * bw - ax * bx - ay * by - az * bz;
	  return out;
	}

	/**
	 * Rotates a quaternion by the given angle about the X axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	function rotateX$1(out, a, rad) {
	  rad *= 0.5;

	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bx = Math.sin(rad),
	      bw = Math.cos(rad);

	  out[0] = ax * bw + aw * bx;
	  out[1] = ay * bw + az * bx;
	  out[2] = az * bw - ay * bx;
	  out[3] = aw * bw - ax * bx;
	  return out;
	}

	/**
	 * Rotates a quaternion by the given angle about the Y axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	function rotateY$1(out, a, rad) {
	  rad *= 0.5;

	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var by = Math.sin(rad),
	      bw = Math.cos(rad);

	  out[0] = ax * bw - az * by;
	  out[1] = ay * bw + aw * by;
	  out[2] = az * bw + ax * by;
	  out[3] = aw * bw - ay * by;
	  return out;
	}

	/**
	 * Rotates a quaternion by the given angle about the Z axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	function rotateZ$1(out, a, rad) {
	  rad *= 0.5;

	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bz = Math.sin(rad),
	      bw = Math.cos(rad);

	  out[0] = ax * bw + ay * bz;
	  out[1] = ay * bw - ax * bz;
	  out[2] = az * bw + aw * bz;
	  out[3] = aw * bw - az * bz;
	  return out;
	}

	/**
	 * Calculates the W component of a quat from the X, Y, and Z components.
	 * Assumes that quaternion is 1 unit in length.
	 * Any existing W component will be ignored.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate W component of
	 * @returns {quat} out
	 */
	function calculateW(out, a) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];

	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
	  return out;
	}

	/**
	 * Performs a spherical linear interpolation between two quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {quat} out
	 */
	function slerp(out, a, b, t) {
	  // benchmarks:
	  //    http://jsperf.com/quaternion-slerp-implementations
	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bx = b[0],
	      by = b[1],
	      bz = b[2],
	      bw = b[3];

	  var omega = void 0,
	      cosom = void 0,
	      sinom = void 0,
	      scale0 = void 0,
	      scale1 = void 0;

	  // calc cosine
	  cosom = ax * bx + ay * by + az * bz + aw * bw;
	  // adjust signs (if necessary)
	  if (cosom < 0.0) {
	    cosom = -cosom;
	    bx = -bx;
	    by = -by;
	    bz = -bz;
	    bw = -bw;
	  }
	  // calculate coefficients
	  if (1.0 - cosom > EPSILON) {
	    // standard case (slerp)
	    omega = Math.acos(cosom);
	    sinom = Math.sin(omega);
	    scale0 = Math.sin((1.0 - t) * omega) / sinom;
	    scale1 = Math.sin(t * omega) / sinom;
	  } else {
	    // "from" and "to" quaternions are very close
	    //  ... so we can do a linear interpolation
	    scale0 = 1.0 - t;
	    scale1 = t;
	  }
	  // calculate final values
	  out[0] = scale0 * ax + scale1 * bx;
	  out[1] = scale0 * ay + scale1 * by;
	  out[2] = scale0 * az + scale1 * bz;
	  out[3] = scale0 * aw + scale1 * bw;

	  return out;
	}

	/**
	 * Generates a random quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */
	function random$1(out) {
	  // Implementation of http://planning.cs.uiuc.edu/node198.html
	  // TODO: Calling random 3 times is probably not the fastest solution
	  var u1 = RANDOM();
	  var u2 = RANDOM();
	  var u3 = RANDOM();

	  var sqrt1MinusU1 = Math.sqrt(1 - u1);
	  var sqrtU1 = Math.sqrt(u1);

	  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
	  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
	  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
	  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
	  return out;
	}

	/**
	 * Calculates the inverse of a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate inverse of
	 * @returns {quat} out
	 */
	function invert$1(out, a) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
	  var invDot = dot ? 1.0 / dot : 0;

	  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

	  out[0] = -a0 * invDot;
	  out[1] = -a1 * invDot;
	  out[2] = -a2 * invDot;
	  out[3] = a3 * invDot;
	  return out;
	}

	/**
	 * Calculates the conjugate of a quat
	 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate conjugate of
	 * @returns {quat} out
	 */
	function conjugate$1(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Creates a quaternion from the given 3x3 rotation matrix.
	 *
	 * NOTE: The resultant quaternion is not normalized, so you should be sure
	 * to renormalize the quaternion yourself where necessary.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {mat3} m rotation matrix
	 * @returns {quat} out
	 * @function
	 */
	function fromMat3(out, m) {
	  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
	  // article "Quaternion Calculus and Fast Animation".
	  var fTrace = m[0] + m[4] + m[8];
	  var fRoot = void 0;

	  if (fTrace > 0.0) {
	    // |w| > 1/2, may as well choose w > 1/2
	    fRoot = Math.sqrt(fTrace + 1.0); // 2w
	    out[3] = 0.5 * fRoot;
	    fRoot = 0.5 / fRoot; // 1/(4w)
	    out[0] = (m[5] - m[7]) * fRoot;
	    out[1] = (m[6] - m[2]) * fRoot;
	    out[2] = (m[1] - m[3]) * fRoot;
	  } else {
	    // |w| <= 1/2
	    var i = 0;
	    if (m[4] > m[0]) i = 1;
	    if (m[8] > m[i * 3 + i]) i = 2;
	    var j = (i + 1) % 3;
	    var k = (i + 2) % 3;

	    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
	    out[i] = 0.5 * fRoot;
	    fRoot = 0.5 / fRoot;
	    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
	    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
	    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
	  }

	  return out;
	}

	/**
	 * Creates a quaternion from the given euler angle x, y, z.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {x} Angle to rotate around X axis in degrees.
	 * @param {y} Angle to rotate around Y axis in degrees.
	 * @param {z} Angle to rotate around Z axis in degrees.
	 * @returns {quat} out
	 * @function
	 */
	function fromEuler(out, x, y, z) {
	  var halfToRad = 0.5 * Math.PI / 180.0;
	  x *= halfToRad;
	  y *= halfToRad;
	  z *= halfToRad;

	  var sx = Math.sin(x);
	  var cx = Math.cos(x);
	  var sy = Math.sin(y);
	  var cy = Math.cos(y);
	  var sz = Math.sin(z);
	  var cz = Math.cos(z);

	  out[0] = sx * cy * cz - cx * sy * sz;
	  out[1] = cx * sy * cz + sx * cy * sz;
	  out[2] = cx * cy * sz - sx * sy * cz;
	  out[3] = cx * cy * cz + sx * sy * sz;

	  return out;
	}

	/**
	 * Returns a string representation of a quatenion
	 *
	 * @param {quat} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str$2(a) {
	  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	}

	/**
	 * Creates a new quat initialized with values from an existing quaternion
	 *
	 * @param {quat} a quaternion to clone
	 * @returns {quat} a new quaternion
	 * @function
	 */
	var clone$2 = clone$3;

	/**
	 * Creates a new quat initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} a new quaternion
	 * @function
	 */
	var fromValues$2 = fromValues$3;

	/**
	 * Copy the values from one quat to another
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the source quaternion
	 * @returns {quat} out
	 * @function
	 */
	var copy$2 = copy$3;

	/**
	 * Set the components of a quat to the given values
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} out
	 * @function
	 */
	var set$2 = set$3;

	/**
	 * Adds two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 * @function
	 */
	var add$2 = add$3;

	/**
	 * Alias for {@link quat.multiply}
	 * @function
	 */
	var mul$2 = multiply$2;

	/**
	 * Scales a quat by a scalar number
	 *
	 * @param {quat} out the receiving vector
	 * @param {quat} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {quat} out
	 * @function
	 */
	var scale$2 = scale$3;

	/**
	 * Calculates the dot product of two quat's
	 *
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */
	var dot$2 = dot$3;

	/**
	 * Performs a linear interpolation between two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {quat} out
	 * @function
	 */
	var lerp$2 = lerp$3;

	/**
	 * Calculates the length of a quat
	 *
	 * @param {quat} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	var length$2 = length$3;

	/**
	 * Alias for {@link quat.length}
	 * @function
	 */
	var len$2 = length$2;

	/**
	 * Calculates the squared length of a quat
	 *
	 * @param {quat} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 * @function
	 */
	var squaredLength$2 = squaredLength$3;

	/**
	 * Alias for {@link quat.squaredLength}
	 * @function
	 */
	var sqrLen$2 = squaredLength$2;

	/**
	 * Normalize a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quaternion to normalize
	 * @returns {quat} out
	 * @function
	 */
	var normalize$2 = normalize$3;

	/**
	 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {quat} a The first quaternion.
	 * @param {quat} b The second quaternion.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	var exactEquals$2 = exactEquals$3;

	/**
	 * Returns whether or not the quaternions have approximately the same elements in the same position.
	 *
	 * @param {quat} a The first vector.
	 * @param {quat} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	var equals$2 = equals$3;

	/**
	 * Sets a quaternion to represent the shortest rotation from one
	 * vector to another.
	 *
	 * Both vectors are assumed to be unit length.
	 *
	 * @param {quat} out the receiving quaternion.
	 * @param {vec3} a the initial vector
	 * @param {vec3} b the destination vector
	 * @returns {quat} out
	 */
	var rotationTo = function () {
	  var tmpvec3 = create$4();
	  var xUnitVec3 = fromValues$4(1, 0, 0);
	  var yUnitVec3 = fromValues$4(0, 1, 0);

	  return function (out, a, b) {
	    var dot = dot$4(a, b);
	    if (dot < -0.999999) {
	      cross$1(tmpvec3, xUnitVec3, a);
	      if (len$4(tmpvec3) < 0.000001) cross$1(tmpvec3, yUnitVec3, a);
	      normalize$4(tmpvec3, tmpvec3);
	      setAxisAngle(out, tmpvec3, Math.PI);
	      return out;
	    } else if (dot > 0.999999) {
	      out[0] = 0;
	      out[1] = 0;
	      out[2] = 0;
	      out[3] = 1;
	      return out;
	    } else {
	      cross$1(tmpvec3, a, b);
	      out[0] = tmpvec3[0];
	      out[1] = tmpvec3[1];
	      out[2] = tmpvec3[2];
	      out[3] = 1 + dot;
	      return normalize$2(out, out);
	    }
	  };
	}();

	/**
	 * Performs a spherical linear interpolation with two control points
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {quat} c the third operand
	 * @param {quat} d the fourth operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {quat} out
	 */
	var sqlerp = function () {
	  var temp1 = create$2();
	  var temp2 = create$2();

	  return function (out, a, b, c, d, t) {
	    slerp(temp1, a, d, t);
	    slerp(temp2, b, c, t);
	    slerp(out, temp1, temp2, 2 * t * (1 - t));

	    return out;
	  };
	}();

	/**
	 * Sets the specified quaternion with values corresponding to the given
	 * axes. Each axis is a vec3 and is expected to be unit length and
	 * perpendicular to all other specified axes.
	 *
	 * @param {vec3} view  the vector representing the viewing direction
	 * @param {vec3} right the vector representing the local "right" direction
	 * @param {vec3} up    the vector representing the local "up" direction
	 * @returns {quat} out
	 */
	var setAxes = function () {
	  var matr = create$6();

	  return function (out, view, right, up) {
	    matr[0] = right[0];
	    matr[3] = right[1];
	    matr[6] = right[2];

	    matr[1] = up[0];
	    matr[4] = up[1];
	    matr[7] = up[2];

	    matr[2] = -view[0];
	    matr[5] = -view[1];
	    matr[8] = -view[2];

	    return normalize$2(out, fromMat3(out, matr));
	  };
	}();

	var quat = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$2,
		identity: identity$1,
		setAxisAngle: setAxisAngle,
		getAxisAngle: getAxisAngle,
		multiply: multiply$2,
		rotateX: rotateX$1,
		rotateY: rotateY$1,
		rotateZ: rotateZ$1,
		calculateW: calculateW,
		slerp: slerp,
		random: random$1,
		invert: invert$1,
		conjugate: conjugate$1,
		fromMat3: fromMat3,
		fromEuler: fromEuler,
		str: str$2,
		clone: clone$2,
		fromValues: fromValues$2,
		copy: copy$2,
		set: set$2,
		add: add$2,
		mul: mul$2,
		scale: scale$2,
		dot: dot$2,
		lerp: lerp$2,
		length: length$2,
		len: len$2,
		squaredLength: squaredLength$2,
		sqrLen: sqrLen$2,
		normalize: normalize$2,
		exactEquals: exactEquals$2,
		equals: equals$2,
		rotationTo: rotationTo,
		sqlerp: sqlerp,
		setAxes: setAxes
	});

	/**
	 * Dual Quaternion<br>
	 * Format: [real, dual]<br>
	 * Quaternion format: XYZW<br>
	 * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
	 * @module quat2
	 */

	/**
	 * Creates a new identity dual quat
	 *
	 * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
	 */
	function create$1() {
	  var dq = new ARRAY_TYPE(8);
	  if (ARRAY_TYPE != Float32Array) {
	    dq[0] = 0;
	    dq[1] = 0;
	    dq[2] = 0;
	    dq[4] = 0;
	    dq[5] = 0;
	    dq[6] = 0;
	    dq[7] = 0;
	  }
	  dq[3] = 1;
	  return dq;
	}

	/**
	 * Creates a new quat initialized with values from an existing quaternion
	 *
	 * @param {quat2} a dual quaternion to clone
	 * @returns {quat2} new dual quaternion
	 * @function
	 */
	function clone$1(a) {
	  var dq = new ARRAY_TYPE(8);
	  dq[0] = a[0];
	  dq[1] = a[1];
	  dq[2] = a[2];
	  dq[3] = a[3];
	  dq[4] = a[4];
	  dq[5] = a[5];
	  dq[6] = a[6];
	  dq[7] = a[7];
	  return dq;
	}

	/**
	 * Creates a new dual quat initialized with the given values
	 *
	 * @param {Number} x1 X component
	 * @param {Number} y1 Y component
	 * @param {Number} z1 Z component
	 * @param {Number} w1 W component
	 * @param {Number} x2 X component
	 * @param {Number} y2 Y component
	 * @param {Number} z2 Z component
	 * @param {Number} w2 W component
	 * @returns {quat2} new dual quaternion
	 * @function
	 */
	function fromValues$1(x1, y1, z1, w1, x2, y2, z2, w2) {
	  var dq = new ARRAY_TYPE(8);
	  dq[0] = x1;
	  dq[1] = y1;
	  dq[2] = z1;
	  dq[3] = w1;
	  dq[4] = x2;
	  dq[5] = y2;
	  dq[6] = z2;
	  dq[7] = w2;
	  return dq;
	}

	/**
	 * Creates a new dual quat from the given values (quat and translation)
	 *
	 * @param {Number} x1 X component
	 * @param {Number} y1 Y component
	 * @param {Number} z1 Z component
	 * @param {Number} w1 W component
	 * @param {Number} x2 X component (translation)
	 * @param {Number} y2 Y component (translation)
	 * @param {Number} z2 Z component (translation)
	 * @returns {quat2} new dual quaternion
	 * @function
	 */
	function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
	  var dq = new ARRAY_TYPE(8);
	  dq[0] = x1;
	  dq[1] = y1;
	  dq[2] = z1;
	  dq[3] = w1;
	  var ax = x2 * 0.5,
	      ay = y2 * 0.5,
	      az = z2 * 0.5;
	  dq[4] = ax * w1 + ay * z1 - az * y1;
	  dq[5] = ay * w1 + az * x1 - ax * z1;
	  dq[6] = az * w1 + ax * y1 - ay * x1;
	  dq[7] = -ax * x1 - ay * y1 - az * z1;
	  return dq;
	}

	/**
	 * Creates a dual quat from a quaternion and a translation
	 *
	 * @param {quat2} dual quaternion receiving operation result
	 * @param {quat} q quaternion
	 * @param {vec3} t tranlation vector
	 * @returns {quat2} dual quaternion receiving operation result
	 * @function
	 */
	function fromRotationTranslation(out, q, t) {
	  var ax = t[0] * 0.5,
	      ay = t[1] * 0.5,
	      az = t[2] * 0.5,
	      bx = q[0],
	      by = q[1],
	      bz = q[2],
	      bw = q[3];
	  out[0] = bx;
	  out[1] = by;
	  out[2] = bz;
	  out[3] = bw;
	  out[4] = ax * bw + ay * bz - az * by;
	  out[5] = ay * bw + az * bx - ax * bz;
	  out[6] = az * bw + ax * by - ay * bx;
	  out[7] = -ax * bx - ay * by - az * bz;
	  return out;
	}

	/**
	 * Creates a dual quat from a translation
	 *
	 * @param {quat2} dual quaternion receiving operation result
	 * @param {vec3} t translation vector
	 * @returns {quat2} dual quaternion receiving operation result
	 * @function
	 */
	function fromTranslation(out, t) {
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = t[0] * 0.5;
	  out[5] = t[1] * 0.5;
	  out[6] = t[2] * 0.5;
	  out[7] = 0;
	  return out;
	}

	/**
	 * Creates a dual quat from a quaternion
	 *
	 * @param {quat2} dual quaternion receiving operation result
	 * @param {quat} q the quaternion
	 * @returns {quat2} dual quaternion receiving operation result
	 * @function
	 */
	function fromRotation(out, q) {
	  out[0] = q[0];
	  out[1] = q[1];
	  out[2] = q[2];
	  out[3] = q[3];
	  out[4] = 0;
	  out[5] = 0;
	  out[6] = 0;
	  out[7] = 0;
	  return out;
	}

	/**
	 * Creates a new dual quat from a matrix (4x4)
	 *
	 * @param {quat2} out the dual quaternion
	 * @param {mat4} a the matrix
	 * @returns {quat2} dual quat receiving operation result
	 * @function
	 */
	function fromMat4(out, a) {
	  //TODO Optimize this
	  var outer = create$2();
	  getRotation(outer, a);
	  var t = new ARRAY_TYPE(3);
	  getTranslation$1(t, a);
	  fromRotationTranslation(out, outer, t);
	  return out;
	}

	/**
	 * Copy the values from one dual quat to another
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the source dual quaternion
	 * @returns {quat2} out
	 * @function
	 */
	function copy$1(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  return out;
	}

	/**
	 * Set a dual quat to the identity dual quaternion
	 *
	 * @param {quat2} out the receiving quaternion
	 * @returns {quat2} out
	 */
	function identity(out) {
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = 0;
	  out[5] = 0;
	  out[6] = 0;
	  out[7] = 0;
	  return out;
	}

	/**
	 * Set the components of a dual quat to the given values
	 *
	 * @param {quat2} out the receiving quaternion
	 * @param {Number} x1 X component
	 * @param {Number} y1 Y component
	 * @param {Number} z1 Z component
	 * @param {Number} w1 W component
	 * @param {Number} x2 X component
	 * @param {Number} y2 Y component
	 * @param {Number} z2 Z component
	 * @param {Number} w2 W component
	 * @returns {quat2} out
	 * @function
	 */
	function set$1(out, x1, y1, z1, w1, x2, y2, z2, w2) {
	  out[0] = x1;
	  out[1] = y1;
	  out[2] = z1;
	  out[3] = w1;

	  out[4] = x2;
	  out[5] = y2;
	  out[6] = z2;
	  out[7] = w2;
	  return out;
	}

	/**
	 * Gets the real part of a dual quat
	 * @param  {quat} out real part
	 * @param  {quat2} a Dual Quaternion
	 * @return {quat} real part
	 */
	var getReal = copy$2;

	/**
	 * Gets the dual part of a dual quat
	 * @param  {quat} out dual part
	 * @param  {quat2} a Dual Quaternion
	 * @return {quat} dual part
	 */
	function getDual(out, a) {
	  out[0] = a[4];
	  out[1] = a[5];
	  out[2] = a[6];
	  out[3] = a[7];
	  return out;
	}

	/**
	 * Set the real component of a dual quat to the given quaternion
	 *
	 * @param {quat2} out the receiving quaternion
	 * @param {quat} q a quaternion representing the real part
	 * @returns {quat2} out
	 * @function
	 */
	var setReal = copy$2;

	/**
	 * Set the dual component of a dual quat to the given quaternion
	 *
	 * @param {quat2} out the receiving quaternion
	 * @param {quat} q a quaternion representing the dual part
	 * @returns {quat2} out
	 * @function
	 */
	function setDual(out, q) {
	  out[4] = q[0];
	  out[5] = q[1];
	  out[6] = q[2];
	  out[7] = q[3];
	  return out;
	}

	/**
	 * Gets the translation of a normalized dual quat
	 * @param  {vec3} out translation
	 * @param  {quat2} a Dual Quaternion to be decomposed
	 * @return {vec3} translation
	 */
	function getTranslation(out, a) {
	  var ax = a[4],
	      ay = a[5],
	      az = a[6],
	      aw = a[7],
	      bx = -a[0],
	      by = -a[1],
	      bz = -a[2],
	      bw = a[3];
	  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
	  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
	  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
	  return out;
	}

	/**
	 * Translates a dual quat by the given vector
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the dual quaternion to translate
	 * @param {vec3} v vector to translate by
	 * @returns {quat2} out
	 */
	function translate(out, a, v) {
	  var ax1 = a[0],
	      ay1 = a[1],
	      az1 = a[2],
	      aw1 = a[3],
	      bx1 = v[0] * 0.5,
	      by1 = v[1] * 0.5,
	      bz1 = v[2] * 0.5,
	      ax2 = a[4],
	      ay2 = a[5],
	      az2 = a[6],
	      aw2 = a[7];
	  out[0] = ax1;
	  out[1] = ay1;
	  out[2] = az1;
	  out[3] = aw1;
	  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
	  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
	  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
	  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
	  return out;
	}

	/**
	 * Rotates a dual quat around the X axis
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the dual quaternion to rotate
	 * @param {number} rad how far should the rotation be
	 * @returns {quat2} out
	 */
	function rotateX(out, a, rad) {
	  var bx = -a[0],
	      by = -a[1],
	      bz = -a[2],
	      bw = a[3],
	      ax = a[4],
	      ay = a[5],
	      az = a[6],
	      aw = a[7],
	      ax1 = ax * bw + aw * bx + ay * bz - az * by,
	      ay1 = ay * bw + aw * by + az * bx - ax * bz,
	      az1 = az * bw + aw * bz + ax * by - ay * bx,
	      aw1 = aw * bw - ax * bx - ay * by - az * bz;
	  rotateX$1(out, a, rad);
	  bx = out[0];
	  by = out[1];
	  bz = out[2];
	  bw = out[3];
	  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
	  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
	  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
	  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
	  return out;
	}

	/**
	 * Rotates a dual quat around the Y axis
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the dual quaternion to rotate
	 * @param {number} rad how far should the rotation be
	 * @returns {quat2} out
	 */
	function rotateY(out, a, rad) {
	  var bx = -a[0],
	      by = -a[1],
	      bz = -a[2],
	      bw = a[3],
	      ax = a[4],
	      ay = a[5],
	      az = a[6],
	      aw = a[7],
	      ax1 = ax * bw + aw * bx + ay * bz - az * by,
	      ay1 = ay * bw + aw * by + az * bx - ax * bz,
	      az1 = az * bw + aw * bz + ax * by - ay * bx,
	      aw1 = aw * bw - ax * bx - ay * by - az * bz;
	  rotateY$1(out, a, rad);
	  bx = out[0];
	  by = out[1];
	  bz = out[2];
	  bw = out[3];
	  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
	  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
	  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
	  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
	  return out;
	}

	/**
	 * Rotates a dual quat around the Z axis
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the dual quaternion to rotate
	 * @param {number} rad how far should the rotation be
	 * @returns {quat2} out
	 */
	function rotateZ(out, a, rad) {
	  var bx = -a[0],
	      by = -a[1],
	      bz = -a[2],
	      bw = a[3],
	      ax = a[4],
	      ay = a[5],
	      az = a[6],
	      aw = a[7],
	      ax1 = ax * bw + aw * bx + ay * bz - az * by,
	      ay1 = ay * bw + aw * by + az * bx - ax * bz,
	      az1 = az * bw + aw * bz + ax * by - ay * bx,
	      aw1 = aw * bw - ax * bx - ay * by - az * bz;
	  rotateZ$1(out, a, rad);
	  bx = out[0];
	  by = out[1];
	  bz = out[2];
	  bw = out[3];
	  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
	  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
	  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
	  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
	  return out;
	}

	/**
	 * Rotates a dual quat by a given quaternion (a * q)
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the dual quaternion to rotate
	 * @param {quat} q quaternion to rotate by
	 * @returns {quat2} out
	 */
	function rotateByQuatAppend(out, a, q) {
	  var qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3],
	      ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];

	  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
	  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
	  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
	  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
	  ax = a[4];
	  ay = a[5];
	  az = a[6];
	  aw = a[7];
	  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
	  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
	  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
	  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
	  return out;
	}

	/**
	 * Rotates a dual quat by a given quaternion (q * a)
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat} q quaternion to rotate by
	 * @param {quat2} a the dual quaternion to rotate
	 * @returns {quat2} out
	 */
	function rotateByQuatPrepend(out, q, a) {
	  var qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3],
	      bx = a[0],
	      by = a[1],
	      bz = a[2],
	      bw = a[3];

	  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
	  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
	  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
	  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
	  bx = a[4];
	  by = a[5];
	  bz = a[6];
	  bw = a[7];
	  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
	  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
	  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
	  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
	  return out;
	}

	/**
	 * Rotates a dual quat around a given axis. Does the normalisation automatically
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the dual quaternion to rotate
	 * @param {vec3} axis the axis to rotate around
	 * @param {Number} rad how far the rotation should be
	 * @returns {quat2} out
	 */
	function rotateAroundAxis(out, a, axis, rad) {
	  //Special case for rad = 0
	  if (Math.abs(rad) < EPSILON) {
	    return copy$1(out, a);
	  }
	  var axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);

	  rad = rad * 0.5;
	  var s = Math.sin(rad);
	  var bx = s * axis[0] / axisLength;
	  var by = s * axis[1] / axisLength;
	  var bz = s * axis[2] / axisLength;
	  var bw = Math.cos(rad);

	  var ax1 = a[0],
	      ay1 = a[1],
	      az1 = a[2],
	      aw1 = a[3];
	  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
	  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
	  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
	  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;

	  var ax = a[4],
	      ay = a[5],
	      az = a[6],
	      aw = a[7];
	  out[4] = ax * bw + aw * bx + ay * bz - az * by;
	  out[5] = ay * bw + aw * by + az * bx - ax * bz;
	  out[6] = az * bw + aw * bz + ax * by - ay * bx;
	  out[7] = aw * bw - ax * bx - ay * by - az * bz;

	  return out;
	}

	/**
	 * Adds two dual quat's
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the first operand
	 * @param {quat2} b the second operand
	 * @returns {quat2} out
	 * @function
	 */
	function add$1(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  out[6] = a[6] + b[6];
	  out[7] = a[7] + b[7];
	  return out;
	}

	/**
	 * Multiplies two dual quat's
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a the first operand
	 * @param {quat2} b the second operand
	 * @returns {quat2} out
	 */
	function multiply$1(out, a, b) {
	  var ax0 = a[0],
	      ay0 = a[1],
	      az0 = a[2],
	      aw0 = a[3],
	      bx1 = b[4],
	      by1 = b[5],
	      bz1 = b[6],
	      bw1 = b[7],
	      ax1 = a[4],
	      ay1 = a[5],
	      az1 = a[6],
	      aw1 = a[7],
	      bx0 = b[0],
	      by0 = b[1],
	      bz0 = b[2],
	      bw0 = b[3];
	  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
	  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
	  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
	  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
	  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
	  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
	  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
	  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
	  return out;
	}

	/**
	 * Alias for {@link quat2.multiply}
	 * @function
	 */
	var mul$1 = multiply$1;

	/**
	 * Scales a dual quat by a scalar number
	 *
	 * @param {quat2} out the receiving dual quat
	 * @param {quat2} a the dual quat to scale
	 * @param {Number} b amount to scale the dual quat by
	 * @returns {quat2} out
	 * @function
	 */
	function scale$1(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  out[6] = a[6] * b;
	  out[7] = a[7] * b;
	  return out;
	}

	/**
	 * Calculates the dot product of two dual quat's (The dot product of the real parts)
	 *
	 * @param {quat2} a the first operand
	 * @param {quat2} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */
	var dot$1 = dot$2;

	/**
	 * Performs a linear interpolation between two dual quats's
	 * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
	 *
	 * @param {quat2} out the receiving dual quat
	 * @param {quat2} a the first operand
	 * @param {quat2} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {quat2} out
	 */
	function lerp$1(out, a, b, t) {
	  var mt = 1 - t;
	  if (dot$1(a, b) < 0) t = -t;

	  out[0] = a[0] * mt + b[0] * t;
	  out[1] = a[1] * mt + b[1] * t;
	  out[2] = a[2] * mt + b[2] * t;
	  out[3] = a[3] * mt + b[3] * t;
	  out[4] = a[4] * mt + b[4] * t;
	  out[5] = a[5] * mt + b[5] * t;
	  out[6] = a[6] * mt + b[6] * t;
	  out[7] = a[7] * mt + b[7] * t;

	  return out;
	}

	/**
	 * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a dual quat to calculate inverse of
	 * @returns {quat2} out
	 */
	function invert(out, a) {
	  var sqlen = squaredLength$1(a);
	  out[0] = -a[0] / sqlen;
	  out[1] = -a[1] / sqlen;
	  out[2] = -a[2] / sqlen;
	  out[3] = a[3] / sqlen;
	  out[4] = -a[4] / sqlen;
	  out[5] = -a[5] / sqlen;
	  out[6] = -a[6] / sqlen;
	  out[7] = a[7] / sqlen;
	  return out;
	}

	/**
	 * Calculates the conjugate of a dual quat
	 * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
	 *
	 * @param {quat2} out the receiving quaternion
	 * @param {quat2} a quat to calculate conjugate of
	 * @returns {quat2} out
	 */
	function conjugate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = a[3];
	  out[4] = -a[4];
	  out[5] = -a[5];
	  out[6] = -a[6];
	  out[7] = a[7];
	  return out;
	}

	/**
	 * Calculates the length of a dual quat
	 *
	 * @param {quat2} a dual quat to calculate length of
	 * @returns {Number} length of a
	 * @function
	 */
	var length$1 = length$2;

	/**
	 * Alias for {@link quat2.length}
	 * @function
	 */
	var len$1 = length$1;

	/**
	 * Calculates the squared length of a dual quat
	 *
	 * @param {quat2} a dual quat to calculate squared length of
	 * @returns {Number} squared length of a
	 * @function
	 */
	var squaredLength$1 = squaredLength$2;

	/**
	 * Alias for {@link quat2.squaredLength}
	 * @function
	 */
	var sqrLen$1 = squaredLength$1;

	/**
	 * Normalize a dual quat
	 *
	 * @param {quat2} out the receiving dual quaternion
	 * @param {quat2} a dual quaternion to normalize
	 * @returns {quat2} out
	 * @function
	 */
	function normalize$1(out, a) {
	  var magnitude = squaredLength$1(a);
	  if (magnitude > 0) {
	    magnitude = Math.sqrt(magnitude);

	    var a0 = a[0] / magnitude;
	    var a1 = a[1] / magnitude;
	    var a2 = a[2] / magnitude;
	    var a3 = a[3] / magnitude;

	    var b0 = a[4];
	    var b1 = a[5];
	    var b2 = a[6];
	    var b3 = a[7];

	    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;

	    out[0] = a0;
	    out[1] = a1;
	    out[2] = a2;
	    out[3] = a3;

	    out[4] = (b0 - a0 * a_dot_b) / magnitude;
	    out[5] = (b1 - a1 * a_dot_b) / magnitude;
	    out[6] = (b2 - a2 * a_dot_b) / magnitude;
	    out[7] = (b3 - a3 * a_dot_b) / magnitude;
	  }
	  return out;
	}

	/**
	 * Returns a string representation of a dual quatenion
	 *
	 * @param {quat2} a dual quaternion to represent as a string
	 * @returns {String} string representation of the dual quat
	 */
	function str$1(a) {
	  return 'quat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ')';
	}

	/**
	 * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {quat2} a the first dual quaternion.
	 * @param {quat2} b the second dual quaternion.
	 * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
	 */
	function exactEquals$1(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
	}

	/**
	 * Returns whether or not the dual quaternions have approximately the same elements in the same position.
	 *
	 * @param {quat2} a the first dual quat.
	 * @param {quat2} b the second dual quat.
	 * @returns {Boolean} true if the dual quats are equal, false otherwise.
	 */
	function equals$1(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5],
	      a6 = a[6],
	      a7 = a[7];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5],
	      b6 = b[6],
	      b7 = b[7];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7));
	}

	var quat2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create$1,
		clone: clone$1,
		fromValues: fromValues$1,
		fromRotationTranslationValues: fromRotationTranslationValues,
		fromRotationTranslation: fromRotationTranslation,
		fromTranslation: fromTranslation,
		fromRotation: fromRotation,
		fromMat4: fromMat4,
		copy: copy$1,
		identity: identity,
		set: set$1,
		getReal: getReal,
		getDual: getDual,
		setReal: setReal,
		setDual: setDual,
		getTranslation: getTranslation,
		translate: translate,
		rotateX: rotateX,
		rotateY: rotateY,
		rotateZ: rotateZ,
		rotateByQuatAppend: rotateByQuatAppend,
		rotateByQuatPrepend: rotateByQuatPrepend,
		rotateAroundAxis: rotateAroundAxis,
		add: add$1,
		multiply: multiply$1,
		mul: mul$1,
		scale: scale$1,
		dot: dot$1,
		lerp: lerp$1,
		invert: invert,
		conjugate: conjugate,
		length: length$1,
		len: len$1,
		squaredLength: squaredLength$1,
		sqrLen: sqrLen$1,
		normalize: normalize$1,
		str: str$1,
		exactEquals: exactEquals$1,
		equals: equals$1
	});

	/**
	 * 2 Dimensional Vector
	 * @module vec2
	 */

	/**
	 * Creates a new, empty vec2
	 *
	 * @returns {vec2} a new 2D vector
	 */
	function create() {
	  var out = new ARRAY_TYPE(2);
	  if (ARRAY_TYPE != Float32Array) {
	    out[0] = 0;
	    out[1] = 0;
	  }
	  return out;
	}

	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 *
	 * @param {vec2} a vector to clone
	 * @returns {vec2} a new 2D vector
	 */
	function clone(a) {
	  var out = new ARRAY_TYPE(2);
	  out[0] = a[0];
	  out[1] = a[1];
	  return out;
	}

	/**
	 * Creates a new vec2 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} a new 2D vector
	 */
	function fromValues(x, y) {
	  var out = new ARRAY_TYPE(2);
	  out[0] = x;
	  out[1] = y;
	  return out;
	}

	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  return out;
	}

	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	function set(out, x, y) {
	  out[0] = x;
	  out[1] = y;
	  return out;
	}

	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  return out;
	}

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  return out;
	}

	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function multiply(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  return out;
	}

	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function divide(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  return out;
	}

	/**
	 * Math.ceil the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to ceil
	 * @returns {vec2} out
	 */
	function ceil(out, a) {
	  out[0] = Math.ceil(a[0]);
	  out[1] = Math.ceil(a[1]);
	  return out;
	}

	/**
	 * Math.floor the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to floor
	 * @returns {vec2} out
	 */
	function floor(out, a) {
	  out[0] = Math.floor(a[0]);
	  out[1] = Math.floor(a[1]);
	  return out;
	}

	/**
	 * Returns the minimum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function min(out, a, b) {
	  out[0] = Math.min(a[0], b[0]);
	  out[1] = Math.min(a[1], b[1]);
	  return out;
	}

	/**
	 * Returns the maximum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function max(out, a, b) {
	  out[0] = Math.max(a[0], b[0]);
	  out[1] = Math.max(a[1], b[1]);
	  return out;
	}

	/**
	 * Math.round the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to round
	 * @returns {vec2} out
	 */
	function round(out, a) {
	  out[0] = Math.round(a[0]);
	  out[1] = Math.round(a[1]);
	  return out;
	}

	/**
	 * Scales a vec2 by a scalar number
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec2} out
	 */
	function scale(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  return out;
	}

	/**
	 * Adds two vec2's after scaling the second operand by a scalar value
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec2} out
	 */
	function scaleAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  return out;
	}

	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance(a, b) {
	  var x = b[0] - a[0],
	      y = b[1] - a[1];
	  return Math.sqrt(x * x + y * y);
	}

	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance(a, b) {
	  var x = b[0] - a[0],
	      y = b[1] - a[1];
	  return x * x + y * y;
	}

	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	  var x = a[0],
	      y = a[1];
	  return Math.sqrt(x * x + y * y);
	}

	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength(a) {
	  var x = a[0],
	      y = a[1];
	  return x * x + y * y;
	}

	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */
	function negate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  return out;
	}

	/**
	 * Returns the inverse of the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to invert
	 * @returns {vec2} out
	 */
	function inverse(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  return out;
	}

	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */
	function normalize(out, a) {
	  var x = a[0],
	      y = a[1];
	  var len = x * x + y * y;
	  if (len > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len = 1 / Math.sqrt(len);
	    out[0] = a[0] * len;
	    out[1] = a[1] * len;
	  }
	  return out;
	}

	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot(a, b) {
	  return a[0] * b[0] + a[1] * b[1];
	}

	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product must by definition produce a 3D vector
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec3} out
	 */
	function cross(out, a, b) {
	  var z = a[0] * b[1] - a[1] * b[0];
	  out[0] = out[1] = 0;
	  out[2] = z;
	  return out;
	}

	/**
	 * Performs a linear interpolation between two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
	 * @returns {vec2} out
	 */
	function lerp(out, a, b, t) {
	  var ax = a[0],
	      ay = a[1];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  return out;
	}

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec2} out
	 */
	function random(out, scale) {
	  scale = scale || 1.0;
	  var r = RANDOM() * 2.0 * Math.PI;
	  out[0] = Math.cos(r) * scale;
	  out[1] = Math.sin(r) * scale;
	  return out;
	}

	/**
	 * Transforms the vec2 with a mat2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2} m matrix to transform with
	 * @returns {vec2} out
	 */
	function transformMat2(out, a, m) {
	  var x = a[0],
	      y = a[1];
	  out[0] = m[0] * x + m[2] * y;
	  out[1] = m[1] * x + m[3] * y;
	  return out;
	}

	/**
	 * Transforms the vec2 with a mat2d
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2d} m matrix to transform with
	 * @returns {vec2} out
	 */
	function transformMat2d(out, a, m) {
	  var x = a[0],
	      y = a[1];
	  out[0] = m[0] * x + m[2] * y + m[4];
	  out[1] = m[1] * x + m[3] * y + m[5];
	  return out;
	}

	/**
	 * Transforms the vec2 with a mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat3} m matrix to transform with
	 * @returns {vec2} out
	 */
	function transformMat3(out, a, m) {
	  var x = a[0],
	      y = a[1];
	  out[0] = m[0] * x + m[3] * y + m[6];
	  out[1] = m[1] * x + m[4] * y + m[7];
	  return out;
	}

	/**
	 * Transforms the vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec2} out
	 */
	function transformMat4(out, a, m) {
	  var x = a[0];
	  var y = a[1];
	  out[0] = m[0] * x + m[4] * y + m[12];
	  out[1] = m[1] * x + m[5] * y + m[13];
	  return out;
	}

	/**
	 * Rotate a 2D vector
	 * @param {vec2} out The receiving vec2
	 * @param {vec2} a The vec2 point to rotate
	 * @param {vec2} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec2} out
	 */
	function rotate(out, a, b, c) {
	  //Translate point to the origin
	  var p0 = a[0] - b[0],
	      p1 = a[1] - b[1],
	      sinC = Math.sin(c),
	      cosC = Math.cos(c);

	  //perform rotation and translate to correct position
	  out[0] = p0 * cosC - p1 * sinC + b[0];
	  out[1] = p0 * sinC + p1 * cosC + b[1];

	  return out;
	}

	/**
	 * Get the angle between two 2D vectors
	 * @param {vec2} a The first operand
	 * @param {vec2} b The second operand
	 * @returns {Number} The angle in radians
	 */
	function angle(a, b) {
	  var x1 = a[0],
	      y1 = a[1],
	      x2 = b[0],
	      y2 = b[1];

	  var len1 = x1 * x1 + y1 * y1;
	  if (len1 > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len1 = 1 / Math.sqrt(len1);
	  }

	  var len2 = x2 * x2 + y2 * y2;
	  if (len2 > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len2 = 1 / Math.sqrt(len2);
	  }

	  var cosine = (x1 * x2 + y1 * y2) * len1 * len2;

	  if (cosine > 1.0) {
	    return 0;
	  } else if (cosine < -1.0) {
	    return Math.PI;
	  } else {
	    return Math.acos(cosine);
	  }
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec2} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str(a) {
	  return 'vec2(' + a[0] + ', ' + a[1] + ')';
	}

	/**
	 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1];
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1];
	  var b0 = b[0],
	      b1 = b[1];
	  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
	}

	/**
	 * Alias for {@link vec2.length}
	 * @function
	 */
	var len = length;

	/**
	 * Alias for {@link vec2.subtract}
	 * @function
	 */
	var sub = subtract;

	/**
	 * Alias for {@link vec2.multiply}
	 * @function
	 */
	var mul = multiply;

	/**
	 * Alias for {@link vec2.divide}
	 * @function
	 */
	var div = divide;

	/**
	 * Alias for {@link vec2.distance}
	 * @function
	 */
	var dist = distance;

	/**
	 * Alias for {@link vec2.squaredDistance}
	 * @function
	 */
	var sqrDist = squaredDistance;

	/**
	 * Alias for {@link vec2.squaredLength}
	 * @function
	 */
	var sqrLen = squaredLength;

	/**
	 * Perform some operation over an array of vec2s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	var forEach = function () {
	  var vec = create();

	  return function (a, stride, offset, count, fn, arg) {
	    var i = void 0,
	        l = void 0;
	    if (!stride) {
	      stride = 2;
	    }

	    if (!offset) {
	      offset = 0;
	    }

	    if (count) {
	      l = Math.min(count * stride + offset, a.length);
	    } else {
	      l = a.length;
	    }

	    for (i = offset; i < l; i += stride) {
	      vec[0] = a[i];vec[1] = a[i + 1];
	      fn(vec, vec, arg);
	      a[i] = vec[0];a[i + 1] = vec[1];
	    }

	    return a;
	  };
	}();

	var vec2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create,
		clone: clone,
		fromValues: fromValues,
		copy: copy,
		set: set,
		add: add,
		subtract: subtract,
		multiply: multiply,
		divide: divide,
		ceil: ceil,
		floor: floor,
		min: min,
		max: max,
		round: round,
		scale: scale,
		scaleAndAdd: scaleAndAdd,
		distance: distance,
		squaredDistance: squaredDistance,
		length: length,
		squaredLength: squaredLength,
		negate: negate,
		inverse: inverse,
		normalize: normalize,
		dot: dot,
		cross: cross,
		lerp: lerp,
		random: random,
		transformMat2: transformMat2,
		transformMat2d: transformMat2d,
		transformMat3: transformMat3,
		transformMat4: transformMat4,
		rotate: rotate,
		angle: angle,
		str: str,
		exactEquals: exactEquals,
		equals: equals,
		len: len,
		sub: sub,
		mul: mul,
		div: div,
		dist: dist,
		sqrDist: sqrDist,
		sqrLen: sqrLen,
		forEach: forEach
	});

	/*!
	 * @maptalks/reshader.gl v0.65.3
	 * LICENSE : UNLICENSED
	 * (c) 2016-2022 maptalks.com
	 */

	/*!
	 * @maptalks/gltf-loader v0.25.2
	 * LICENSE : UNLICENSED
	 * (c) 2016-2022 maptalks.org
	 */ let s$1 = 0;

	function a(e) {
	    return null == e;
	}

	function c(e) {
	    return !a(e);
	}

	function l(e) {
	    for (let t = 1; t < arguments.length; t++) {
	        const n = arguments[t];
	        for (const t in n) e[t] = n[t];
	    }
	    return e;
	}

	function f$1(e) {
	    switch (e) {
	      case 5120:
	        return Int8Array;

	      case 5121:
	        return Uint8Array;

	      case 5122:
	        return Int16Array;

	      case 5123:
	        return Uint16Array;

	      case 5124:
	        return Int32Array;

	      case 5125:
	        return Uint32Array;

	      case 5126:
	        return Float32Array;
	    }
	    throw new Error("unsupported bufferView's component type: " + e);
	}

	function u(e) {
	    return 0 === e.indexOf("data:") && e.indexOf("base64,") > 0;
	}

	function h(e) {
	    const t = function(e) {
	        return "undefined" != typeof self ? self.atob(e) : window.atob(e);
	    }(e.substring(e.indexOf(",") + 1)), n = t.length, r = new Uint8Array(n);
	    for (let e = 0; e < n; e++) r[e] = t.charCodeAt(e);
	    return r.buffer;
	}

	const d = [], m$1 = [], v$1 = [], g$1 = [ 0, 0, 0 ], _$2 = identity$1([]), b$1 = [ 1, 1, 1 ];

	function p$1(e, t, n, r, i, o, s) {
	    const a = f$1(s);
	    if ((0 === i || i === r * a.BYTES_PER_ELEMENT) && o % a.BYTES_PER_ELEMENT == 0) {
	        const i = new a(t, o, n * r);
	        return e.set(i), e;
	    }
	    const c = new Uint8Array(r * a.BYTES_PER_ELEMENT);
	    for (let s = 0; s < n; s++) {
	        let n = null;
	        const l = new Uint8Array(t, i * s + o, r * a.BYTES_PER_ELEMENT);
	        c.set(l), n = new a(c.buffer, 0, r);
	        for (let t = 0; t < r; t++) e[s * r + t] = n[t];
	    }
	    return e;
	}

	const x$1 = "undefined" != typeof TextDecoder ? new TextDecoder("utf-8") : null;

	function y$1(e, t, n) {
	    const r = new Uint8Array(e, t, n);
	    return x$1.decode(r);
	}

	const T$2 = {
	    get: function(e, t = {}) {
	        t || (t = {});
	        const n = new AbortController, r = {
	            signal: n.signal,
	            method: t.method || "GET",
	            referrerPolicy: "origin"
	        };
	        "POST" === t.method && (a(t.body) || (r.body = JSON.stringify(t.body))), a(t.headers) || (r.headers = t.headers), 
	        a(t.credentials) || (r.credentials = t.credentials);
	        const i = fetch(e, r).then(e => {
	            const n = this._parseResponse(e, t.responseType);
	            return n.message ? n : n.then(n => "arraybuffer" === t.responseType ? {
	                data: n,
	                cacheControl: e.headers.get("Cache-Control"),
	                expires: e.headers.get("Expires"),
	                contentType: e.headers.get("Content-Type")
	            } : n).catch(e => {
	                if (!e.code || e.code !== DOMException.ABORT_ERR) throw e;
	            });
	        }).catch(e => {
	            if (!e.code || e.code !== DOMException.ABORT_ERR) throw e;
	        });
	        return i.xhr = n, i;
	    },
	    _parseResponse: (e, t) => 200 !== e.status ? {
	        status: e.status,
	        statusText: e.statusText,
	        message: `incorrect http request with status code(${e.status}): ${e.statusText}`
	    } : "arraybuffer" === t ? e.arrayBuffer() : "json" === t ? e.json() : e.text(),
	    getArrayBuffer: (e, t = {}) => (t || (t = {}), t.responseType = "arraybuffer", T$2.get(e, t)),
	    getJSON: function(e, t = {}) {
	        return t && t.jsonp ? T$2.jsonp(e) : ((t = t || {}).responseType = "json", T$2.get(e, t));
	    },
	    jsonp: function(e) {
	        const t = "_maptalks_jsonp_" + s$1++;
	        e.match(/\?/) ? e += "&callback=" + t : e += "?callback=" + t;
	        let n = document.createElement("script");
	        return n.type = "text/javascript", n.src = e, new Promise(e => {
	            window[t] = function(r) {
	                document.getElementsByTagName("head")[0].removeChild(n), n = null, delete window[t], 
	                e(r);
	            }, document.getElementsByTagName("head")[0].appendChild(n);
	        });
	    }
	};

	class A$2 {
	    constructor(e, t, n) {
	        this._requestImage = e, this.decoders = t, this._supportedFormats = n, this.images = {}, 
	        this._imgRequests = {};
	    }
	    requestImageFromBufferURI(e, t, n) {
	        if (this.buffers[e.id]) {
	            const r = this._createDataView(t, this.buffers[e.id]);
	            return this.getImageByBuffer(r, n);
	        }
	        if (this._imgRequests[e.id]) return this._imgRequests[e.id].then(() => {
	            const r = this._createDataView(t, this.buffers[e.id]);
	            return this.getImageByBuffer(r, n);
	        });
	        if (u(e.uri)) {
	            const r = this.buffers[e.id] = h(e.uri), i = this._createDataView(t, r);
	            return this.getImageByBuffer(i, n);
	        }
	        return this._imgRequests[e.id] = T$2.getArrayBuffer(e.uri, null).then(r => {
	            const i = this.buffers[e.id] = r.data, o = this._createDataView(t, i);
	            return this.getImageByBuffer(o, n);
	        });
	    }
	    getImageByBuffer(e, t) {
	        if (this.images[t.id]) return Promise.resolve(this.images[t.id]);
	        const n = this.decoders;
	        if (n[t.mimeType]) return n[t.mimeType](e, {
	            supportedFormats: this._supportedFormats
	        });
	        if ("image/crn" === t.mimeType || "image/ktx2" === t.mimeType || "image/cttf" === t.mimeType) return console.warn("missing transcoder for " + t.mimeType, ", visit https://maptalks.com/docs/transcoders for details"), 
	        Promise.resolve(null);
	        {
	            const n = new Blob([ e ], {
	                type: t.mimeType
	            }), r = URL.createObjectURL(n);
	            return this._getImageInfo(t.id, r);
	        }
	    }
	    requestExternalImage(e) {
	        if (this.images[e.id]) return Promise.resolve(this.images[e.id]);
	        const t = 0 === e.uri.indexOf("data:image/") ? e.uri : this.rootPath + "/" + e.uri;
	        return this._imgRequests[e.id] ? this._imgRequests[e.id].then(() => this.images[e.id]) : this._imgRequests[e.id] = this._getImageInfo(e.id, t);
	    }
	    _getImageInfo(e, t) {
	        return new Promise((n, r) => {
	            this._requestImage(t, (i, o) => {
	                i ? r(i) : (URL.revokeObjectURL(t), this.images[e] = o, n(this.images[e]));
	            });
	        });
	    }
	}

	const S$1 = [ "SCALAR", 1, "VEC2", 2, "VEC3", 3, "VEC4", 4, "MAT2", 4, "MAT3", 9, "MAT4", 16 ];

	class M$1 {
	    constructor(e, t, n) {
	        this.rootPath = e, this.gltf = t, this._enableInterleave = !1, this.glbBuffer = n, 
	        this.buffers = {}, this.requests = {}, this.accessors = {}, this._compareAccessor();
	    }
	    _requestData(e, t) {
	        const n = this.gltf, r = n.accessors[t];
	        if (void 0 === r.bufferView) return this.accessors[r.id] = this._toBufferData(e, t, null, 0), 
	        Promise.resolve(this.accessors[r.id]);
	        if (r && this.accessors[r.id]) return Promise.resolve(this.accessors[r.id]);
	        return this._requestBufferOfBufferView(n.bufferViews[r.bufferView]).then(n => {
	            const {buffer: i, byteOffset: o} = n;
	            return this.accessors[r.id] = this._toBufferData(e, t, i, o);
	        });
	    }
	    _requestBufferOfBufferView(e) {
	        const t = this.gltf.buffers[e.buffer];
	        if (this.buffers[t.id]) {
	            return Promise.resolve({
	                buffer: this.buffers[t.id],
	                byteOffset: 0
	            });
	        }
	        if (this.requests[t.id]) return this.requests[t.id].then(() => Promise.resolve({
	            buffer: this.buffers[t.id],
	            byteOffset: 0
	        }));
	        if ("binary_glTF" !== e.buffer && "KHR_binary_glTF" !== e.buffer && t.uri) {
	            if (u(t.uri)) {
	                const e = this.buffers[t.id] = h(t.uri);
	                return Promise.resolve({
	                    buffer: e,
	                    byteOffset: 0
	                });
	            }
	            return this.requests[t.id] = T$2.getArrayBuffer(this.rootPath + "/" + t.uri, null).then(e => ({
	                buffer: this.buffers[t.id] = e.data,
	                byteOffset: 0
	            }));
	        }
	        return Promise.resolve({
	            buffer: this.glbBuffer.buffer,
	            byteOffset: this.glbBuffer.byteOffset
	        });
	    }
	    _toBufferData(e, t, n, r = 0) {
	        const i = this.gltf, o = i.accessors[t], s = void 0 !== o.bufferView ? i.bufferViews[o.bufferView] : {}, a = (s.byteOffset || 0) + r, c = this._getTypeItemSize(o.type), l = f$1(o.componentType), u = s.byteStride || 0, h = {
	            array: void 0,
	            name: e,
	            accessorName: t,
	            byteLength: o.count * c * l.BYTES_PER_ELEMENT,
	            componentType: o.componentType,
	            count: o.count,
	            type: o.type,
	            itemSize: c
	        };
	        if (o.min && (h.min = o.min), o.max && (h.max = o.max), n) if (this._enableInterleave) h.byteStride = u, 
	        h.byteOffset = a + (o.byteOffset || 0), !u || u === c * l.BYTES_PER_ELEMENT || "indices" === e || "input" === e || "output" === e || e.indexOf("morph") >= 0 ? (h.array = this._typedArray(n, o.count, c, a + (o.byteOffset || 0), l), 
	        h.array.buffer.byteLength === h.byteLength && (h.byteOffset = 0)) : h.array = new Uint8Array(n, a, s.byteLength); else if (o.interleaved) {
	            h.byteStride = 0, h.byteOffset = 0;
	            const e = new l(o.count * c);
	            h.array = p$1(e, n, o.count, c, u, a + (o.byteOffset || 0), o.componentType);
	        } else h.byteStride = 0, h.array = this._typedArray(n, o.count, c, a + (o.byteOffset || 0), l), 
	        h.byteOffset = h.array.byteOffset; else {
	            h.array = new l(o.count);
	            const e = h.min || h.max;
	            e && (h.array[0] = e[0], h.array[1] = e[1], h.array[2] = e[2]);
	        }
	        return h;
	    }
	    _compareAccessor() {
	        const e = this.gltf.accessors;
	        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) for (let n = 0; n < e.length; n++) t !== n && e[t].bufferView === e[n].bufferView && (e[t].interleaved = e[n].interleaved = !0); else for (const t in e) for (const n in e) t !== n && e[t].bufferView === e[n].bufferView && (e[t].interleaved = e[n].interleaved = !0);
	    }
	    _typedArray(e, t, n, r, i) {
	        return r % i.BYTES_PER_ELEMENT != 0 && (e = e.slice(r, r + t * n * i.BYTES_PER_ELEMENT), 
	        r = 0), new i(e, r, n * t);
	    }
	    _getTypeItemSize(e) {
	        const t = S$1.indexOf(e);
	        return S$1[t + 1];
	    }
	    requestKHRTechniquesWebgl(e) {
	        const {shaders: t} = e, n = t.map(e => {
	            if (void 0 !== e.bufferView) {
	                const t = this.gltf.bufferViews[e.bufferView], {byteLength: n} = t;
	                return this._requestBufferOfBufferView(t).then(r => {
	                    const {buffer: i, byteOffset: o} = r, s = y$1(i, o + (t.byteOffset || 0), n);
	                    return e.content = s, e;
	                });
	            }
	            if (e.uri) {
	                if (u(e.uri)) {
	                    const t = h(e.uri), n = y$1(t, 0, t.byteLength);
	                    return e.content = n, Promise.resolve(e);
	                }
	                return T$2.get(this.rootPath + "/" + e.uri).then(t => (e.content = t, e));
	            }
	            return Promise.resolve(e);
	        });
	        return Promise.all(n).then(() => e);
	    }
	}

	class E$1 extends A$2 {
	    constructor(e, t, n, r, i, o) {
	        super(r, i, o), this.rootPath = e, this.gltf = t, this.requests = {}, this.buffers = {}, 
	        this.glbBuffer = n, this.accessor = new M$1(e, t, n);
	    }
	    iterate(e, t) {
	        const n = this.gltf[t];
	        if (!n) return;
	        let r = 0;
	        for (const t in n) e(t, n[t], r++);
	    }
	    createNode(e) {
	        const t = {};
	        if (c(e.name) && (t.name = e.name), c(e.children) && (t.children = e.children), 
	        c(e.jointName) && (t.jointName = e.jointName), c(e.matrix) && (t.matrix = e.matrix), 
	        c(e.rotation) && (t.rotation = e.rotation), c(e.scale) && (t.scale = e.scale), c(e.translation) && (t.translation = e.translation), 
	        c(e.extras) && (t.extras = e.extras), c(e.meshes) && (t.mesh = e.meshes[0]), t.translation || t.rotation || t.scale) {
	            const e = function(e, t) {
	                if (t.matrix) return t.matrix;
	                if (t.translation || t.scale || t.rotation) {
	                    const n = fromTranslation$1(d, t.translation || g$1), i = fromQuat(m$1, t.rotation || _$2), o = fromScaling(v$1, t.scale || b$1);
	                    return multiply$5(o, i, o), multiply$5(e, n, o);
	                }
	                return identity$2(e);
	            }([], t);
	            delete t.translation, delete t.rotation, delete t.scale, t.matrix = e;
	        }
	        return t;
	    }
	    _loadMaterials(e) {
	        const t = {};
	        for (const n in e) {
	            const r = e[n];
	            let i, o;
	            r.instanceTechnique && r.instanceTechnique.values ? (i = r.instanceTechnique, o = i.values.diffuse) : (i = r, 
	            o = i.values.tex || i.values.diffuseTex || i.values.diffuse);
	            const s = {
	                baseColorTexture: {
	                    index: o
	                }
	            };
	            r.name && (s.name = r.name), r.extensions && (s.extensions = r.extensions), r.extras && (s.extras = r.extras), 
	            t[n] = s;
	        }
	        return t;
	    }
	    _loadImage(e) {
	        if (e.bufferView || e.extensions && (e.extensions.KHR_binary_glTF || e.extensions.binary_glTF)) {
	            const t = e.bufferView ? e : e.extensions.KHR_binary_glTF || e.extensions.binary_glTF;
	            e.extensions && (e.mimeType = t.mimeType, e.width = t.width, e.height = t.height);
	            const n = this.gltf.bufferViews[t.bufferView], r = this.buffers[t.bufferView] = new Uint8Array(this.glbBuffer.buffer, (n.byteOffset || 0) + this.glbBuffer.byteOffset, n.byteLength);
	            return this.getImageByBuffer(r, e);
	        }
	        return this.requestExternalImage(e);
	    }
	    _getTexture(e) {
	        const t = this.gltf.textures[e];
	        if (!t) return null;
	        const n = this.gltf.images[t.source];
	        return this._loadImage(n).then(e => ({
	            image: {
	                array: e.data,
	                width: e.width,
	                height: e.height,
	                index: t.source,
	                mimeType: n.mimeType,
	                name: n.name,
	                extras: n.extras
	            },
	            sampler: this.gltf.samplers[t.sampler]
	        }));
	    }
	    getBaseColorTexture(e) {
	        const t = this.gltf.materials[e];
	        let n, r;
	        if (t.instanceTechnique && t.instanceTechnique.values ? (n = t.instanceTechnique, 
	        r = n.values.diffuse) : (n = t, r = n.values.tex || n.values.diffuseTex || n.values.diffuse), 
	        void 0 === r || void 0 === this.gltf.textures) return null;
	        const i = this.gltf.textures[r];
	        if (!i) return null;
	        return {
	            format: i.format || 6408,
	            internalFormat: i.internalFormat || 6408,
	            type: i.type || 5121,
	            sampler: this.gltf.samplers[i.sampler],
	            source: this.gltf.images[i.source]
	        };
	    }
	    getMaterial() {
	        return null;
	    }
	    getAnimations() {
	        return null;
	    }
	}

	class w$1 extends A$2 {
	    constructor(e, t, n, r, i, o) {
	        super(r, i, o), this.rootPath = e, this.gltf = t, this.glbBuffer = n, this.buffers = {}, 
	        this.requests = {}, this.accessor = new M$1(e, t, n);
	    }
	    iterate(e, t) {
	        const n = this.gltf[t];
	        if (n) for (let t = 0; t < n.length; t++) e(t, n[t], t);
	    }
	    createNode(e) {
	        const t = {};
	        return l(t, e), !c(e.weights) && this.gltf.meshes && c(t.mesh) ? t.weights = this.gltf.meshes[t.mesh].weights : e.weights && (t.weights = e.weights), 
	        t;
	    }
	    _getTexture(e) {
	        const t = this.gltf.textures[e];
	        if (!t) return null;
	        const n = this.gltf.images[t.source];
	        return this._loadImage(n).then(e => {
	            if (!e) return null;
	            const r = {
	                image: {
	                    array: e.data,
	                    mipmap: e.mipmap,
	                    width: e.width,
	                    height: e.height,
	                    index: t.source,
	                    mimeType: n.mimeType,
	                    name: n.name,
	                    extensions: n.extensions,
	                    extras: n.extras
	                }
	            };
	            l(r, t);
	            const i = c(t.sampler) ? this.gltf.samplers[t.sampler] : void 0;
	            return i && (r.sampler = i), e.format && (r.format = e.format), r;
	        });
	    }
	    _loadImage(e) {
	        if (!c(e.bufferView)) return this.requestExternalImage(e);
	        {
	            const t = this.gltf.bufferViews[e.bufferView], n = this.gltf.buffers[t.buffer];
	            if (n.uri) return this.requestImageFromBufferURI(n, t, e);
	            if (this.glbBuffer) return this._requestFromGlbBuffer(t, e);
	        }
	        return null;
	    }
	    _requestFromGlbBuffer(e, t) {
	        const n = this._createDataView(e, this.glbBuffer.buffer, this.glbBuffer.byteOffset);
	        return this.getImageByBuffer(n, t);
	    }
	    _createDataView(e, t, n) {
	        n = n || 0;
	        return new Uint8Array(t, e.byteOffset + n, e.byteLength);
	    }
	    _transformArrayBufferToBase64(e, t) {
	        const n = new Array(e.byteLength);
	        for (let t = 0; t < e.byteLength; t++) n[t] = String.fromCharCode(e[t]);
	        return n.join(""), "data:" + (t = t || "image/png") + ";base64," + function(e) {
	            return "undefined" != typeof self ? self.btoa(e) : window.btoa(e);
	        }(unescape(encodeURIComponent(n)));
	    }
	    getAnimations(e) {
	        const t = [];
	        return e.forEach(e => {
	            t.push(this.getSamplers(e.samplers));
	        }), Promise.all(t).then(t => {
	            for (let n = 0; n < t.length; n++) e[n].samplers = t[n];
	            return e;
	        });
	    }
	    getSamplers(e) {
	        const t = [];
	        for (let n = 0; n < e.length; n++) (c(e[n].input) || c(e[n].output)) && (t.push(this.accessor._requestData("input", e[n].input)), 
	        t.push(this.accessor._requestData("output", e[n].output)));
	        return Promise.all(t).then(t => {
	            for (let n = 0; n < t.length / 2; n++) e[n].input = t[2 * n], e[n].output = t[2 * n + 1], 
	            e[n].interpolation || (e[n].interpolation = "LINEAR");
	            return e;
	        });
	    }
	}

	const O$1 = "undefined" != typeof TextDecoder ? new TextDecoder("utf-8") : null;

	class C$1 {
	    static read(e, t = 0, n = 0) {
	        n || (n = e.byteLength);
	        const r = new DataView(e, t, n), i = r.getUint32(4, !0);
	        if (1 === i) return C$1.readV1(r, t);
	        if (2 === i) return C$1.readV2(e, t);
	        throw new Error("Unsupported glb version : " + i);
	    }
	    static readV1(e, t) {
	        const n = e.getUint32(8, !0), r = e.getUint32(12, !0);
	        if (n !== e.byteLength) throw new Error("Length in GLB header is inconsistent with glb's byte length.");
	        const i = P$1(e.buffer, 20 + t, r);
	        return {
	            json: JSON.parse(i),
	            glbBuffer: {
	                byteOffset: 20 + t + r,
	                buffer: e.buffer,
	                byteLength: n
	            }
	        };
	    }
	    static readV2(e, t) {
	        let n, r, i;
	        const o = new DataView(e, t + 12);
	        let s = 0;
	        for (;s < o.byteLength; ) {
	            const a = o.getUint32(s, !0);
	            s += 4;
	            const c = o.getUint32(s, !0);
	            if (s += 4, 1313821514 === c) n = P$1(e, t + 12 + s, a); else if (5130562 === c) {
	                i = t + 12 + s, r = a;
	                break;
	            }
	            s += a;
	        }
	        return {
	            json: JSON.parse(n),
	            glbBuffer: {
	                byteOffset: i,
	                buffer: e,
	                byteLength: r
	            }
	        };
	    }
	}

	function P$1(e, t, n) {
	    if (O$1) {
	        const r = new Uint8Array(e, t, n);
	        return O$1.decode(r);
	    }
	    return function(e) {
	        const t = e.length;
	        let n = "";
	        for (let r = 0; r < t; ) {
	            let i = e[r++];
	            if (128 & i) {
	                let n = I$1[i >> 3 & 7];
	                if (!(64 & i) || !n || r + n > t) return null;
	                for (i &= 63 >> n; n > 0; n -= 1) {
	                    const t = e[r++];
	                    if (128 != (192 & t)) return null;
	                    i = i << 6 | 63 & t;
	                }
	            }
	            n += String.fromCharCode(i);
	        }
	        return n;
	    }(new Uint8Array(e, t, n));
	}

	const I$1 = [ 1, 1, 1, 1, 2, 2, 3, 0 ], D$1 = [ 0, 0, 0 ], N$1 = [ 0, 0, 0, 1 ], F$1 = [ 1, 1, 1 ], R$2 = {
	    TRANSLATION: [ 0, 0, 0 ],
	    ROTATION: [ 0, 0, 0, 1 ],
	    SCALE: [ 1, 1, 1 ]
	}, B$1 = {
	    PREVIOUS: null,
	    NEXT: null,
	    PREINDEX: null,
	    NEXTINDEX: null,
	    INTERPOLATION: null
	}, L$1 = {
	    _getTRSW(n, r, i, o, s, a, l, f) {
	        const u = c(n) ? r.animations : [ r.animations[0] ], h = {};
	        for (let r = 0; r < u.length; r++) {
	            const d = u[r];
	            if (c(n) && d.name !== n) continue;
	            const m = d.channelsMap[i];
	            if (m) for (let n = 0; n < m.length; n++) {
	                const r = m[n];
	                "translation" === r.target.path ? (this._getAnimateData(s, d.samplers[r.sampler], o, 1), 
	                h.translation = copy$4(D$1, s)) : "rotation" === r.target.path ? (this._getQuaternion(a, d.samplers[r.sampler], o, 1), 
	                h.rotation = copy$2(N$1, a)) : "scale" === r.target.path ? (this._getAnimateData(l, d.samplers[r.sampler], o, 1), 
	                h.scale = copy$4(F$1, l)) : "weights" === r.target.path && f && (this._getAnimateData(f, d.samplers[r.sampler], o, f.length), 
	                h.weights = f);
	            }
	        }
	        return h;
	    },
	    _getAnimateData(e, t, n, r) {
	        switch (t.interpolation) {
	          case "LINEAR":
	            {
	                const i = this._getPreNext(B$1, t, n, 1 * r);
	                i && (e = function(e, t, n, r) {
	                    for (let i = 0; i < e.length; i++) e[i] = t[i] + r * (n[i] - t[i]);
	                    return e;
	                }(e, i.PREVIOUS, i.NEXT, i.INTERPOLATION));
	                break;
	            }

	          case "STEP":
	            {
	                const i = this._getPreNext(B$1, t, n, 1 * r);
	                i && (e = function(e, t) {
	                    for (let n = 0; n < e.length; n++) e[n] = t[n];
	                    return e;
	                }(e, ...i.PREVIOUS));
	                break;
	            }

	          case "CUBICSPLINE":
	            {
	                const i = this._getPreNext(B$1, t, n, 3 * r);
	                i && (e = this._getCubicSpline(e, i, t.input.array, 3 * r));
	                break;
	            }
	        }
	        return e;
	    },
	    _getQuaternion(t, r, i) {
	        switch (r.interpolation) {
	          case "LINEAR":
	            {
	                const n = this._getPreNext(B$1, r, i, 1);
	                n && slerp(t, n.PREVIOUS, n.NEXT, n.INTERPOLATION);
	                break;
	            }

	          case "STEP":
	            {
	                const e = this._getPreNext(B$1, r, i, 1);
	                e && (t = set$3(t, ...e.PREVIOUS));
	                break;
	            }

	          case "CUBICSPLINE":
	            {
	                const e = this._getPreNext(B$1, r, i, 3);
	                if (e) {
	                    for (let t = 0; t < e.PREVIOUS.length; t++) e.PREVIOUS[t] = Math.acos(e.PREVIOUS[t]), 
	                    e.NEXT[t] = Math.acos(e.NEXT[t]);
	                    t = this._getCubicSpline(t, e, r.input.array, 3);
	                    for (let e = 0; e < t.length; e++) t[e] = Math.cos(t[e]);
	                }
	                break;
	            }
	        }
	        return t;
	    },
	    _search(e, t) {
	        const n = e.length;
	        let r, i, o, s = 0, a = n - 1, c = Math.floor((s + a) / 2);
	        for (;s <= n - 1 && a >= 0; ) {
	            if (s === a) return null;
	            if (e[c] <= t && t <= e[c + 1]) {
	                const n = e[c];
	                return r = c, i = c + 1, o = (t - n) / (e[c + 1] - n), {
	                    preIndx: r,
	                    nextIndex: i,
	                    interpolation: o
	                };
	            }
	            t < e[c] ? (a = c, c = Math.floor((s + a) / 2)) : e[c + 1] < t && (s = c, c = Math.floor((s + a) / 2));
	        }
	        return null;
	    },
	    _getPreNext(e, t, n, r) {
	        const i = t.input.array, o = t.output.array, s = t.output.itemSize;
	        (n < i[0] || n > i[i.length - 1]) && (n = Math.max(i[0], Math.min(i[i.length - 1], n))), 
	        n === i[i.length - 1] && (n = i[0]);
	        const a = this._search(i, n);
	        if (!a || !a.nextIndex) return null;
	        const {preIndx: c, nextIndex: l, interpolation: f} = a;
	        e.PREINDEX = c, e.NEXTINDEX = l, e.INTERPOLATION = f;
	        const u = s * r;
	        return e.PREVIOUS = o.subarray(e.PREINDEX * u, (e.PREINDEX + 1) * u), e.NEXT = o.subarray(e.NEXTINDEX * u, (e.NEXTINDEX + 1) * u), 
	        e;
	    },
	    _getCubicSpline(e, t, n, r) {
	        const i = t.INTERPOLATION, o = n[t.PREINDEX], s = n[t.NEXTINDEX];
	        for (let n = 0; n < 3; n++) {
	            const a = t.PREVIOUS[r + n], c = (s - o) * t.PREVIOUS[2 * r + n], l = t.NEXT[3 + n], f = (s - o) * t.NEXT[n], u = (2 * Math.pow(i, 3) - 3 * Math.pow(i, 2) + 1) * a + (Math.pow(i, 3) - 2 * Math.pow(i, 2) + i) * c + (2 * -Math.pow(i, 3) + 3 * Math.pow(i, 2)) * l + (Math.pow(i, 3) - Math.pow(i, 2)) * f;
	            e[n] = u;
	        }
	        return e;
	    },
	    getAnimationClip(e, r, i, o) {
	        const s = e.nodes[r] && e.nodes[r].weights;
	        return set$4(D$1, ...R$2.TRANSLATION), set$3(N$1, ...R$2.ROTATION), set$4(F$1, ...R$2.SCALE), 
	        this._getTRSW(o, e, r, i, D$1, N$1, F$1, s);
	    },
	    getTimeSpan(e) {
	        if (!e.animations) return null;
	        if (e.timeSpan) return e.timeSpan;
	        const t = e.animations;
	        return e.timeSpan = {}, t.forEach((t, n) => {
	            let r = -1 / 0, i = 1 / 0;
	            const o = t.channels;
	            for (let e = 0; e < o.length; e++) {
	                const n = t.samplers[o[e].sampler].input.array;
	                n[n.length - 1] > r && (r = n[n.length - 1]), n[0] < i && (i = n[0]);
	            }
	            e.timeSpan[t.name || n] = {
	                max: r,
	                min: i
	            };
	        }), e.timeSpan;
	    },
	    getTimeSpanByName(e, t) {
	        const n = this.getTimeSpan(e);
	        return n ? c(t) ? n[t] : n[Object.keys(n)[0]] : null;
	    }
	};

	let H$1 = !1;

	if ("undefined" != typeof OffscreenCanvas) {
	    let e;
	    try {
	        e = new OffscreenCanvas(2, 2).getContext("2d");
	    } catch (e) {}
	    e && "undefined" != typeof createImageBitmap && (H$1 = !0);
	}

	const z$1 = "undefined" == typeof document ? null : document.createElement("canvas");

	class k$1 {
	    constructor(e, t, n) {
	        if (this.options = n || {}, this.options.decoders || (this.options.decoders = {}), 
	        t.buffer instanceof ArrayBuffer) {
	            const {json: n, glbBuffer: r} = C$1.read(t.buffer, t.byteOffset, t.byteLength);
	            this._init(e, n, r);
	        } else this._init(e, t);
	        this._accessor = new M$1(this.rootPath, this.gltf, this.glbBuffer), this._checkExtensions();
	    }
	    _checkExtensions() {
	        const e = this.gltf.extensionsRequired;
	        if (e) {
	            if (e.indexOf("KHR_draco_mesh_compression") >= 0 && !this.options.decoders.draco) throw new Error("KHR_draco_mesh_compression is required but @maptalks/transcoders.draco is not loaded");
	            if (e.indexOf("KHR_texture_basisu") >= 0 && !this.options.decoders.ktx2) throw new Error("KHR_texture_basisu is required but @maptalks/transcoders.ktx2 is not loaded");
	        }
	    }
	    _loadExtensions() {
	        const e = this.gltf.extensions;
	        return e && e.KHR_techniques_webgl ? this._accessor.requestKHRTechniquesWebgl(e.KHR_techniques_webgl).then(t => (e.KHR_techniques_webgl = t, 
	        e)) : Promise.resolve(e);
	    }
	    load(e) {
	        const t = this._loadScene(e = e || {}), n = this._loadAnimations(), r = this._loadTextures(), i = this._loadExtensions();
	        return Promise.all([ t, n, r, i ]).then(e => (e[0].animations = e[1], e[0].textures = e[2], 
	        e[0].extensions = e[3], e[0].transferables = this.transferables || [], this.createChannelsMap(e[0]), 
	        e[0]));
	    }
	    createChannelsMap(e) {
	        const t = e.animations;
	        if (t) for (let e = 0; e < t.length; e++) {
	            const n = t[e];
	            n.channelsMap = {};
	            for (let e = 0; e < n.channels.length; e++) {
	                const t = n.channels[e];
	                n.channelsMap[t.target.node] || (n.channelsMap[t.target.node] = []), n.channelsMap[t.target.node].push(t);
	            }
	        }
	    }
	    getExternalResources() {
	        const e = [];
	        if (this.gltf) {
	            const {buffers: t, images: n} = this.gltf;
	            for (let n = 0; n < t.length; n++) t[n].uri && t[n].uri.indexOf("data:application/octet-stream;base64") < 0 && e.push({
	                type: "buffer",
	                uri: t[n].uri
	            });
	            for (let t = 0; t < n.length; t++) n[t].uri && n[t].uri.indexOf("data:image/") < 0 && e.push({
	                type: "image",
	                uri: n[t].uri
	            });
	        }
	        return e;
	    }
	    static getAnimationClip(e, t, n, r) {
	        return L$1.getAnimationClip(e, t, n, r);
	    }
	    static getAnimationTimeSpan(e, t) {
	        return L$1.getTimeSpanByName(e, t);
	    }
	    static getTypedArrayCtor(e) {
	        return f$1(e);
	    }
	    static readInterleavedArray(e, t, n, r, i, o, s) {
	        return p$1(e, t, n, r, i, o, s);
	    }
	    _init(e, t, n) {
	        this.gltf = t, this.glbBuffer = n, this.version = t.asset ? +t.asset.version : 1, 
	        this.rootPath = e, this.buffers = {}, this.requests = {}, this.options.requestImage = H$1 ? G$1 : this.options.requestImage || V$1, 
	        this.options.transferable && (this.transferables = []), 2 === this.version ? (this.adapter = new w$1(e, t, n, this.options.requestImage, this.options.decoders || {}, this.options.supportedFormats || {}), 
	        this.adapter.iterate((e, t, n) => {
	            t.id = "buffer_" + n;
	        }, "buffers"), this.adapter.iterate((e, t, n) => {
	            t.id = "image_" + n;
	        }, "images"), this.adapter.iterate((e, t, n) => {
	            t.id = "accessor_" + n;
	        }, "accessors")) : (this.adapter = new E$1(e, t, n, this.options.requestImage, this.options.decoders || {}, this.options.supportedFormats || {}), 
	        this.adapter.iterate((e, t, n) => {
	            t.id = "accessor_" + n;
	        }, "accessors"), this.adapter.iterate((e, t, n) => {
	            t.id = "image_" + n;
	        }, "images"));
	    }
	    _parseNodes(e, t) {
	        if (e.children && e.children.length > 0) {
	            if (!("number" == typeof (n = e.children[0]) && isFinite(n) || function(e) {
	                return !a(e) && ("string" == typeof e || null !== e.constructor && e.constructor === String);
	            }(e.children[0]))) return e;
	            const r = e.children.map(e => {
	                const n = t[e];
	                return n.nodeIndex = e, this._parseNodes(n, t);
	            });
	            e.children = r;
	        }
	        var n;
	        return e;
	    }
	    _loadScene(e) {
	        return this._loadNodes(e).then(e => {
	            const t = this.scenes = [];
	            let n;
	            for (const t in e) e[t] = this._parseNodes(e[t], e), e[t].nodeIndex = Number(t) ? Number(t) : t;
	            this.adapter.iterate((r, i, o) => {
	                const s = {};
	                i.name && (s.name = i.name), i.nodes && (s.nodes = i.nodes.map(t => e[t])), this.gltf.scene === r && (n = o), 
	                t.push(s);
	            }, "scenes");
	            const r = {
	                asset: this.gltf.asset,
	                scene: n,
	                scenes: t,
	                nodes: e,
	                meshes: this.meshes,
	                materials: this.gltf.materials,
	                skins: this.skins
	            };
	            if (this.gltf.extensions && (r.extensions = this.gltf.extensions), 1 === this.version) {
	                const e = this.adapter._loadMaterials(this.gltf.materials);
	                r.materials = e;
	            }
	            return r;
	        });
	    }
	    _loadNodes(e) {
	        return this._loadMeshes(e).then(() => {
	            const e = this.nodes = {};
	            return this.adapter.iterate((t, n) => {
	                const r = this.adapter.createNode(n, this.meshes, this.skins);
	                e[t] = r;
	            }, "nodes"), e;
	        });
	    }
	    _loadSkins() {
	        this.skins = [];
	        const e = [];
	        return this.adapter.iterate((t, n, r) => {
	            e.push(this._loadSkin(n).then(e => {
	                e.index = r, this.skins.push(e);
	            }));
	        }, "skins"), e;
	    }
	    _loadSkin(e) {
	        return this.adapter.accessor._requestData("inverseBindMatrices", e.inverseBindMatrices).then(t => (e.inverseBindMatrices = t, 
	        t && t.buffer && this.transferables && this.transferables.indexOf(t.buffer) < 0 && this.transferables.push(t.buffer), 
	        e));
	    }
	    _loadAnimations() {
	        const e = this.gltf.animations;
	        return c(e) ? this.adapter.getAnimations(e) : null;
	    }
	    _loadMeshes(e) {
	        this.meshes = {};
	        let t = [];
	        return this.adapter.iterate((n, r, i) => {
	            t.push(this._loadMesh(r, e).then(e => {
	                e.index = i, this.meshes[n] = e;
	            }));
	        }, "meshes"), t = t.concat(this._loadSkins()), Promise.all(t);
	    }
	    _loadMesh(e, t) {
	        const n = e.primitives.map(e => this._loadPrimitive(e, t)).filter(e => !!e);
	        return Promise.all(n).then(t => {
	            const n = {};
	            return l(n, e), n.primitives = t, n;
	        });
	    }
	    _loadTextures() {
	        const e = this.gltf.textures;
	        if (!e) return null;
	        const t = [];
	        for (const n in e) t.push(this.adapter._getTexture(n));
	        return Promise.all(t).then(t => {
	            if (this.transferables) for (let e = 0; e < t.length; e++) if (t[e] && t[e].image.array) {
	                const n = t[e].image.array.buffer;
	                n && this.transferables.indexOf(n) < 0 && this.transferables.push(n);
	            }
	            if (!Array.isArray(e)) {
	                const n = {}, r = Object.keys(e);
	                for (let e = 0; e < t.length; e++) t[e] && (n[r[e]] = t[e]);
	                return n;
	            }
	            return t;
	        });
	    }
	    _loadPrimitive(e, t) {
	        let n;
	        const r = e.extensions;
	        if (r && r.KHR_draco_mesh_compression) {
	            if (!this.options.decoders.draco && (!this.gltf.extensionsRequired || !this.gltf.extensionsRequired.indexOf("KHR_draco_mesh_compression") < 0)) return null;
	            const e = this.options.decoders.draco, {bufferView: i, attributes: o} = r.KHR_draco_mesh_compression, s = this.gltf.bufferViews[i];
	            n = this._accessor._requestBufferOfBufferView(s).then(n => {
	                const {buffer: r, byteOffset: i} = n;
	                let {byteOffset: a, byteLength: c} = s;
	                a || (a = 0);
	                const l = new DataView(r, i + a, c);
	                return e(l, {
	                    attributes: o,
	                    useUniqueIDs: !1,
	                    skipAttributeTransform: t.skipAttributeTransform
	                }).then(e => {
	                    const t = Object.values(e.attributes);
	                    return e.indices && t.push(e.indices), t;
	                });
	            });
	        } else {
	            const t = [], r = e.attributes;
	            for (const e in r) {
	                const n = this.adapter.accessor._requestData(e, r[e]);
	                n && t.push(n);
	            }
	            if (c(e.indices)) {
	                const n = this.adapter.accessor._requestData("indices", e.indices);
	                n && t.push(n);
	            }
	            if (c(e.targets)) for (let n = 0; n < e.targets.length; n++) {
	                const r = e.targets[n];
	                for (const e in r) {
	                    const i = this.adapter.accessor._requestData(`morphTargets_${e}_${n}`, r[e]);
	                    i && t.push(i);
	                }
	            }
	            n = Promise.all(t);
	        }
	        return n.then(t => {
	            let n, r;
	            const i = {
	                attributes: t.reduce((e, t) => {
	                    if ("indices" === t.name) n = t; else if (t.name.indexOf("morphTargets_") > -1) r = r || {}, 
	                    r[t.name.slice(13)] = t; else {
	                        if (!("POSITION" !== t.name || t.min && t.max)) {
	                            const e = [ 1 / 0, 1 / 0, 1 / 0 ], n = [ -1 / 0, -1 / 0, -1 / 0 ], {itemSize: r, array: i} = t, o = i.length / r;
	                            for (let t = 0; t < o; t++) for (let o = 0; o < r; o++) {
	                                const s = t * r + o;
	                                i[s] < e[o] && (e[o] = i[s]), i[s] > n[o] && (n[o] = i[s]);
	                            }
	                            t.min = e, t.max = n;
	                        }
	                        e[t.name] = t;
	                    }
	                    return this.transferables && t.array.buffer && this.transferables.indexOf(t.array.buffer) < 0 && this.transferables.push(t.array.buffer), 
	                    e;
	                }, {}),
	                material: e.material
	            };
	            return n && (i.indices = n), r && (i.morphTargets = r), i.mode = c(e.mode) ? e.mode : 4, 
	            c(e.extras) && (i.extras = e.extras), i;
	        });
	    }
	}

	function V$1(e, t) {
	    const n = new Image;
	    n.crossOrigin = "", n.onload = () => {
	        if (!z$1) return void t(new Error("There is no canvas to draw image!"));
	        z$1.width = n.width, z$1.height = n.height;
	        const e = z$1.getContext("2d");
	        e.drawImage(n, 0, 0, n.width, n.height);
	        const r = e.getImageData(0, 0, n.width, n.height), i = {
	            width: n.width,
	            height: n.height,
	            data: new Uint8Array(r.data)
	        };
	        t(null, i);
	    }, n.onerror = function(e) {
	        t(e);
	    }, n.src = e;
	}

	let j$1, U$1;

	function G$1(e, t) {
	    j$1 || (j$1 = new OffscreenCanvas(2, 2), U$1 = j$1.getContext("2d")), fetch(e).then(e => e.blob()).then(e => createImageBitmap(e)).then(e => {
	        j$1.width = e.width, j$1.height = e.height, U$1.drawImage(e, 0, 0);
	        const n = U$1.getImageData(0, 0, j$1.width, j$1.height);
	        t(null, {
	            width: e.width,
	            height: e.height,
	            data: new Uint8Array(n.data)
	        });
	    });
	}

	function X$1(e) {
	    return !q$1(e) && ("string" == typeof e || null !== e.constructor && e.constructor === String);
	}

	function q$1(e) {
	    return null == e;
	}

	function W$1(e) {
	    return !q$1(e);
	}

	function K$1(e) {
	    return !q$1(e) && ("function" == typeof e || null !== e.constructor && e.constructor === Function);
	}

	const Y$1 = "function" == typeof Object.assign;

	function J$1(e) {
	    if (Y$1) Object.assign.apply(Object, arguments); else for (let t = 1; t < arguments.length; t++) {
	        const n = arguments[t];
	        for (const t in n) e[t] = n[t];
	    }
	    return e;
	}

	function Z$1(e) {
	    for (let t = 1; t < arguments.length; t++) {
	        const n = arguments[t];
	        for (const t in n) null != n[t] && (e[t] = n[t]);
	    }
	    return e;
	}

	function Q$1(e) {
	    return "number" == typeof e && !isNaN(e);
	}

	function $$1(e, t, n) {
	    return e * (1 - n) + t * n;
	}

	function ee(e) {
	    return Array.isArray(e) || e instanceof Uint8Array || e instanceof Int8Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Uint8ClampedArray || e instanceof Float32Array || e instanceof Float64Array;
	}

	function te(e) {
	    return (e = Math.abs(e)) < 128 ? Int8Array : e < 32768 ? Int16Array : Float32Array;
	}

	function ne(e, t, n) {
	    return Math.min(n, Math.max(t, e));
	}

	function re(e) {
	    return e && e.hasExtension("oes_vertex_array_object");
	}

	function ie(e, t) {
	    return Object.prototype.hasOwnProperty.call(e, t);
	}

	function oe(e) {
	    if (e.data) {
	        if (e.data.BYTES_PER_ELEMENT) return e.data.length * e.data.BYTES_PER_ELEMENT;
	        if (e.data.length) return 4 * e.data.length;
	    } else {
	        if (e.BYTES_PER_ELEMENT) return e.length * e.BYTES_PER_ELEMENT;
	        if (e.length) return 4 * e.length;
	        if (e.buffer && e.buffer.destroy) return e.buffer._buffer.byteLength;
	    }
	    return 0;
	}

	function se(e) {
	    return e.width * e.height * ce(e.format) * ae(e.type) * ("textureCube" === e._reglType ? 6 : 1);
	}

	function ae(e) {
	    return "uint8" === e ? 1 : "uint16" === e || "float16" === e || "half float" === e ? 2 : "uint32" === e || "float" === e || "float32" === e ? 4 : 0;
	}

	function ce(e) {
	    return "depth" === e || "alpha" === e || "luminance" === e ? 1 : "luminance alpha" === e || "depth stencil" === e ? 2 : "srgba" === e || "rgb5 a1" === e || "rgba" === e.substring(0, 4) ? 4 : "srgb" === e || "rgb" === e.substring(0, 3) ? 3 : 1;
	}

	function le(e) {
	    if (!e.componentType) return !1;
	    const t = k$1.getTypedArrayCtor(e.componentType);
	    return e.byteStride > 0 && e.byteStride !== e.itemSize * t.BYTES_PER_ELEMENT;
	}

	function fe(e) {
	    return e && (e.stride > 0 || le(e));
	}

	var ue = Object.freeze({
	    __proto__: null,
	    isString: X$1,
	    isNil: q$1,
	    defined: W$1,
	    isFunction: K$1,
	    extend: J$1,
	    extend1: Z$1,
	    extend2: function(e) {
	        for (let t = 1; t < arguments.length; t++) {
	            const n = arguments[t];
	            for (const t in n) void 0 === e[t] && (e[t] = n[t]);
	        }
	        return e;
	    },
	    isNumber: Q$1,
	    log2: function(e) {
	        if (Math.log2) return Math.log2(e);
	        const t = Math.log(e) * Math.LOG2E, n = Math.round(t);
	        return Math.abs(n - t) < 1e-14 ? n : t;
	    },
	    normalize: function(e, t) {
	        let n = 0;
	        for (let e = 0, r = t.length; e < r; e++) n += t[e];
	        for (let r = 0, i = t.length; r < i; r++) e[r] = t[r] / n;
	        return e;
	    },
	    interpolate: $$1,
	    isArray: ee,
	    lerp: function(e, t, n, r) {
	        for (let i = 0; i < e.length; i++) e[i] = t[i] + r * (n[i] - t[i]);
	        return e;
	    },
	    set: function(e, t) {
	        for (let n = 0; n < e.length; n++) e[n] = t[n];
	        return e;
	    },
	    getPosArrayType: te,
	    clamp: ne,
	    isSupportVAO: re,
	    hasOwn: ie,
	    getBufferSize: oe,
	    getTexMemorySize: se,
	    getTextureByteWidth: ae,
	    getTextureChannels: ce,
	    isInStride: le,
	    isInterleaved: fe,
	    getSupportedFormats: function(e) {
	        return {
	            etc: !!e.getExtension("WEBGL_compressed_texture_etc"),
	            etc1: !!e.getExtension("WEBGL_compressed_texture_etc1"),
	            s3tc: !!e.getExtension("WEBGL_compressed_texture_s3tc"),
	            pvrtc: !!e.getExtension("WEBGL_compressed_texture_pvrtc"),
	            astc: !!e.getExtension("WEBGL_compressed_texture_astc"),
	            bc7: !!e.getExtension("EXT_texture_compression_bptc")
	        };
	    }
	});

	const he = e => class extends e {
	    on(e, t) {
	        return this._events || (this._events = {
	            type: [ t ]
	        }), this._events[e] = this._events[e] || [], this._events[e].push(t), this;
	    }
	    once(e, t) {
	        return this.on(e, this._wrapOnce(e, t));
	    }
	    off(e, t) {
	        return this._events && this._events[e] ? (this._events[e].splice(this._events[e].indexOf(t), 1), 
	        this) : this;
	    }
	    fire(e, t = {}) {
	        if (!this._events || !this._events[e]) return this;
	        t.target || (t.target = this);
	        const n = this._events[e].slice(0);
	        for (const e of n) e(t);
	        return this;
	    }
	    _wrapOnce(e, t) {
	        const n = this;
	        let r = !1;
	        return function i(o) {
	            r || (r = !0, t(o), n.off(e, i));
	        };
	    }
	}, de = "__reshader_disposed";

	var me = Object.freeze({
	    __proto__: null,
	    KEY_DISPOSED: de,
	    WEBGL_EXTENSIONS: [ "ANGLE_instanced_arrays", "OES_element_index_uint", "OES_standard_derivatives" ],
	    WEBGL_OPTIONAL_EXTENSIONS: [ "OES_vertex_array_object", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_texture_float", "OES_texture_float_linear", "WEBGL_depth_texture", "EXT_shader_texture_lod", "EXT_texture_filter_anisotropic" ]
	});

	var ve = he(class {
	    constructor(e, t) {
	        if (K$1(e)) {
	            this._texture = e, e = this.config = {};
	            for (const t in this._texture) ie(this._texture, t) && (K$1(this._texture[t]) || (e[t] = this._texture[t]));
	        } else if (this.config = e || {}, this.resLoader = t, !e.url && !e.promise || e.data) e.data && this._needPowerOf2() && (e.data instanceof Image && (e.data = ge(e.data), 
	        e.width = e.data.width, e.height = e.data.height), e.hdr || !ee(e.data) || _e(e.width) && _e(e.height) || (e.data = function(e, t, n) {
	            let r = t, i = n;
	            _e(t) || (r = be(t));
	            _e(n) || (i = be(n));
	            const o = new ImageData(new Uint8ClampedArray(e), t, n), s = document.createElement("canvas");
	            s.width = t, s.height = n, s.getContext("2d").putImageData(o, 0, 0);
	            const a = document.createElement("canvas");
	            return a.width = r, a.height = i, a.getContext("2d").drawImage(s, 0, 0, r, i), console.warn(`Texture's size is not power of two, resize from (${t}, ${n}) to (${r}, ${i})`), 
	            a;
	        }(e.data, e.width, e.height), e.width = e.data.width, e.height = e.data.height)); else {
	            this._loading = !0;
	            const n = this;
	            let r;
	            if (e.promise) r = e.promise; else {
	                let n;
	                n = e.arrayBuffer ? t.getArrayBuffer : t.get, r = n.call(t, e.url);
	            }
	            e.data = t.getDefaultTexture(e.url), this.promise = r, r.then(e => (delete this.promise, 
	            n._loading = !1, n.config ? (e.data instanceof Image && this._needPowerOf2() && (e.data = ge(e.data)), 
	            n.onLoad(e), Array.isArray(e) || (e = [ e ]), n.fire("complete", {
	                target: this,
	                resources: e
	            }), e) : e)).catch(e => {
	                console.error("error when loading texture image.", e), n.fire("error", {
	                    target: this,
	                    error: e
	                });
	            });
	        }
	    }
	    isReady() {
	        return !this._loading;
	    }
	    set(e, t) {
	        return this.config[e] = t, this.dirty = !0, this;
	    }
	    get(e) {
	        return this.config[e];
	    }
	    getREGLTexture(e) {
	        return this._texture || (this._texture = this.createREGLTexture(e), this.config.persistent || (this.config.data && (this.config.data = []), 
	        this.config.faces && (this.config.faces = []), this.config.image && (this.config.image.array = []))), 
	        this.dirty && this._updateREGL(), this._texture;
	    }
	    getMemorySize() {
	        if (!this.config) return 0;
	        const {width: e, height: t, type: n, format: r} = this.config, i = ae(n || "uint8"), o = ce(r || "rgba");
	        return this.config.faces ? e * t * i * o * 6 : e * t * i * o;
	    }
	    _updateREGL() {
	        this._texture && !this._texture[de] && this._texture(this.config), this.dirty = !1;
	    }
	    dispose() {
	        this.config && this.config.url && (URL.revokeObjectURL(this.config.url), this.resLoader.disposeRes(this.config.url)), 
	        this._texture && !this._texture[de] && (this._texture._reshader_refCount && this._texture._reshader_refCount--, 
	        this._texture._reshader_refCount || (this._texture.destroy(), this._texture[de] = !0, 
	        delete this._texture)), delete this.resLoader;
	        const e = this.config && this.config.url;
	        delete this.config, e && this.fire("disposed", {
	            target: this,
	            url: e
	        });
	    }
	    _needPowerOf2() {
	        const e = this.config;
	        return e.wrap && "clamp" !== e.wrap || e.wrapS && "clamp" !== e.wrapS || e.wrapT && "clamp" !== e.wrapT || e.min && "nearest" !== e.min && "linear" !== e.min;
	    }
	});

	function ge(e) {
	    if (_e(e.width) && _e(e.height)) return e;
	    let t = e.width, n = e.height;
	    _e(t) || (t = be(t)), _e(n) || (n = be(n));
	    const r = document.createElement("canvas");
	    r.width = t, r.height = n, r.getContext("2d").drawImage(e, 0, 0, t, n);
	    const i = e.src, o = i.lastIndexOf("/") + 1, s = i.substring(o);
	    return console.warn(`Texture(${s})'s size is not power of two, resize from (${e.width}, ${e.height}) to (${t}, ${n})`), 
	    r;
	}

	function _e(e) {
	    return 0 == (e & e - 1) && 0 !== e;
	}

	function be(e) {
	    return Math.pow(2, Math.floor(Math.log(e) / Math.LN2));
	}

	const pe = {};

	class xe {
	    constructor(e) {
	        this.regl = e;
	    }
	    render(e, t, n, r) {
	        e.setUniforms(t || pe), e.setFramebuffer(r);
	        let i = 0;
	        if (n) {
	            const {opaques: t, transparents: r} = n.getSortedMeshes();
	            i += e.draw(this.regl, t), i += e.draw(this.regl, r);
	        } else i += e.draw(this.regl);
	        return i;
	    }
	    clear(e) {
	        this.regl.clear(e);
	    }
	}

	class ye extends xe {}

	class Te {
	    constructor(e, t) {
	        this.position = e, this.index = t, this.faces = [], this.neighbors = [];
	    }
	    addUniqueNeighbor(e) {
	        -1 === this.neighbors.indexOf(e) && this.neighbors.push(e);
	    }
	}

	class Ae {
	    constructor(e, t, n, r) {
	        this.a = r.a, this.b = r.b, this.c = r.c, this.v1 = e, this.v2 = t, this.v3 = n, 
	        this.normal = [], this.computeNormal(), e.faces.push(this), e.addUniqueNeighbor(t), 
	        e.addUniqueNeighbor(n), t.faces.push(this), t.addUniqueNeighbor(e), t.addUniqueNeighbor(n), 
	        n.faces.push(this), n.addUniqueNeighbor(e), n.addUniqueNeighbor(t);
	    }
	    computeNormal() {
	        const e = this.v1.position, n = this.v2.position, r = sub$2([], this.v3.position, n), i = sub$2([], e, n), o = cross$1([], r, i);
	        normalize$4(this.normal, o);
	    }
	    hasVertex(e) {
	        return e === this.v1 || e === this.v2 || e === this.v3;
	    }
	}

	/*!
	 * Contains code from google filament
	 * https://github.com/google/filament/
	 * License Apache-2.0
	 */ const Se = [], Me = [], Ee = [], we = [];

	function Oe(n, r, i) {
	    const o = cross$1(Me, r, i), s = function(e, t, n, r, i, o, s, a, c, l) {
	        return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e[4] = o, e[5] = s, e[6] = a, e[7] = c, 
	        e[8] = l, e;
	    }(Se, i[0], i[1], i[2], ...o, ...r);
	    n = fromMat3(n, s);
	    if ((n = function(t) {
	        return t[3] < 0 ? scale$2(t, t, -1) : t;
	    }(n = normalize$2(n, n)))[3] < 1 / 32767) {
	        n[3] = 1 / 32767;
	        const e = Math.sqrt(.9999999990686206);
	        n[0] *= e, n[1] *= e, n[2] *= e;
	    }
	    const a = i[3] > 0 ? cross$1(Ee, i, r) : cross$1(Ee, r, i), c = cross$1(we, i, r);
	    return dot$4(c, a) < 0 && scale$2(n, n, -1), n;
	}

	function Ce(e, t, n) {
	    return e[0] = t[n], e[1] = t[n + 1], e[2] = t[n + 2], e;
	}

	function Pe(e, t, n) {
	    return e[0] = t[n], e[1] = t[n + 1], e;
	}

	const Ie = [], De = identity$2([]), Ne = {
	    min: [],
	    max: []
	};

	class Fe {
	    constructor(e, t) {
	        this.min = e || [ 1 / 0, 1 / 0, 1 / 0 ], this.max = t || [ -1 / 0, -1 / 0, -1 / 0 ], 
	        this.updateVertex();
	    }
	    static copy(e, n) {
	        copy$4(e.min, n.min), copy$4(e.max, n.max);
	        for (let r = 0; r < n.vertex.length; r++) copy$4(e.vertex[r], n.vertex[r]);
	        return e;
	    }
	    combine(e) {
	        return e ? (Array.isArray(e) && (copy$4(Ne.min, e[0]), copy$4(Ne.max, e[1]), e = Ne), 
	        e.min[0] < this.min[0] && (this.min[0] = e.min[0], this._dirty = !0), e.min[1] < this.min[1] && (this.min[1] = e.min[1], 
	        this._dirty = !0), e.min[2] < this.min[2] && (this.min[2] = e.min[2], this._dirty = !0), 
	        e.max[0] > this.max[0] && (this.max[0] = e.max[0], this._dirty = !0), e.max[1] > this.max[1] && (this.max[1] = e.max[1], 
	        this._dirty = !0), e.max[2] > this.max[2] && (this.max[2] = e.max[2], this._dirty = !0), 
	        this) : this;
	    }
	    dirty() {
	        return this._dirty = !0, this;
	    }
	    getCenter() {
	        return this.center || (this.center = [], this._dirty = !0), this._dirty && (add$4(this.center, this.min, this.max), 
	        scale$4(this.center, this.center, .5)), this._dirty = !1, this.center;
	    }
	    containPoint(e) {
	        const t = this.min, n = this.max;
	        return t[0] <= e[0] && t[1] <= e[1] && t[2] <= e[2] && n[0] >= e[0] && n[1] >= e[1] && n[2] >= e[2];
	    }
	    isFinite() {
	        const e = this.min, t = this.max;
	        return isFinite(e[0]) && isFinite(e[1]) && isFinite(e[2]) && isFinite(t[0]) && isFinite(t[1]) && isFinite(t[2]);
	    }
	    updateVertex() {
	        if (!this.vertex) {
	            this.vertex = [];
	            for (let e = 0; e < 8; e++) this.vertex.push([]);
	        }
	        return this.vertex[0][0] = this.min[0], this.vertex[0][1] = this.min[1], this.vertex[0][2] = this.min[2], 
	        this.vertex[1][0] = this.min[0], this.vertex[1][1] = this.min[1], this.vertex[1][2] = this.max[2], 
	        this.vertex[2][0] = this.min[0], this.vertex[2][1] = this.max[1], this.vertex[2][2] = this.max[2], 
	        this.vertex[3][0] = this.min[0], this.vertex[3][1] = this.max[1], this.vertex[3][2] = this.min[2], 
	        this.vertex[4][0] = this.max[0], this.vertex[4][1] = this.min[1], this.vertex[4][2] = this.min[2], 
	        this.vertex[5][0] = this.max[0], this.vertex[5][1] = this.min[1], this.vertex[5][2] = this.max[2], 
	        this.vertex[6][0] = this.max[0], this.vertex[6][1] = this.max[1], this.vertex[6][2] = this.max[2], 
	        this.vertex[7][0] = this.max[0], this.vertex[7][1] = this.max[1], this.vertex[7][2] = this.min[2], 
	        this.vertex;
	    }
	    copy() {
	        return new Fe(this.min.slice(), this.max.slice());
	    }
	    equals(e) {
	        if (!equals$4(this.min, e.min) || !equals$4(this.max, e.max)) return !1;
	        const n = e.vertex;
	        for (let e = 0; e < this.vertex.length; e++) if (!equals$4(n[e], this.vertex[e])) return !1;
	        return !0;
	    }
	    transform(e, n) {
	        if (e = e || De, (n = n || De)[1] || n[2] || n[4] || n[6] || n[8] || n[9]) {
	            const i = this.vertex, o = multiply$5(Ie, n, e);
	            for (let e = 0; e < i.length; e++) transformMat4$2(this.vertex[e], this.vertex[e], o);
	            const s = this.vertex.map(e => e[0]), a = this.vertex.map(e => e[1]), c = this.vertex.map(e => e[2]), l = Math.min(...s), f = Math.max(...s), u = Math.min(...a), h = Math.max(...a), d = Math.min(...c), m = Math.max(...c);
	            set$4(this.min, l, u, d), set$4(this.max, f, h, m);
	        } else {
	            const i = multiply$5(Ie, n, e);
	            transformMat4$2(this.min, this.min, i), transformMat4$2(this.max, this.max, i);
	        }
	        return this;
	    }
	}

	const Re = {
	    5120: "int8",
	    5122: "int16",
	    5124: "int32",
	    5121: "uint8",
	    5123: "uint16",
	    5125: "uint32",
	    5126: "float"
	}, Be = {
	    5120: 1,
	    5122: 2,
	    5124: 4,
	    5121: 1,
	    5123: 2,
	    5125: 4,
	    5126: 4
	}, Le = {
	    positionSize: 3,
	    primitive: "triangles",
	    positionAttribute: "aPosition",
	    normalAttribute: "aNormal",
	    uv0Attribute: "aTexCoord",
	    uv1Attribute: "aTexCoord1",
	    color0Attribute: "aColor0",
	    tangentAttribute: "aTangent"
	};

	let He = 1;

	const ze = "_reshader_refCount";

	class ke {
	    constructor(e, t, n, r) {
	        this._version = 0, this.data = e, this.elements = t, this.desc = J$1({}, Le, r);
	        const i = e[this.desc.positionAttribute];
	        n || (t ? n = Ve(t) : i && i.length ? n = i.length / this.desc.positionSize : i && i.interleavedArray ? n = i.interleavedArray.length / this.desc.positionSize : i && i.array && (n = i.array.length / this.desc.positionSize)), 
	        this.count = n, this.elements || (this.elements = n), this.properties = {}, this._buffers = {}, 
	        this._vao = {}, this.getVertexCount(), this._prepareData(), this.updateBoundingBox();
	    }
	    set version(e) {
	        throw new Error("Geometry.version is read only.");
	    }
	    get version() {
	        return this._version;
	    }
	    _prepareData() {
	        if (!this.data) return;
	        const e = this._buffers || {};
	        for (const t in this.data) {
	            const n = this.data[t];
	            if (n) if (n.buffer && n.buffer.destroy) {
	                const e = n.buffer;
	                e[ze] || (e[ze] = 0), e[ze]++;
	            } else if (n && n.array) if (le(n)) {
	                let r = n.array.buffer.__id;
	                r || (r = n.array.buffer.__id = He++), this.data[t] = {
	                    buffer: r,
	                    offset: n.byteOffset,
	                    stride: n.byteStride,
	                    type: Re[n.componentType],
	                    size: n.itemSize,
	                    count: n.count,
	                    componentType: n.componentType
	                }, e[r] || (e[r] = {
	                    data: n.array.buffer
	                });
	            } else this.data[t] = n.array;
	        }
	        this._buffers = e;
	        const t = this.elements;
	        t && t.array && (this.elements = this.elements.array);
	    }
	    getAttrData(e) {
	        const t = e.key, n = !this._reglData || !this._reglData[t];
	        if (this._reglData || (this._reglData = {}), n) {
	            const e = this._reglData[t] = {}, n = this.data, {positionAttribute: r, normalAttribute: i, uv0Attribute: o, uv1Attribute: s, tangentAttribute: a, color0Attribute: c} = this.desc;
	            J$1(e, this.data), e.aPosition = n[r], n[i] && (e.aNormal = n[i]), n[o] && (e.aTexCoord = n[o]), 
	            n[s] && (e.aTexCoord1 = n[s]), n[a] && (e.aTangent = n[a]), n[c] && (e.aColor0 = n[c]);
	        }
	        return this._reglData[t];
	    }
	    getREGLData(e, t, n) {
	        this.getAttrData(t);
	        const r = !this._reglData || !this._reglData[t.key];
	        if (re(e) && !n) {
	            const n = t && t.key || "default";
	            if (!this._vao[n] || r || this._elementsUpdated) {
	                const r = this._reglData[t.key], i = this.getVertexCount(), o = [];
	                for (let e = 0; e < t.length; e++) {
	                    const n = t[e].name, s = r[n] && r[n].buffer;
	                    if (s && s.destroy) o.push(void 0 !== r[n].stride ? r[n] : s); else {
	                        const e = r[n];
	                        if (!e) continue;
	                        const t = (e.data && ee(e.data) ? e.data.length : e.length) / i;
	                        e.data ? (e.dimension = t, o.push(e)) : o.push({
	                            data: e,
	                            dimension: t
	                        });
	                    }
	                }
	                const s = {
	                    attributes: o,
	                    primitive: this.getPrimitive()
	                };
	                if (this.elements && !Q$1(this.elements)) {
	                    s.elements = {
	                        primitive: this.getPrimitive(),
	                        data: this.elements
	                    };
	                    const e = this.getElementsType(this.elements);
	                    e && (s.elements.type = e);
	                }
	                this._vao[n] ? this._vao[n].vao(s) : this._vao[n] = {
	                    vao: e.vao(s)
	                }, delete this._elementsUpdated;
	            }
	            return this._vao[n];
	        }
	        return this._reglData[t.key];
	    }
	    _isAttrChanged(e) {
	        if (e === this._activeAttributes) return !1;
	        if (e.length !== this._activeAttributes.length) return !0;
	        for (let t = 0; t < e.length; t++) if (e[t] !== this._activeAttributes[t]) return !0;
	        return !1;
	    }
	    generateBuffers(e, t) {
	        const n = this._buffers;
	        for (const t in n) n[t].buffer || (n[t].buffer = e.buffer(n[t].data)), delete n[t].data;
	        const r = this.data, i = this.getVertexCount(), o = {};
	        for (const t in r) if (r[t]) {
	            if (void 0 === r[t].buffer || r[t].buffer instanceof ArrayBuffer) {
	                const n = r[t].data ? r[t] : {
	                    data: r[t]
	                };
	                n.dimension = (r[t].data ? r[t].data : r[t]).length / i;
	                const s = e.buffer(n);
	                s[ze] = 1, o[t] = {
	                    buffer: s
	                };
	            } else r[t].buffer.destroy ? o[t] = r[t] : n[r[t].buffer] && (o[t] = J$1({}, r[t]), 
	            o[t].buffer = n[r[t].buffer].buffer);
	            delete r[t].array;
	        }
	        this.data = o, delete this._reglData;
	        const s = t && t.excludeElementsInVAO;
	        if ((!re(e) || s) && this.elements && !Q$1(this.elements)) {
	            const t = {
	                primitive: this.getPrimitive(),
	                data: this.elements
	            }, n = this.getElementsType(this.elements);
	            n && (t.type = n), this.elements = this.elements.destroy ? this.elements : e.elements(t);
	            const r = this.elements;
	            r[ze] || (r[ze] = 0), r[ze]++;
	        }
	    }
	    getVertexCount() {
	        const {positionAttribute: e, positionSize: t} = this.desc;
	        let n = this.data[e];
	        return n.data && (n = n.data), n.array && (n = n.array), ee(n) ? this._vertexCount = Math.ceil(n.length / t) : n && void 0 !== n.count && (this._vertexCount = n.count), 
	        this._vertexCount;
	    }
	    addBuffer(e, t) {
	        return this._buffers[e] = {
	            data: t
	        }, delete this._reglData, this._deleteVAO(), this;
	    }
	    updateBuffer(e, t) {
	        if (!this._buffers[e]) throw new Error(`invalid buffer ${e} in geometry`);
	        return this._buffers[e].buffer ? this._buffers[e].buffer.subdata(t) : this._buffers[e].data = t, 
	        delete this._reglData, this._deleteVAO(), this;
	    }
	    updateData(e, t) {
	        const n = this.data[e];
	        if (!n) return this;
	        let r;
	        this._incrVersion(), this.data[e] = t, n.buffer && n.buffer.destroy && (r = n);
	        const i = this.getVertexCount();
	        e === this.desc.positionAttribute && this.updateBoundingBox();
	        const o = this.getVertexCount();
	        return r && (o <= i ? r.buffer.subdata(t) : r.buffer(t), this.data[e] = r), this._prepareData(), 
	        this.desc.positionAttribute === e && (this._posDirty = !0), delete this._reglData, 
	        this;
	    }
	    updateSubData(e, t, n) {
	        const r = this.data[e];
	        if (!r) return this;
	        let i;
	        if (this._incrVersion(), r.buffer && r.buffer.destroy && (i = r), e === this.desc.positionAttribute && this._updateSubBoundingBox(t), 
	        i) {
	            const e = Be[i.buffer._buffer.dtype];
	            if (t.BYTES_PER_ELEMENT !== e) {
	                t = new (function(e, t) {
	                    if (e instanceof Uint8Array || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Uint8ClampedArray) return 1 === t ? Uint8Array : 2 === t ? Uint16Array : Uint32Array;
	                    if (e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array) return 1 === t ? Int8Array : 2 === t ? Int16Array : Int32Array;
	                    if (e instanceof Float32Array || e instanceof Float64Array) return 4 === t ? Float32Array : Float64Array;
	                }(t, e))(t);
	            }
	            i.buffer.subdata(t, n * e);
	        } else {
	            const r = this.data[e].data ? this.data[e].data : this.data[e];
	            for (let e = 0; e < t.length; e++) r[n + e] = t[e];
	        }
	        return this._prepareData(), this.desc.positionAttribute === e && (this._posDirty = !0), 
	        delete this._reglData, this;
	    }
	    getPrimitive() {
	        return this.desc.primitive;
	    }
	    getElements() {
	        return this.elements;
	    }
	    setElements(e, t) {
	        if (!e) throw new Error("elements data is invalid");
	        this._incrVersion();
	        const n = this.elements;
	        return this.count = void 0 === t ? Ve(e) : t, this.elements = n.destroy ? n(e) : e, 
	        this._elementsUpdated = !0, this;
	    }
	    setDrawCount(e) {
	        return this._incrVersion(), this.count1 = e, this;
	    }
	    getDrawCount() {
	        return this.count1 || this.count;
	    }
	    setDrawOffset(e) {
	        return this._incrVersion(), this.offset = e, this;
	    }
	    getDrawOffset() {
	        return this.offset || 0;
	    }
	    dispose() {
	        this._deleteVAO(), this._forEachBuffer(e => {
	            if (!e[de]) {
	                let t = e[ze];
	                t && t--, t <= 0 ? (e[de] = !0, e.destroy()) : e[ze] = t;
	            }
	        }), this.data = {}, this._buffers = {}, delete this._reglData, delete this._attributes, 
	        this.count = 0, this.elements = [], delete this._tempPosArray, this._disposed = !0;
	    }
	    isDisposed() {
	        return !!this._disposed;
	    }
	    updateBoundingBox() {
	        let e = this.boundingBox;
	        e || (e = this.boundingBox = new Fe);
	        let n, r, i = this.data[this.desc.positionAttribute];
	        if (ee(i) || (i.data ? i = i.data : fe(i) ? i = this._getAttributeData(this.desc.positionAttribute) : i.array && (n = i.min, 
	        r = i.max, i = i.array)), i && i.length) {
	            const o = e.min, s = e.max;
	            if (n && r) set$4(o, ...n), set$4(s, ...r); else {
	                set$4(o, i[0], i[1], i[2]), set$4(s, i[0], i[1], i[2]);
	                for (let e = 3; e < i.length; ) {
	                    const t = i[e++], n = i[e++], r = i[e++];
	                    t < o[0] && (o[0] = t), n < o[1] && (o[1] = n), r < o[2] && (o[2] = r), t > s[0] && (s[0] = t), 
	                    n > s[1] && (s[1] = n), r > s[2] && (s[2] = r);
	                }
	            }
	            e.updateVertex(), e.dirty();
	        }
	    }
	    _updateSubBoundingBox(e) {
	        const t = this.boundingBox, n = t.min, r = t.max;
	        for (let t = 0; t < e.length; ) {
	            const i = e[t++], o = e[t++], s = e[t++];
	            i < n[0] && (n[0] = i), o < n[1] && (n[1] = o), s < n[2] && (n[2] = s), i > r[0] && (r[0] = i), 
	            o > r[1] && (r[1] = o), s > r[2] && (r[2] = s);
	        }
	        t.updateVertex(), t.dirty();
	    }
	    _getAttributeData(e) {
	        const t = this.data[e], n = t.buffer;
	        if (fe(t)) {
	            const r = this._buffers[n] ? this._buffers[n].data : t.array, {count: i, size: o, stride: s, offset: a, componentType: c} = t, l = k$1.getTypedArrayCtor(c);
	            if ((0 === s || s === o * l.BYTES_PER_ELEMENT) && a % l.BYTES_PER_ELEMENT == 0) return new l(r, a, i * o);
	            if (e === this.desc.positionAttribute) return !this._tempPosArray || this._tempPosArray && this._tempPosArray.length < o * i ? (this._tempPosArray = new l(o * i), 
	            k$1.readInterleavedArray(this._tempPosArray, r, i, o, s, a, c)) : this._posDirty ? (this._posDirty = !1, 
	            k$1.readInterleavedArray(this._tempPosArray, r, i, o, s, a, c)) : this._tempPosArray;
	            {
	                const e = new l(o * i);
	                return k$1.readInterleavedArray(e, r, i, o, s, a, c);
	            }
	        }
	        return t;
	    }
	    createTangent(e = "aTangent") {
	        this._incrVersion();
	        const {normalAttribute: r, positionAttribute: i, uv0Attribute: o} = this.desc, s = this._getAttributeData(r), a = 
	        /*!
	 * Contains code from THREE.JS
	 * https://github.com/mrdoob/three.js/
	 * License MIT
	 * 
	 * Generate tangents per vertex.
	 */
	        function(e, n, r, i) {
	            const o = e.length / 3, s = new Array(4 * o), a = [], c = [];
	            for (let e = 0; e < o; e++) a[e] = [ 0, 0, 0 ], c[e] = [ 0, 0, 0 ];
	            const l = [ 0, 0, 0 ], f = [ 0, 0, 0 ], u = [ 0, 0, 0 ], h = [ 0, 0 ], d = [ 0, 0 ], m = [ 0, 0 ], v = [ 0, 0, 0 ], g = [ 0, 0, 0 ];
	            function _(n, i, o) {
	                Ce(l, e, 3 * n), Ce(f, e, 3 * i), Ce(u, e, 3 * o), Pe(h, r, 2 * n), Pe(d, r, 2 * i), 
	                Pe(m, r, 2 * o);
	                const s = f[0] - l[0], _ = u[0] - l[0], b = f[1] - l[1], p = u[1] - l[1], x = f[2] - l[2], y = u[2] - l[2], T = d[0] - h[0], A = m[0] - h[0], S = d[1] - h[1], M = m[1] - h[1], E = 1 / (T * M - A * S);
	                set$4(v, (M * s - S * _) * E, (M * b - S * p) * E, (M * x - S * y) * E), set$4(g, (T * _ - A * s) * E, (T * p - A * b) * E, (T * y - A * x) * E), 
	                add$4(a[n], a[n], v), add$4(a[i], a[i], v), add$4(a[o], a[o], v), add$4(c[n], c[n], g), 
	                add$4(c[i], c[i], g), add$4(c[o], c[o], g);
	            }
	            for (let e = 0, t = i.length; e < t; e += 3) _(i[e + 0], i[e + 1], i[e + 2]);
	            const b = [], p = [], x = [], y = [];
	            let T, A, S;
	            function M(e) {
	                Ce(x, n, 3 * e), copy$4(y, x), A = a[e], copy$4(b, A), sub$2(b, b, scale$4(x, x, dot$4(x, A))), 
	                normalize$4(b, b), cross$1(p, y, A), S = dot$4(p, c[e]), T = S < 0 ? -1 : 1, s[4 * e] = b[0], 
	                s[4 * e + 1] = b[1], s[4 * e + 2] = b[2], s[4 * e + 3] = T;
	            }
	            for (let e = 0, t = i.length; e < t; e += 3) M(i[e + 0]), M(i[e + 1]), M(i[e + 2]);
	            return s;
	        }(this._getAttributeData(i), s, this.data[o], this.elements), c = this.data[e] = new Float32Array(a.length), l = [], f = [], u = [];
	        for (let e = 0; e < a.length; e += 4) {
	            const r = e / 4 * 3;
	            set$4(f, s[r], s[r + 1], s[r + 2]), set$3(l, a[e], a[e + 1], a[e + 2], a[e + 3]), 
	            Oe(u, f, l), copy$3(c.subarray(e, e + 4), u);
	        }
	        delete this._reglData;
	    }
	    createNormal(e = "aNormal") {
	        this._incrVersion();
	        const n = this._getAttributeData(this.desc.positionAttribute);
	        this.data[e] = function(e, n) {
	            const r = [], i = [];
	            let o = 0;
	            for (o = 0; o < e.length; o += 3) {
	                const t = new Te([ e[o], e[o + 1], e[o + 2] ], o / 3);
	                r.push(t);
	            }
	            if (!n.length) {
	                const e = n;
	                n = [];
	                for (let t = 0; t < e; t++) n.push(t);
	            }
	            for (o = 0; o < n.length / 3; o++) {
	                const e = {
	                    a: n[3 * o],
	                    b: n[3 * o + 1],
	                    c: n[3 * o + 2]
	                };
	                new Ae(r[e.a], r[e.b], r[e.c], e);
	            }
	            const s = [], a = [ 0, 0, 0 ];
	            for (o = 0; o < r.length; o++) {
	                const e = r[o], n = e.index;
	                set$4(a, 0, 0, 0);
	                let c = e.faces.length;
	                for (let n = 0; n < c; n++) add$4(a, a, e.faces[n].normal);
	                c = c || 1, set$4(s, c, c, c), divide$2(a, a, s), i[3 * n] = a[0], i[3 * n + 1] = a[1], 
	                i[3 * n + 2] = a[2];
	            }
	            return i;
	        }(n.array || n, this.elements), delete this._reglData;
	    }
	    createBarycentric(e = "aBarycentric") {
	        if ("triangles" !== this.desc.primitive) throw new Error("Primitive must be triangles to create bary centric data");
	        this._incrVersion();
	        const t = new Uint8Array(3 * this.getVertexCount());
	        for (let e = 0, n = this.elements.length; e < n; ) for (let n = 0; n < 3; n++) {
	            t[3 * this.elements[e++] + n] = 1;
	        }
	        this.data[e] = t, delete this._reglData;
	    }
	    buildUniqueVertex() {
	        this._incrVersion();
	        const e = this.data, t = this.elements;
	        if (!ee(t)) throw new Error("elements must be array to build unique vertex.");
	        const n = Object.keys(e), r = {};
	        let i = e[this.desc.positionAttribute];
	        if (i = i.length ? i : i.array, !ee(i)) throw new Error(this.desc.positionAttribute + " must be array to build unique vertex.");
	        const o = this.getVertexCount(), s = t.length;
	        for (let t = 0; t < n.length; t++) {
	            const i = n[t], a = ee(e[i]) ? e[i] : e[i].array, c = a.length / o;
	            if (!ee(a)) throw new Error(i + " must be array to build unique vertex.");
	            r[i] = a, r[i].size = c, e[i] = new a.constructor(s * c);
	        }
	        let a = 0;
	        for (let i = 0; i < s; i++) {
	            const o = t[i];
	            for (let t = 0; t < n.length; t++) {
	                const i = n[t], s = e[i], c = r[i].size;
	                for (let e = 0; e < c; e++) s[a * c + e] = r[i][o * c + e];
	            }
	            t[i] = a++;
	        }
	        delete this._reglData;
	    }
	    getMemorySize() {
	        let e = 0;
	        for (const t in this.data) ie(this.data, t) && (e += oe(this.data[t]));
	        if (this.elements) {
	            const t = this.elements;
	            t.destroy ? e += t._elements.buffer.byteLength : t.BYTES_PER_ELEMENT ? e += t.length * t.BYTES_PER_ELEMENT : t.length && (e += 4 * t.length);
	        }
	        return e;
	    }
	    _deleteVAO() {
	        for (const e in this._vao) this._vao[e].vao.destroy();
	        this._vao = {};
	    }
	    _forEachBuffer(e) {
	        this.elements && this.elements.destroy && e(this.elements);
	        for (const t in this.data) ie(this.data, t) && this.data[t] && this.data[t].buffer && this.data[t].buffer.destroy && e(this.data[t].buffer);
	        for (const t in this._buffers) ie(this._buffers, t) && this._buffers[t] && this._buffers[t].buffer && this._buffers[t].buffer.destroy && e(this._buffers[t].buffer);
	    }
	    getElementsType(e) {
	        return e instanceof Uint8Array ? "uint8" : e instanceof Uint16Array ? "uint16" : e instanceof Uint32Array ? "uint32" : void 0;
	    }
	    _incrVersion() {
	        this._version++;
	    }
	}

	function Ve(e) {
	    if (Q$1(e)) return e;
	    if (void 0 !== e.count) return e.count;
	    if (void 0 !== e.length) return e.length;
	    if (e.data) return e.data.length;
	    throw new Error("invalid elements length");
	}

	var je = he(class {
	    constructor(e = {}, t) {
	        this._version = 0, this.uniforms = Z$1({}, t || {}, e);
	        for (const t in e) {
	            const n = Object.getOwnPropertyDescriptor(e, t).get;
	            n && Object.defineProperty(this.uniforms, t, {
	                get: n
	            });
	        }
	        this._reglUniforms = {}, this.refCount = 0, this._bindedOnTextureComplete = this._onTextureComplete.bind(this), 
	        this._genUniformKeys(), this._checkTextures();
	    }
	    set version(e) {
	        throw new Error("Material.version is read only.");
	    }
	    get version() {
	        return this._version;
	    }
	    isReady() {
	        return this._loadingCount <= 0;
	    }
	    set(e, t) {
	        const n = q$1(this.uniforms[e]) && !q$1(t) || !q$1(this.uniforms[e]) && q$1(t);
	        return this.uniforms[e] && this.isTexture(e) && this.uniforms[e].dispose(), q$1(t) ? q$1(this.uniforms[e]) || delete this.uniforms[e] : this.uniforms[e] = t, 
	        this._dirtyUniforms = !0, this.isTexture(e) && this._checkTextures(), n && (this._genUniformKeys(), 
	        this._incrVersion()), this;
	    }
	    get(e) {
	        return this.uniforms[e];
	    }
	    isDirty() {
	        return this._uniformVer !== this.version;
	    }
	    appendDefines(e) {
	        const t = this.uniforms;
	        return t.jointTexture && (e.HAS_SKIN = 1), t.morphWeights1 && (e.HAS_MORPH = 1), 
	        e;
	    }
	    hasSkinAnimation() {
	        return this.uniforms.jointTexture && this.uniforms.skinAnimation;
	    }
	    getUniforms(e) {
	        if (this._reglUniforms && !this.isDirty()) return this._reglUniforms;
	        const t = this.uniforms, n = {};
	        for (const r in t) this.isTexture(r) ? Object.defineProperty(n, r, {
	            enumerable: !0,
	            configurable: !0,
	            get: function() {
	                return t[r].getREGLTexture(e);
	            }
	        }) : Object.defineProperty(n, r, {
	            enumerable: !0,
	            configurable: !0,
	            get: function() {
	                return t[r];
	            }
	        });
	        return this._reglUniforms = n, this._uniformVer = this.version, n;
	    }
	    isTexture(e) {
	        return this.uniforms[e] instanceof ve;
	    }
	    dispose() {
	        for (const e in this.uniforms) {
	            const t = this.uniforms[e];
	            t && (t.dispose ? t.dispose() : t.destroy && !t[de] && (t.destroy(), t[de] = !0));
	        }
	        delete this.uniforms, delete this._reglUniforms, this._disposed = !0;
	    }
	    isDisposed() {
	        return !!this._disposed;
	    }
	    _checkTextures() {
	        this._loadingCount = 0;
	        for (const e in this.uniforms) if (this.isTexture(e)) {
	            const t = this.uniforms[e];
	            t.isReady() || (this._loadingCount++, t.on("complete", this._bindedOnTextureComplete));
	        }
	    }
	    _onTextureComplete() {
	        this._loadingCount--, this._incrVersion(), this._loadingCount <= 0 && (this._disposed || this.fire("complete"));
	    }
	    getUniformKeys() {
	        return this._uniformKeys;
	    }
	    _genUniformKeys() {
	        const e = [];
	        for (const t in this.uniforms) ie(this.uniforms, t) && !q$1(this.uniforms[t]) && e.push(t);
	        this._uniformKeys = e.join();
	    }
	    _incrVersion() {
	        this._version++;
	    }
	    getMemorySize() {
	        const e = this.uniforms;
	        let t = 0;
	        for (const n in e) this.isTexture(n) ? t += e[n].getMemorySize() : this.uniforms[n].destroy && (t += se(this.uniforms[n]));
	        return t;
	    }
	});

	const Ue = {
	    time: 0,
	    seeThrough: !0,
	    thickness: .03,
	    fill: [ 1, .5137254902, .98, 1 ],
	    stroke: [ .7019607843, .9333333333, .2274509804, 1 ],
	    dashEnabled: !1,
	    dashAnimate: !1,
	    dashRepeats: 1,
	    dashLength: .8,
	    dashOverlap: !0,
	    insideAltColor: !1,
	    squeeze: !1,
	    squeezeMin: .5,
	    squeezeMax: 1,
	    dualStroke: !1,
	    secondThickness: .05,
	    opacity: 1,
	    noiseEnable: !1
	};

	class Ge extends je {
	    constructor(e) {
	        super(e, Ue);
	    }
	}

	const Xe = {
	    baseColorFactor: [ 1, 1, 1, 1 ],
	    materialShininess: 32,
	    ambientStrength: 1,
	    specularStrength: 32,
	    opacity: 1,
	    extrusionOpacity: 0,
	    extrusionOpacityRange: [ 0, 1.8 ],
	    baseColorTexture: null,
	    normalTexture: null,
	    emissiveTexture: null,
	    occlusionTexture: null,
	    uvScale: [ 1, 1 ],
	    uvOffset: [ 0, 0 ]
	};

	class qe extends je {
	    constructor(e) {
	        super(e, Xe);
	    }
	    static convertFrom(e) {
	        const t = {};
	        for (const n in Xe) t[n] = e.get(n);
	        return new qe(t);
	    }
	    appendDefines(e, t) {
	        super.appendDefines(e, t);
	        const n = this.uniforms;
	        return n.extrusionOpacity && (e.HAS_EXTRUSION_OPACITY = 1), t.data[t.desc.uv0Attribute] ? (n.baseColorTexture && (e.HAS_BASECOLOR_MAP = 1), 
	        n.occlusionTexture && (e.HAS_AO_MAP = 1), n.emissiveTexture && (e.HAS_EMISSIVE_MAP = 1), 
	        n.normalTexture && (e.HAS_NORMAL_MAP = 1), (e.HAS_BASECOLOR_MAP || e.HAS_AO_MAP || e.HAS_EMISSIVE_MAP || e.HAS_NORMAL_MAP) && (e.HAS_MAP = 1), 
	        e) : e;
	    }
	}

	const We = {
	    toons: 4,
	    specularToons: 2
	};

	class Ke extends qe {
	    constructor(e) {
	        super(e, We);
	    }
	}

	const Ye = {
	    diffuseFactor: [ 1, 1, 1, 1 ],
	    specularFactor: [ 1, 1, 1 ],
	    glossinessFactor: 1,
	    diffuseTexture: null,
	    specularGlossinessTexture: null,
	    normalTexture: null,
	    emissiveTexture: null,
	    occlusionTexture: null
	}, Je = e => class extends e {
	    constructor(e) {
	        super(e = J$1({}, Ye, e || {}));
	    }
	    appendDefines(e, t) {
	        if (super.appendDefines(e, t), e.SHADING_MODEL_SPECULAR_GLOSSINESS = 1, !t.data[t.desc.uv0Attribute]) return e;
	        const n = this.uniforms;
	        return n.diffuseTexture && (e.HAS_DIFFUSE_MAP = 1), n.specularGlossinessTexture && (e.HAS_SPECULARGLOSSINESS_MAP = 1), 
	        (e.HAS_SPECULARGLOSSINESS_MAP || e.HAS_DIFFUSE_MAP) && (e.HAS_MAP = 1), e;
	    }
	};

	class Ze extends(Je(qe)){}

	const Qe = [];

	let $e = 0;

	class et$1 {
	    constructor(e, t, n = {}) {
	        this._version = 0, this._geometry = e, this._material = t, this.transparent = !!n.transparent, 
	        this.bloom = !!n.bloom, this.ssr = !!n.ssr, this.castShadow = q$1(n.castShadow) || n.castShadow, 
	        this.picking = !!n.picking, this.disableVAO = !!n.disableVAO, this.uniforms = {}, 
	        this._localTransform = identity$2(new Array(16)), this._positionMatrix = identity$2(new Array(16)), 
	        this.properties = {}, this._dirtyUniforms = !0, Object.defineProperty(this, "uuid", {
	            value: $e++
	        }), $e > Number.MAX_VALUE - 10 && ($e = 0);
	    }
	    set material(e) {
	        this._material !== e && this.setMaterial(e);
	    }
	    get material() {
	        return this._material;
	    }
	    set version(e) {
	        throw new Error("Mesh.version is read only.");
	    }
	    get version() {
	        return this._version;
	    }
	    get geometry() {
	        return this._geometry;
	    }
	    set geometry(e) {
	        this._geometry !== e && this._incrVersion(), this._geometry = e;
	    }
	    set localTransform(e) {
	        this._prevTMat || (this._prevTMat = []), Array.isArray(e) && !exactEquals$5(this._prevTMat, e) && (this._incrVersion(), 
	        this._prevTMat = copy$5(this._prevTMat, e)), this._localTransform = e;
	    }
	    get localTransform() {
	        return this._localTransform;
	    }
	    set positionMatrix(e) {
	        this._prevPMat || (this._prevPMat = []), Array.isArray(e) && !exactEquals$5(this._prevPMat, e) && (this._incrVersion(), 
	        this._prevPMat = copy$5(this._prevPMat, e)), this._positionMatrix = e;
	    }
	    get positionMatrix() {
	        return this._positionMatrix;
	    }
	    get config() {
	        return this._cfg || (this._cfg = {}), this._cfg.transparent = this.transparent, 
	        this._cfg.castShadow = this.castShadow, this._cfg.bloom = this.bloom, this._cfg.ssr = this.ssr, 
	        this._cfg.picking = this.picking, this._cfg;
	    }
	    get defines() {
	        return this._defines;
	    }
	    set defines(e) {
	        this.setDefines(e);
	    }
	    setMaterial(e) {
	        return this._material = e, this._dirtyUniforms = !0, delete this._materialVer, this.dirtyDefines = !0, 
	        this;
	    }
	    setParent(e) {
	        return this.parent = e, this;
	    }
	    setLocalTransform(e) {
	        return this.localTransform = e, this;
	    }
	    setPositionMatrix(e) {
	        this.positionMatrix = e;
	    }
	    setUniform(e, t) {
	        return void 0 === this.uniforms[e] && (this._dirtyUniforms = !0), this.uniforms[e] = t, 
	        this;
	    }
	    getUniform(e) {
	        return this.uniforms[e];
	    }
	    getDefines() {
	        const e = {};
	        return this._defines && J$1(e, this._defines), this._material && this._geometry && this._material.appendDefines(e, this._geometry), 
	        e;
	    }
	    setDefines(e) {
	        const t = this._bakDefines;
	        return this._defines = e, this.dirtyDefines = !!t != !!e || !function(e, t) {
	            if (!e && !t) return !0;
	            const n = Object.getOwnPropertyNames(e), r = Object.getOwnPropertyNames(t);
	            if (n.length !== r.length) return !1;
	            for (let r = 0; r < n.length; r++) if (e[n[r]] !== t[n[r]]) return !1;
	            return !0;
	        }(t, e), this.dirtyDefines && (this._bakDefines = J$1({}, e)), this;
	    }
	    hasSkinAnimation() {
	        return this._material && this._material.hasSkinAnimation();
	    }
	    _getDefinesKey() {
	        return this.dirtyDefines = !1, this._createDefinesKey(this.getDefines());
	    }
	    getCommandKey() {
	        if (!this._commandKey || this.dirtyDefines || this._material && this._materialKeys !== this._material.getUniformKeys()) {
	            let e = this._getDefinesKey();
	            e += "_" + (Q$1(this.getElements()) ? "count" : "elements"), e += "_" + +!!this.disableVAO, 
	            this._commandKey = e, this._material && (this._materialKeys = this._material.getUniformKeys());
	        }
	        return this._commandKey;
	    }
	    getUniforms(e) {
	        if (this._dirtyUniforms || this._material && this._materialVer !== this._material.version) {
	            if (this._realUniforms = {}, this._material) {
	                const t = this._material.getUniforms(e);
	                for (const e in t) ie(t, e) && Object.defineProperty(this._realUniforms, e, {
	                    enumerable: !0,
	                    configurable: !0,
	                    get: function() {
	                        return t[e];
	                    }
	                });
	            }
	            const t = this.uniforms;
	            for (const e in this.uniforms) ie(this.uniforms, e) && Object.defineProperty(this._realUniforms, e, {
	                enumerable: !0,
	                configurable: !0,
	                get: function() {
	                    return t[e];
	                }
	            });
	            this._dirtyUniforms = !1, this._materialVer = this._material && this._material.version;
	        }
	        return this._realUniforms.modelMatrix = K$1(this._localTransform) ? this._localTransform() : this._localTransform, 
	        this._realUniforms.positionMatrix = K$1(this._positionMatrix) ? this._positionMatrix() : this._positionMatrix, 
	        this._realUniforms;
	    }
	    getMaterial() {
	        return this._material;
	    }
	    getElements() {
	        return this._geometry.getElements();
	    }
	    _getREGLAttrData(e, t) {
	        return this._geometry.getREGLData(e, t, this.disableVAO);
	    }
	    getREGLProps(e, t) {
	        const n = this.getUniforms(e);
	        return J$1(n, this._getREGLAttrData(e, t)), re(e) && !this.disableVAO || (n.elements = this._geometry.getElements()), 
	        n.meshProperties = this.properties, n.meshConfig = this.config, n.count = this._geometry.getDrawCount(), 
	        n.offset = this._geometry.getDrawOffset(), n.primitive = this._geometry.getPrimitive(), 
	        n;
	    }
	    dispose() {
	        return delete this._geometry, delete this._material, this.uniforms = {}, this;
	    }
	    isValid() {
	        return this._geometry && !this._geometry.isDisposed() && (!this._material || !this._material.isDisposed());
	    }
	    getBoundingBox() {
	        return this._bbox || this.updateBoundingBox(), multiply$5(Qe, this._localTransform, this._positionMatrix), 
	        exactEquals$5(Qe, this._currentTransform) && this._geometry.boundingBox.equals(this._geoBox) || this.updateBoundingBox(), 
	        this._bboxArr;
	    }
	    updateBoundingBox() {
	        const e = this._geometry.boundingBox;
	        this._bbox || (this._bbox = new Fe), this._bboxArr || (this._bboxArr = [ [], [] ]), 
	        this._geoBox || (this._geoBox = new Fe), Fe.copy(this._bbox, e), this._bbox.updateVertex(), 
	        this._bbox.transform(this._positionMatrix, this._localTransform), this._currentTransform = multiply$5(this._currentTransform || [], this._localTransform, this._positionMatrix), 
	        Fe.copy(this._geoBox, e), copy$4(this._bboxArr[0], this._bbox.min), copy$4(this._bboxArr[1], this._bbox.max);
	    }
	    _createDefinesKey(e) {
	        const t = [];
	        for (const n in e) t.push(n, e[n]);
	        return t.join(",");
	    }
	    _incrVersion() {
	        this._version++;
	    }
	    getMemorySize() {
	        return (this.geometry && this.geometry.getMemorySize() || 0) + (this.material && this.material.getMemorySize() || 0);
	    }
	}

	et$1.prototype.getWorldTransform = function() {
	    const e = [];
	    return function() {
	        const t = this.parent;
	        return t ? multiply$5(e, t.getWorldTransform(), this._localTransform) : this._localTransform;
	    };
	}();

	const tt$1 = [], nt$1 = [], rt$1 = [];

	class it$1 extends et$1 {
	    constructor(e, t, n, r, i = {}) {
	        super(n, r, i), this._instanceCount = t, this.instancedData = e || {}, this._checkInstancedProp(), 
	        this._vao = {};
	    }
	    get instanceCount() {
	        return this._instanceCount;
	    }
	    set instanceCount(e) {
	        this._incrVersion(), this._instanceCount = e;
	    }
	    getMemorySize() {
	        return super.getMemorySize() + this._getInstanceMemorySize();
	    }
	    _getInstanceMemorySize() {
	        let e = 0;
	        for (const t in this.instancedData) ie(this.instancedData, t) && (e += oe(this.instancedData[t]));
	        return e;
	    }
	    _checkInstancedProp() {
	        for (const e in this.instancedData) if (this.geometry.data[e]) throw new Error(`Duplicate attribute ${e} defined in geometry and instanced data`);
	    }
	    _getREGLAttrData(e, t) {
	        const n = this.geometry.getAttrData(t);
	        if (re(e)) {
	            const r = t.key;
	            if (!this._vao[r] || this._instanceDataUpdated) {
	                const i = t.map(e => e.name), o = [];
	                for (let e = 0; e < i.length; e++) {
	                    o.push(n[i[e]] || this.instancedData[i[e]]);
	                }
	                const s = {
	                    attributes: o,
	                    primitive: this.geometry.getPrimitive()
	                };
	                this._vao[r] ? this._vao[r].vao(s) : this._vao[r] = {
	                    vao: e.vao(s)
	                }, delete this._instanceDataUpdated;
	            }
	            return this._vao[r];
	        }
	        return n;
	    }
	    getDefines() {
	        const e = super.getDefines();
	        return e.HAS_INSTANCE = 1, e;
	    }
	    getCommandKey(e) {
	        return "i_" + super.getCommandKey(e);
	    }
	    updateInstancedData(e, t) {
	        const n = this.instancedData[e];
	        return n ? (this._incrVersion(), this.instancedData[e] = t, n.buffer && n.buffer.destroy && n.buffer.destroy(), 
	        this._instanceDataUpdated = !0, this) : this;
	    }
	    generateInstancedBuffers(e) {
	        const t = this.instancedData, n = {};
	        for (const r in t) t[r] && (void 0 !== t[r].buffer && t[r].buffer.destroy ? (n[r] = t[r], 
	        n[r].divisor && (n[r].divisor = 1)) : n[r] = t[r].destroy ? {
	            buffer: t[r],
	            divisor: 1
	        } : {
	            buffer: e.buffer({
	                data: t[r],
	                dimension: t[r].length / this._instanceCount
	            }),
	            divisor: 1
	        });
	        return this.instancedData = n, this;
	    }
	    getREGLProps(e, t) {
	        const n = super.getREGLProps(e, t);
	        return re(e) || J$1(n, this.instancedData), n.elements = this.geometry.getElements(), 
	        n.instances = this._instanceCount, n;
	    }
	    disposeInstanceData() {
	        const e = this.instancedData;
	        if (e) for (const t in e) e[t] && e[t].destroy && !e[t][de] && (e[t][de] = 1, e[t].destroy());
	        this.instancedData = {};
	        for (const e in this._vao) this._vao[e].vao.destroy();
	        this._vao = {};
	    }
	    getBoundingBox() {
	        return this._bbox || this.updateBoundingBox(), this._bbox;
	    }
	    updateBoundingBox() {
	        const {instance_vectorA: e, instance_vectorB: t, instance_vectorC: i} = this.instancedData;
	        if (!e || !t || !i) return super.updateBoundingBox();
	        this._bbox || (this._bbox = [ [ 1 / 0, 1 / 0, 1 / 0 ], [ -1 / 0, -1 / 0, -1 / 0 ] ]);
	        const o = this.geometry.boundingBox, {min: s, max: a} = o;
	        for (let o = 0; o < e.length; o += 4) {
	            set$5(tt$1, e[o + 0], t[o + 0], i[o + 0], 0, e[o + 1], t[o + 1], i[o + 1], 0, e[o + 2], t[o + 2], i[o + 2], 0, e[o + 3], t[o + 3], i[o + 3], 1), 
	            multiply$5(tt$1, tt$1, this.positionMatrix);
	            const c = multiply$5(tt$1, this.localTransform, tt$1);
	            set$3(nt$1, s[0], s[1], s[2], 1), set$3(rt$1, a[0], a[1], a[2], 1), transformMat4$1(nt$1, nt$1, c), 
	            transformMat4$1(rt$1, rt$1, c), this._bbox[0][0] = Math.min(this._bbox[0][0], nt$1[0]), 
	            this._bbox[0][1] = Math.min(this._bbox[0][1], nt$1[1]), this._bbox[0][2] = Math.min(this._bbox[0][2], nt$1[2]), 
	            this._bbox[1][0] = Math.max(this._bbox[1][0], nt$1[0]), this._bbox[1][1] = Math.max(this._bbox[1][1], nt$1[1]), 
	            this._bbox[1][2] = Math.max(this._bbox[1][2], nt$1[2]);
	        }
	        return this._bbox;
	    }
	    _getBytesPerElement(e) {
	        switch (e) {
	          case 5120:
	          case 5121:
	            return 1;

	          case 5122:
	          case 5123:
	            return 2;

	          case 5124:
	          case 5125:
	          case 5126:
	            return 4;
	        }
	        throw new Error("unsupported data type: " + e);
	    }
	}

	const ot$1 = {
	    getArrayBuffer: (e, t) => ot$1.get(e, {
	        responseType: "arraybuffer"
	    }, t),
	    get: function(e, t, n) {
	        const r = ot$1._getClient(n);
	        if (r.open("GET", e, !0), t) {
	            for (const e in t.headers) r.setRequestHeader(e, t.headers[e]);
	            r.withCredentials = "include" === t.credentials, t.responseType && (r.responseType = t.responseType);
	        }
	        return r.send(null), r;
	    },
	    _wrapCallback: function(e, t) {
	        return function() {
	            if (4 === e.readyState) if (200 === e.status) if ("arraybuffer" === e.responseType) {
	                0 === e.response.byteLength ? t(new Error("http status 200 returned without content.")) : t(null, {
	                    data: e.response,
	                    cacheControl: e.getResponseHeader("Cache-Control"),
	                    expires: e.getResponseHeader("Expires"),
	                    contentType: e.getResponseHeader("Content-Type")
	                });
	            } else t(null, e.responseText); else t(new Error(e.statusText + "," + e.status));
	        };
	    },
	    _getClient: function(e) {
	        let t;
	        try {
	            t = new XMLHttpRequest;
	        } catch (e) {
	            try {
	                t = new ActiveXObject("Msxml2.XMLHTTP");
	            } catch (e) {
	                try {
	                    t = new ActiveXObject("Microsoft.XMLHTTP");
	                } catch (e) {}
	            }
	        }
	        return t.onreadystatechange = ot$1._wrapCallback(t, e), t;
	    }
	};

	var st$1 = he(class {
	    constructor(e) {
	        this.defaultTexture = e, this.defaultCubeTexture = new Array(6), this.resources = {};
	    }
	    get(e) {
	        return Array.isArray(e) ? this._loadImages(e) : this._loadImage(e);
	    }
	    getArrayBuffer(e) {
	        if (Array.isArray(e)) {
	            const t = e.map(e => this.getArrayBuffer(e));
	            return Promise.all(t);
	        }
	        return new Promise((t, n) => {
	            ot$1.getArrayBuffer(e, (r, i) => {
	                r ? n(r) : t({
	                    url: e,
	                    data: i
	                });
	            });
	        });
	    }
	    disposeRes(e) {
	        return Array.isArray(e) ? e.forEach(e => this._disposeOne(e)) : this._disposeOne(e), 
	        this;
	    }
	    isLoading() {
	        return this._count && this._count > 0;
	    }
	    getDefaultTexture(e) {
	        return Array.isArray(e) ? this._getBlankTextures(e.length) : this.defaultTexture;
	    }
	    _disposeOne(e) {
	        const t = this.resources;
	        t[e] && (t[e].count--, t[e].count <= 0 && delete t[e]);
	    }
	    _loadImage(e) {
	        const t = this.resources;
	        if (t[e]) return Promise.resolve({
	            url: e,
	            data: t[e].image
	        });
	        return new Promise((n, r) => {
	            const i = new Image;
	            i.crossOrigin = "anonymous", i.onload = function() {
	                t[e] = {
	                    image: i,
	                    count: 1
	                }, n({
	                    url: e,
	                    data: i
	                });
	            }, i.onerror = function(e) {
	                r(e);
	            }, i.onabort = function() {
	                r(`image(${e}) loading aborted.`);
	            }, i.src = e;
	        });
	    }
	    _loadImages(e) {
	        const t = e.map(e => this._loadImage(e, !0));
	        return Promise.all(t);
	    }
	    _getBlankTextures(e) {
	        const t = new Array(e);
	        for (let e = 0; e < 6; e++) t.push(this.defaultTexture);
	        return t;
	    }
	});

	const at$1 = [], ct$1 = [];

	let lt$1 = 0;

	class ft$1 {
	    constructor(e) {
	        this._id = lt$1++, this.sortedMeshes = {}, this.setMeshes(e), this._compareBinded = this._compare.bind(this), 
	        this.dirty();
	    }
	    setMeshes(e) {
	        if (this.clear(), !e || Array.isArray(e) && !e.length || e === this.meshes) return this;
	        e = Array.isArray(e) ? e : [ e ], this.meshes = [];
	        for (let t = 0; t < e.length; t++) {
	            const n = e[t];
	            n && (n._scenes = n._scenes || {}, n._scenes[this._id] = 1, this.meshes.push(n));
	        }
	        return this.dirty(), this;
	    }
	    addMesh(e) {
	        return !e || Array.isArray(e) && !e.length || (Array.isArray(e) ? e.forEach(e => {
	            e._scenes = e._scenes || {}, e._scenes[this._id] || (e._scenes[this._id] = 1, this.meshes.push(e), 
	            this.dirty());
	        }) : (e._scenes = e._scenes || {}, e._scenes[this._id] || (e._scenes[this._id] = 1, 
	        this.meshes.push(e), this.dirty()))), this;
	    }
	    removeMesh(e) {
	        if (!e || Array.isArray(e) && !e.length) return this;
	        if (Array.isArray(e)) {
	            let t = !1;
	            for (let n = 0; n < e.length; n++) e[n]._scenes && e[n]._scenes[this._id] && (t = !0, 
	            this.dirty(), delete e[n]._scenes[this._id]);
	            t && (this.meshes = this.meshes.filter(t => e.indexOf(t) < 0));
	        } else {
	            if (!e._scenes || !e._scenes[this._id]) return this;
	            const t = this.meshes.indexOf(e);
	            t >= 0 && this.meshes.splice(t, 1), delete e._scenes[this._id], this.dirty();
	        }
	        return this;
	    }
	    getMeshes() {
	        return this.meshes;
	    }
	    clear() {
	        if (this.meshes) for (let e = 0; e < this.meshes.length; e++) delete this.meshes[e]._scenes[this._id];
	        return this.meshes = [], this.sortedMeshes.opaques = [], this.sortedMeshes.transparents = [], 
	        this;
	    }
	    dirty() {
	        return this._dirty = !0, this;
	    }
	    sortMeshes(e) {
	        const t = this.meshes;
	        this.sortFunction && t.sort(this.sortFunction);
	        let n = this.sortedMeshes.transparents;
	        if (this._dirty) {
	            const e = this.sortedMeshes.opaques = [];
	            n = this.sortedMeshes.transparents = [];
	            for (let r = 0, i = t.length; r < i; r++) t[r].transparent ? n.push(t[r]) : e.push(t[r]);
	        }
	        e && n.length > 1 && (this._cameraPosition = e, n.sort(this._compareBinded), delete this._cameraPosition), 
	        this._dirty = !1;
	    }
	    getSortedMeshes() {
	        return this._dirty && this.sortMeshes(), this.sortedMeshes;
	    }
	    _compare(e, n) {
	        return transformMat4$2(at$1, e.geometry.boundingBox.getCenter(), e.localTransform), 
	        transformMat4$2(ct$1, n.geometry.boundingBox.getCenter(), n.localTransform), dist$2(ct$1, this._cameraPosition) - dist$2(at$1, this._cameraPosition);
	    }
	}

	var ut$1 = String.fromCharCode;

	function ht$1(e, t, n, r) {
	    if (e[3] > 0) {
	        var i = Math.pow(2, e[3] - 128 - 8 + r);
	        t[n + 0] = e[0] * i, t[n + 1] = e[1] * i, t[n + 2] = e[2] * i;
	    } else t[n + 0] = 0, t[n + 1] = 0, t[n + 2] = 0;
	    return t[n + 3] = 1, t;
	}

	function dt$1(e, t, n) {
	    let r = e[t] / n, i = e[t + 1] / n, o = e[t + 2] / n, s = ne(Math.max(Math.max(r, i), Math.max(o, 1e-6)), 0, 1);
	    s = Math.ceil(255 * s) / 255, e[t] = Math.min(255, r / s * 255), e[t + 1] = Math.min(255, i / s * 255), 
	    e[t + 2] = Math.min(255, o / s * 255), e[t + 3] = Math.min(255, 255 * s);
	}

	function mt(e, t, n, r) {
	    for (var i, o, s = 0, a = 0, c = r; c > 0; ) if (e[a][0] = t[n++], e[a][1] = t[n++], 
	    e[a][2] = t[n++], e[a][3] = t[n++], 1 === e[a][0] && 1 === e[a][1] && 1 === e[a][2]) {
	        for (var l = e[a][3] << s >>> 0; l > 0; l--) (o = e[a])[0] = (i = e[a - 1])[0], 
	        o[1] = i[1], o[2] = i[2], o[3] = i[3], a++, c--;
	        s += 8;
	    } else a++, c--, s = 0;
	    return n;
	}

	function vt(e, t, n, r) {
	    if (r < 8 | r > 32767) return mt(e, t, n, r);
	    var i = t[n++];
	    if (2 !== i) return mt(e, t, n - 1, r);
	    if (e[0][1] = t[n++], e[0][2] = t[n++], i = t[n++], (e[0][2] << 8 >>> 0 | i) >>> 0 !== r) return null;
	    for (let i = 0; i < 4; i++) for (let a = 0; a < r; ) {
	        var o = t[n++];
	        if (o > 128) {
	            o = (127 & o) >>> 0;
	            for (var s = t[n++]; o--; ) e[a++][i] = s;
	        } else for (;o--; ) e[a++][i] = t[n++];
	    }
	    return n;
	}

	function gt(e, t = 0, n = 9) {
	    var r = new Uint8Array(e), i = r.length;
	    if ("#?" !== function(e, t, n) {
	        for (var r = "", i = t; i < n; i++) r += ut$1(e[i]);
	        return r;
	    }(r, 0, 2)) return null;
	    for (var o = 2; o < i && ("\n" !== ut$1(r[o]) || "\n" !== ut$1(r[o + 1])); o++) ;
	    if (o >= i) return null;
	    o += 2;
	    for (var s = ""; o < i; o++) {
	        var a = ut$1(r[o]);
	        if ("\n" === a) break;
	        s += a;
	    }
	    var c = s.split(" "), l = parseInt(c[1]), f = parseInt(c[3]);
	    if (!f || !l) return null;
	    for (var u = o + 1, h = [], d = 0; d < f; d++) {
	        h[d] = [];
	        for (var m = 0; m < 4; m++) h[d][m] = 0;
	    }
	    var v = 0, g = new Array(f * l * 4), _ = 0;
	    for (let e = 0; e < l; e++) {
	        if (!(u = vt(h, r, u, f))) return null;
	        for (let e = 0; e < f; e++) ht$1(h[e], g, _, t), v = Math.max(v, g[_], g[_ + 1], g[_ + 2], g[_ + 3]), 
	        _ += 4;
	    }
	    v = Math.min(v, n), _ = 0;
	    for (let e = 0; e < l; e++) for (let e = 0; e < f; e++) dt$1(g, _, v), _ += 4;
	    return {
	        width: f,
	        height: l,
	        pixels: g,
	        rgbmRange: v
	    };
	}

	const _t = [ "points", "lines", "line strip", "line loop", "triangles", "triangle strip", "triangle fan" ];

	function bt(e) {
	    return _t[e];
	}

	const pt = {
	    5121: "uint8",
	    5123: "uint16",
	    5125: "uint32",
	    5126: "float",
	    36193: "half float"
	};

	function xt(e) {
	    return pt[e];
	}

	const yt = {
	    6406: "alpha",
	    6407: "rgb",
	    6408: "rgba",
	    6409: "luminance",
	    6410: "luminance alpha",
	    33776: "rgb s3tc dxt1",
	    33778: "rgba s3tc dxt3",
	    33779: "rgba s3tc dxt5"
	};

	function Tt(e) {
	    return yt[e];
	}

	const At = {
	    9729: "linear",
	    9728: "nearest"
	};

	function St(e) {
	    return At[e];
	}

	const Mt = {
	    9729: "linear",
	    9728: "nearest",
	    9984: "nearest mipmap nearest",
	    9985: "linear mipmap nearest",
	    9986: "nearest mipmap linear",
	    9987: "linear mipmap linear"
	};

	function Et(e) {
	    return Mt[e];
	}

	const wt = {
	    10497: "repeat",
	    33071: "clamp",
	    33648: "mirror"
	};

	function Ot(e) {
	    return wt[e];
	}

	const Ct = "__reshader_webgl_buffer", Pt = "__reshader_webgl_tex";

	function It(e, t, n) {
	    let r;
	    if (ee(t) ? t.buffer && void 0 !== t.byteOffset && (r = t) : t.array && t.array.buffer && void 0 !== t.array.byteOffset && (r = t.array), 
	    !r) return null;
	    const i = r.buffer, o = r.byteOffset;
	    i[Ct] || (i[Ct] = {});
	    let s = i[Ct][o];
	    if (!s) {
	        const t = {};
	        n && J$1(t, n), t.data = r, s = e.buffer(t), i[Ct][o] = s;
	    }
	    return s;
	}

	function Dt(e, t) {
	    const n = t.data;
	    if (!n || !n.buffer) return e.texture(t);
	    const r = n.buffer, i = n.byteOffset;
	    r[Pt] || (r[Pt] = {});
	    let o = r[Pt][i];
	    return o || (o = e.texture(t), r[Pt][i] = o), o;
	}

	var Nt = Object.freeze({
	    __proto__: null,
	    getPrimitive: bt,
	    getMaterialType: xt,
	    getMaterialFormat: Tt,
	    getTextureMagFilter: St,
	    getTextureMinFilter: Et,
	    getTextureWrap: Ot,
	    getUniqueREGLBuffer: It,
	    getUniqueTexture: Dt
	});

	class Ft extends ve {
	    onLoad({data: e}) {
	        const t = this.config;
	        t && (t.hdr ? (e = gt(e.data, 0, t.maxRange), this.rgbmRange = e.rgbmRange, t.data = e.pixels) : t.data = e, 
	        t.width = t.width || e.width, t.height = t.height || e.height, this._updateREGL());
	    }
	    createREGLTexture(e) {
	        if (ee(this.config.data)) {
	            const t = Dt(e, this.config);
	            return t._reshader_refCount || (t._reshader_refCount = 0), t._reshader_refCount++, 
	            t;
	        }
	        return e.texture(this.config);
	    }
	}

	class Rt extends ve {
	    onLoad(e) {
	        const t = this.config;
	        if (!t) return;
	        const n = this._createFaces(e);
	        t.faces = n.map(e => e.data), this._updateREGL();
	    }
	    createREGLTexture(e) {
	        return e.cube(this.config);
	    }
	    _createFaces() {
	        return [];
	    }
	}

	class Bt extends ke {
	    constructor(e) {
	        super({
	            aPosition: new (te(e = e || 0))([ -1, -1, e, 1, -1, e, -1, 1, e, 1, 1, e ]),
	            aNormal: new Int8Array([ 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1 ])
	        }, new Uint16Array([ 0, 1, 3, 3, 2, 0 ]));
	    }
	}

	const Lt = {
	    vsm_shadow_vert: "\nuniform mat4 shadow_lightProjViewModelMatrix;\nvarying vec4 shadow_vLightSpacePos;\nvoid shadow_computeShadowPars(vec4 position) {\n    shadow_vLightSpacePos = shadow_lightProjViewModelMatrix * position;\n}",
	    vsm_shadow_frag: "\nuniform sampler2D shadow_shadowMap;\nuniform float shadow_opacity;\nuniform vec3 shadow_color;\n#if defined(USE_ESM)\n    uniform float esm_shadow_threshold;\n#endif\nvarying vec4 shadow_vLightSpacePos;\n#ifdef PACK_FLOAT\n    #include <common_pack_float>\n#endif\n#if defined(USE_ESM)\nfloat esm(vec3 projCoords, vec4 shadowTexel) {\n    float compare = projCoords.z;\n    float c = 120.0;\n    #ifdef PACK_FLOAT\n        float depth = common_decodeDepth(shadowTexel);\n        if (depth >= 1.0 - 1E-6 || compare <= depth) {\n            return 1.0;\n        }\n    #else\n        float depth = shadowTexel.r;\n    #endif\n    depth = exp(-c * min(compare - depth, 0.05));\n    return clamp(depth, esm_shadow_threshold, 1.0);\n}\n#endif\n#if defined(USE_VSM)\nfloat vsm_shadow_chebyshevUpperBound(vec3 projCoords, vec4 shadowTexel){\n    vec2 moments = shadowTexel.rg;\n    float distance = projCoords.z;\n    if (distance >= 1.0 || distance <= moments.x)\n        return 1.0 ;\n    float variance = moments.y - (moments.x * moments.x);\n    variance = max(variance, 0.00002);\n    float d = distance - moments.x;\n    float p_max = variance / (variance + d * d);\n    return p_max;\n}\n#endif\nfloat shadow_computeShadow_coeff(sampler2D shadowMap, vec3 projCoords) {\n    vec2 uv = projCoords.xy;\n    vec4 shadowTexel = texture2D(shadowMap, uv);\n    #if defined(USE_ESM)\n        float esm_coeff = esm(projCoords, shadowTexel);\n        float coeff = esm_coeff * esm_coeff;\n    #endif\n    #if defined(USE_VSM)\n        float vsm_coeff = vsm_shadow_chebyshevUpperBound(projCoords, shadowTexel);\n        float coeff = vsm_coeff;\n    #endif\n    return 1.0 - (1.0 - coeff) * shadow_opacity;\n}\nfloat shadow_computeShadow() {\n    vec3 projCoords = shadow_vLightSpacePos.xyz / shadow_vLightSpacePos.w;\n    projCoords = projCoords * 0.5 + 0.5;\n    if(projCoords.z >= 1.0 || projCoords.x < 0.0 || projCoords.x > 1.0 || projCoords.y < 0.0 || projCoords.y > 1.0) return 1.0;\n    return shadow_computeShadow_coeff(shadow_shadowMap, projCoords);\n}\nvec3 shadow_blend(vec3 color, float coeff) {\n    color = color * coeff + shadow_color * shadow_opacity * (1.0 - coeff);\n    return color;\n}",
	    fbo_picking_vert: "\n#ifdef ENABLE_PICKING\n#if HAS_PICKING_ID == 1\nattribute float aPickingId;\n#elif HAS_PICKING_ID == 2\nuniform float uPickingId;\n#endif\nvarying float vPickingId;\nvarying float vFbo_picking_viewZ;\nvarying float vFbo_picking_visible;\n#endif\nvoid fbo_picking_setData(float viewPosZ, bool visible) {\n    #ifdef ENABLE_PICKING\n    #if HAS_PICKING_ID == 1\n       vPickingId = aPickingId;\n    #elif HAS_PICKING_ID == 2\n        vPickingId = uPickingId;\n    #endif\n        vFbo_picking_viewZ = viewPosZ;\n    #endif\n    vFbo_picking_visible = visible ? 1.0 : 0.0;\n}",
	    common_pack_float: "const float COMMON_FLOAT_MAX =  1.70141184e38;\nconst float COMMON_FLOAT_MIN = 1.17549435e-38;\nfloat common_packFloat(vec4 val){\n    vec4 scl = floor(255.0 * val + 0.5);\n    float sgn = (scl.a < 128.0) ? 1.0 : -1.0;\n    float exn = mod(scl.a * 2.0, 256.0) + floor(scl.b / 128.0) - 127.0;\n    float man = 1.0 +\n        (scl.r / 8388608.0) +\n        (scl.g / 32768.0) +\n        mod(scl.b, 128.0) / 128.0;\n    return sgn * man * pow(2.0, exn);\n}\nvec4 common_unpackFloat(highp float v) {\n    highp float av = abs(v);\n    if(av < COMMON_FLOAT_MIN) {\n        return vec4(0.0, 0.0, 0.0, 0.0);\n    } else if(v > COMMON_FLOAT_MAX) {\n        return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;\n    } else if(v < -COMMON_FLOAT_MAX) {\n        return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;\n    }\n    highp vec4 c = vec4(0,0,0,0);\n    highp float e = floor(log2(av));\n    highp float m = av * pow(2.0, -e) - 1.0;\n    c[1] = floor(128.0 * m);\n    m -= c[1] / 128.0;\n    c[2] = floor(32768.0 * m);\n    m -= c[2] / 32768.0;\n    c[3] = floor(8388608.0 * m);\n    highp float ebias = e + 127.0;\n    c[0] = floor(ebias / 2.0);\n    ebias -= c[0] * 2.0;\n    c[1] += floor(ebias) * 128.0;\n    c[0] += 128.0 * step(0.0, -v);\n    return c / 255.0;\n}\nvec4 common_encodeDepth(const in float depth) {\n    float alpha = 1.0;\n    vec4 pack = vec4(0.0);\n    pack.a = alpha;\n    const vec3 code = vec3(1.0, 255.0, 65025.0);\n    pack.rgb = vec3(code * depth);\n    pack.gb = fract(pack.gb);\n    pack.rg -= pack.gb * (1.0 / 256.0);\n    pack.b -= mod(pack.b, 4.0 / 255.0);\n    return pack;\n}\nfloat common_decodeDepth(const in vec4 pack) {\n    return pack.r + pack.g / 255.0;\n}",
	    invert_matrix: "mat4 invert_matrix(mat4 matrix) {\n    #if __VERSION__ == 300\n        return inverse(matrix);\n    #else\n        vec4 vector1 = matrix[0], vector2 = matrix[1], vector3 = matrix[2], vector4 = matrix[3];\n        float a00 = vector1.x, a01 = vector1.y, a02 = vector1.z, a03 = vector1.w;\n        float a10 = vector2.x, a11 = vector2.y, a12 = vector2.z, a13 = vector2.w;\n        float a20 = vector3.x, a21 = vector3.y, a22 = vector3.z, a23 = vector3.w;\n        float a30 = vector4.x, a31 = vector4.y, a32 = vector4.z, a33 = vector4.w;\n        float b00 = a00 * a11 - a01 * a10;\n        float b01 = a00 * a12 - a02 * a10;\n        float b02 = a00 * a13 - a03 * a10;\n        float b03 = a01 * a12 - a02 * a11;\n        float b04 = a01 * a13 - a03 * a11;\n        float b05 = a02 * a13 - a03 * a12;\n        float b06 = a20 * a31 - a21 * a30;\n        float b07 = a20 * a32 - a22 * a30;\n        float b08 = a20 * a33 - a23 * a30;\n        float b09 = a21 * a32 - a22 * a31;\n        float b10 = a21 * a33 - a23 * a31;\n        float b11 = a22 * a33 - a23 * a32;\n        float det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n        det = 1.0 / det;\n        mat4 m = mat4(\n            (a11 * b11 - a12 * b10 + a13 * b09) * det,\n            (a02 * b10 - a01 * b11 - a03 * b09) * det,\n            (a31 * b05 - a32 * b04 + a33 * b03) * det,\n            (a22 * b04 - a21 * b05 - a23 * b03) * det,\n            (a12 * b08 - a10 * b11 - a13 * b07) * det,\n            (a00 * b11 - a02 * b08 + a03 * b07) * det,\n            (a32 * b02 - a30 * b05 - a33 * b01) * det,\n            (a20 * b05 - a22 * b02 + a23 * b01) * det,\n            (a10 * b10 - a11 * b08 + a13 * b06) * det,\n            (a01 * b08 - a00 * b10 - a03 * b06) * det,\n            (a30 * b04 - a31 * b02 + a33 * b00) * det,\n            (a21 * b02 - a20 * b04 - a23 * b00) * det,\n            (a11 * b07 - a10 * b09 - a12 * b06) * det,\n            (a00 * b09 - a01 * b07 + a02 * b06) * det,\n            (a31 * b01 - a30 * b03 - a32 * b00) * det,\n            (a20 * b03 - a21 * b01 + a22 * b00) * det\n        );\n        return m;\n    #endif\n}\nmat4 transpose_matrix(mat4 matrix) {\n    #if __VERSION__ == 300\n        return transpose(matrix);\n    #else\n        vec4 vector1 = matrix[0], vector2 = matrix[1], vector3 = matrix[2], vector4 = matrix[3];\n        float a01 = vector1.y, a02 = vector1.z, a03 = vector1.w;\n        float a12 = vector2.z, a13 = vector2.w;\n        float a23 = vector3.w;\n        mat4 m = mat4(\n            vector1.x,\n            vector2.x,\n            vector3.x,\n            vector4.x,\n            a01,\n            vector2.y,\n            vector3.y,\n            vector4.y,\n            a02,\n            a12,\n            vector3.z,\n            vector4.z,\n            a03,\n            a13,\n            a23,\n            vector4.w\n        );\n        return m;\n    #endif\n}",
	    get_output: "#include <invert_matrix>\n#ifdef HAS_INSTANCE\n    #include <instance_vert>\n    #ifdef HAS_INSTANCE_COLOR\n        varying vec4 vInstanceColor;\n    #endif\n#endif\n#ifdef HAS_SKIN\n    uniform int skinAnimation;\n    #include <skin_vert>\n#endif\n#ifdef HAS_MORPH\n    attribute vec3 POSITION0;\n    attribute vec3 POSITION1;\n    attribute vec3 POSITION2;\n    attribute vec3 POSITION3;\n    attribute vec3 POSITION4;\n    attribute vec3 POSITION5;\n    attribute vec3 POSITION6;\n    attribute vec3 POSITION7;\n    #ifdef HAS_MORPHNORMALS\n        attribute vec3 NORMAL0;\n        attribute vec3 NORMAL1;\n        attribute vec3 NORMAL2;\n        attribute vec3 NORMAL3;\n    #endif\n    uniform vec4 morphWeights1;\n    uniform vec4 morphWeights2;\n#endif\nmat4 getPositionMatrix() {\n    mat4 worldMatrix;\n    #ifdef HAS_INSTANCE\n        #ifdef HAS_INSTANCE_COLOR\n            vInstanceColor = instance_getInstanceColor();\n        #endif\n        mat4 attributeMatrix = instance_getAttributeMatrix();\n        #ifdef HAS_SKIN\n            if (skinAnimation == 1) {\n                worldMatrix = attributeMatrix * positionMatrix * skin_getSkinMatrix();\n            } else {\n                worldMatrix = attributeMatrix * positionMatrix;\n            }\n        #else\n            worldMatrix = attributeMatrix * positionMatrix;\n        #endif\n    #else\n        #ifdef HAS_SKIN\n            if (skinAnimation == 1) {\n                worldMatrix = skin_getSkinMatrix() * positionMatrix;\n            } else {\n                worldMatrix = positionMatrix;\n            }\n        #else\n            worldMatrix = positionMatrix;\n        #endif\n    #endif\n    return worldMatrix;\n}\nvec4 getPosition(vec3 position) {\n    #ifdef HAS_MORPH\n        vec4 POSITION = vec4(position + morphWeights1[0] * POSITION0 + morphWeights1[1] * POSITION1 + morphWeights1[2] * POSITION2 + morphWeights1[3] * POSITION3\n        + morphWeights2[0] * POSITION4 + morphWeights2[1] * POSITION5 + morphWeights2[2] * POSITION6 + morphWeights2[3] * POSITION7\n        , 1.0);\n    #else\n        vec4 POSITION = vec4(position, 1.0);\n    #endif\n    return POSITION;\n}\nvec3 appendMorphNormal(vec3 NORMAL) {\n    #ifdef HAS_MORPHNORMALS\n        vec3 normal = NORMAL + morphWeights1[0] * NORMAL0 + morphWeights1[1] * NORMAL1 + morphWeights1[2] * NORMAL2 + morphWeights1[3] * NORMAL3;\n    #else\n        vec3 normal = NORMAL;\n    #endif\n    return normal;\n}",
	    instance_vert: "attribute vec4 instance_vectorA;\nattribute vec4 instance_vectorB;\nattribute vec4 instance_vectorC;\nmat4 instance_getAttributeMatrix() {\n    mat4 mat =  mat4(\n        instance_vectorA.x, instance_vectorB.x, instance_vectorC.x, 0.0,\n        instance_vectorA.y, instance_vectorB.y, instance_vectorC.y, 0.0,\n        instance_vectorA.z, instance_vectorB.z, instance_vectorC.z, 0.0,\n        instance_vectorA.w, instance_vectorB.w, instance_vectorC.w, 1.0\n    );\n    return mat;\n}\n#ifdef HAS_INSTANCE_COLOR\n    attribute vec4 instance_color;\n    vec4 instance_getInstanceColor() {\n        return instance_color;\n    }\n#endif",
	    skin_vert: "attribute vec4 WEIGHTS_0;\nattribute vec4 JOINTS_0;\nuniform sampler2D jointTexture;\nuniform vec2 jointTextureSize;\nuniform float numJoints;\n#define ROW0_U ((0.5 + 0.0) / 4.)\n#define ROW1_U ((0.5 + 1.0) / 4.)\n#define ROW2_U ((0.5 + 2.0) / 4.)\n#define ROW3_U ((0.5 + 3.0) / 4.)\nmat4 skin_getBoneMatrix(float jointNdx) {\n    float v = (jointNdx + 0.5) / numJoints;\n    return mat4(\n        texture2D(jointTexture, vec2(ROW0_U, v)),\n        texture2D(jointTexture, vec2(ROW1_U, v)),\n        texture2D(jointTexture, vec2(ROW2_U, v)),\n        texture2D(jointTexture, vec2(ROW3_U, v)));\n}\nmat4 skin_getSkinMatrix() {\n        mat4 skinMatrix = skin_getBoneMatrix(JOINTS_0[0]) * WEIGHTS_0[0] +\n                        skin_getBoneMatrix(JOINTS_0[1]) * WEIGHTS_0[1] +\n                        skin_getBoneMatrix(JOINTS_0[2]) * WEIGHTS_0[2] +\n                        skin_getBoneMatrix(JOINTS_0[3]) * WEIGHTS_0[3];\n        return skinMatrix;\n}",
	    viewshed_frag: "#ifdef HAS_VIEWSHED\n    uniform sampler2D viewshed_depthMapFromViewpoint;\n    uniform vec4 viewshed_visibleColor;\n    uniform vec4 viewshed_invisibleColor;\n    varying vec4 viewshed_positionFromViewpoint;\nfloat viewshed_unpack(const in vec4 rgbaDepth) {\n    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));\n    float depth = dot(rgbaDepth, bitShift);\n    return depth;\n}\nvec4 viewshed_draw(vec4 color) {\n    vec3 shadowCoord = (viewshed_positionFromViewpoint.xyz / viewshed_positionFromViewpoint.w)/2.0 + 0.5;\n    vec4 rgbaDepth = texture2D(viewshed_depthMapFromViewpoint, shadowCoord.xy);\n    float depth = viewshed_unpack(rgbaDepth);    if (shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0 && shadowCoord.z <= 1.0) {\n        if (shadowCoord.z <= depth + 0.002) {\n            color = viewshed_visibleColor;\n        } else {\n            color = viewshed_invisibleColor;\n        }\n    }\n    return color;\n}\n#endif",
	    viewshed_vert: "#ifdef HAS_VIEWSHED\n        uniform mat4 viewshed_projViewMatrixFromViewpoint;\n        varying vec4 viewshed_positionFromViewpoint;\n        void viewshed_getPositionFromViewpoint(vec4 scenePosition) {\n            viewshed_positionFromViewpoint = viewshed_projViewMatrixFromViewpoint * scenePosition;\n        }\n    #endif",
	    flood_frag: "#ifdef HAS_FLOODANALYSE\n    varying float flood_height;\n    uniform float flood_waterHeight;\n    uniform vec3 flood_waterColor;\n    vec4 draw_floodAnalyse(vec4 color) {\n        if (flood_height < flood_waterHeight) {\n           color = vec4(mix(flood_waterColor, color.rgb, 0.6), color.a);\n        }\n        return color;\n    }\n#endif",
	    flood_vert: "#ifdef HAS_FLOODANALYSE\n    varying float flood_height;\n    void flood_getHeight(vec4 worldPosition) {\n        flood_height = worldPosition.z;\n    }\n#endif",
	    heatmap_render_vert: "#ifdef HAS_HEATMAP\nvarying vec2 heatmap_vTexCoord;\nvoid heatmap_compute(mat4 matrix, vec3 position) {\n    vec4 pos = matrix * vec4(position.xy, 0., 1.);\n    heatmap_vTexCoord = (1. + pos.xy / pos.w) / 2.;\n}\n#endif",
	    heatmap_render_frag: "#ifdef HAS_HEATMAP\nuniform sampler2D heatmap_inputTexture;\nuniform sampler2D heatmap_colorRamp;\nuniform float heatmap_heatmapOpacity;\nvarying vec2 heatmap_vTexCoord;\nvec4 heatmap_getColor(vec4 color) {\n    float t = texture2D(heatmap_inputTexture, heatmap_vTexCoord).r;\n    vec4 heatmapColor = texture2D(heatmap_colorRamp, vec2(t, 0.5)) * heatmap_heatmapOpacity;\n    return color * (1.0 - heatmapColor.a) + heatmapColor * heatmapColor.a;\n}\n#endif",
	    line_extrusion_vert: "#ifdef IS_LINE_EXTRUSION\n    #define ALTITUDE_SCALE 32767.0;\n    #define EXTRUDE_SCALE 63.0;\n    attribute vec2 aExtrude;\n    #ifdef HAS_LINE_WIDTH\n        attribute float aLineWidth;\n    #else\n        uniform float lineWidth;\n    #endif\n    #ifdef HAS_LINE_HEIGHT\n        attribute float aLineHeight;\n    #else\n        uniform float lineHeight;\n    #endif\n    uniform float linePixelScale;\n    vec3 getLineExtrudePosition(vec3 position) {\n        #ifdef HAS_LINE_WIDTH\n            float lineWidth = aLineWidth / 2.0;\n        #endif\n        #ifdef HAS_LINE_HEIGHT\n            float lineHeight = aLineHeight / 10.0;\n        #endif\n        float halfwidth = lineWidth / 2.0;\n        float outset = halfwidth;\n        vec2 dist = outset * aExtrude / EXTRUDE_SCALE;\n        position.z *= lineHeight / ALTITUDE_SCALE;\n        return position + vec3(dist, 0.0) * linePixelScale;\n    }\n#endif",
	    fog_render_vert: "#ifdef HAS_FOG\n    varying float vFog_Dist;\n    void fog_getDist(vec4 worldPosition) {\n        vFog_Dist = worldPosition.y;\n    }\n#endif",
	    fog_render_frag: "#ifdef HAS_FOG\n    varying float vFog_Dist;\n    uniform vec2 fog_Dist;\n    uniform vec3 fog_Color;\n    vec4 draw_fog(vec4 color) {\n        float fogFactor = clamp((vFog_Dist - fog_Dist.x) / (fog_Dist.y - fog_Dist.x), 0.0, 1.0);\n        vec3 color = mix(fog_Color, gl_FragColor.rgb, fogFactor);\n        color = vec4(color, gl_FragColor.a);\n        return color;\n    }\n#endif",
	    gl2_vert: "#if __VERSION__ == 300\n    #define texture2D texture\n    #define varying out\n    #define attribute in\n#endif",
	    gl2_frag: "#if __VERSION__ == 300\n    #define varying in\n    #define gl_FragDepthEXT gl_FragDepth\n    #define texture2D texture\n    #define textureCube texture\n    #define texture2DProj textureProj\n    #define texture2DLodEXT textureLod\n    #define texture2DProjLodEXT textureProjLod\n    #define textureCubeLodEXT textureLod\n    #define texture2DGradEXT textureGrad\n    #define texture2DProjGradEXT textureProjGrad\n    #define textureCubeGradEXT textureGrad\n    #define texture2D texture\n    out vec4 glFragColor;\n#else\n    vec4 glFragColor;\n#endif",
	    hsv_frag: "\nconst mediump vec4 HSV_K0 = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\nconst mediump vec4 HSV_K1 = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\nconst mediump float HSV_E = 1.0e-10;\nvec3 hsv_rgb2hsv(vec3 c) {\n    vec4 K = HSV_K0;\n    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n    float d = q.x - min(q.w, q.y);\n    float e = HSV_E;\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\nvec3 hsv_hsv2rgb(vec3 c) {\n    vec4 K = HSV_K1;\n    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\nvec4 hsv_apply(vec4 c, vec3 hsvOffset) {\n    vec3 hsv = hsv_rgb2hsv(c.rgb);\n    hsv += hsv * hsvOffset;\n    hsv = clamp(hsv, 0.0, 1.0);\n    return vec4(hsv_hsv2rgb(hsv), c.a);\n}\nvec3 hsv_apply(vec3 c, vec3 hsvOffset) {\n    vec3 hsv = hsv_rgb2hsv(c.rgb);\n    hsv += hsv * hsvOffset;\n    hsv = clamp(hsv, 0.0, 1.0);\n    return hsv_hsv2rgb(hsv);\n}\nmat4 contrastMatrix(float contrast)\n{\n    float t = (1.0 - contrast) / 2.0;\n    return mat4(\n        contrast, 0., 0., 0.,\n        0., contrast, 0., 0.,\n        0., 0., contrast, 0.,\n        t, t, t, 1\n    );\n}"
	};

	var Ht = {
	    register(e, t) {
	        if (Lt[e]) throw new Error(`Key of ${e} is already registered in ShaderLib.`);
	        Lt[e] = t;
	    },
	    compile: e => kt(e)
	};

	const zt = /^[ \t]*#include +<([\w\d.]+)>/gm;

	function kt(e) {
	    return e.replace(zt, Vt);
	}

	function Vt(e, t) {
	    const n = Lt[t];
	    if (!n) throw new Error("Can not resolve #include <" + t + ">");
	    return kt(n);
	}

	const jt = "function", Ut = "array";

	let Gt = 0;

	class Xt {
	    constructor({vert: e, frag: t, uniforms: n, defines: r, extraCommandProps: i}) {
	        this.vert = e, this.frag = t;
	        const o = Gt++;
	        Object.defineProperty(this, "uid", {
	            enumerable: !0,
	            configurable: !1,
	            get: () => o
	        }), this.shaderDefines = r && J$1({}, r) || {}, n = this.uniforms = (n || []).slice(), 
	        this.contextDesc = {};
	        for (let e = 0, t = n.length; e < t; e++) {
	            const t = n[e];
	            if (X$1(t)) if (t.indexOf("[") > 0) {
	                const {name: e, len: n} = qt(t);
	                this.contextDesc[e] = {
	                    name: e,
	                    type: "array",
	                    length: n
	                };
	            } else this.contextDesc[t] = null; else if (t.name.indexOf("[") > 0) {
	                const {name: e, len: n} = qt(t.name);
	                this.contextDesc[e] = {
	                    name: e,
	                    type: "array",
	                    length: n,
	                    fn: t.fn
	                };
	            } else this.contextDesc[t.name] = t;
	        }
	        this.extraCommandProps = i && J$1({}, i) || {}, this.commands = {}, this._compileSource();
	    }
	    set shaderDefines(e) {
	        this._shaderDefines = e, this.dkey = Object.keys(this._shaderDefines).join();
	    }
	    get shaderDefines() {
	        return this._shaderDefines || {};
	    }
	    setDefines(e) {
	        this.shaderDefines = e;
	    }
	    setFramebuffer(e) {
	        return this.context.framebuffer = e, this;
	    }
	    appendDescUniforms(e) {
	        const t = e, n = this.contextDesc;
	        for (const r in n) if (n[r]) if ("array" === n[r].type) {
	            const i = r, o = n[r].length;
	            let s = e[r];
	            if (n[r].fn && (s = n[r].fn(null, e)), !s) continue;
	            if (s.length !== o) throw new Error(`${i} uniform's length is not ${o}`);
	            t[i] = t[i] || {};
	            for (let e = 0; e < o; e++) t[i]["" + e] = s[e];
	        } else "function" === n[r].type && (Object.getOwnPropertyDescriptor(t, r) || Object.defineProperty(t, r, {
	            configurable: !1,
	            enumerable: !0,
	            get: function() {
	                return n[r].fn(null, e);
	            }
	        }));
	        return t;
	    }
	    setUniforms(e) {
	        if (e.modelMatrix || e.positionMatrix) throw new Error("modelMatrix or positionMatrix is reserved uniform name for Mesh, please change to another name");
	        return this.contextKeys = e ? Object.keys(e).join() : null, this.context = e, this;
	    }
	    getVersion(e, t) {
	        if ("#version" === t.substring(0, 8)) return "";
	        return 0 === e.limits.version.indexOf("WebGL 2.0") && 300 === this.version ? "#version 300 es\n" : "#version 100\n";
	    }
	    getActiveVars(e, t, n) {
	        const r = e._gl, i = r.createProgram(), o = r.createShader(35633);
	        r.shaderSource(o, t), r.compileShader(o);
	        const s = r.createShader(35632);
	        r.shaderSource(s, n), r.compileShader(s), r.attachShader(i, s), r.attachShader(i, o), 
	        r.linkProgram(i);
	        const a = r.getProgramParameter(i, 35721), c = [];
	        for (let e = 0; e < a; ++e) {
	            const t = r.getActiveAttrib(i, e);
	            t && c.push({
	                name: t.name,
	                type: t.type
	            });
	        }
	        const l = r.getProgramParameter(i, 35718), f = [];
	        for (let e = 0; e < l; ++e) {
	            const t = r.getActiveUniform(i, e);
	            let n = t.name;
	            t.name.indexOf("[") > 0 && (n = n.replace("[0]", "")), f.push(n);
	        }
	        return r.deleteProgram(i), r.deleteShader(o), r.deleteShader(s), {
	            activeUniforms: f,
	            activeAttributes: c
	        };
	    }
	    createREGLCommand(e, t, n, r, i) {
	        const o = re(e) && !i, s = J$1({}, this.shaderDefines || {}, t || {}), a = this._insertDefines(this.vert, s), c = this.getVersion(e, a) + a, l = this._insertDefines(this.frag, s), f = this.getVersion(e, l) + l, {activeAttributes: u, activeUniforms: h} = this.getActiveVars(e, c, f), d = {};
	        u.forEach((t, n) => {
	            const r = t.name;
	            d[r] = o ? n : e.prop(r);
	        });
	        const m = {};
	        h.forEach(t => {
	            m[t] = e.prop(t);
	        });
	        const v = this.contextDesc;
	        for (const t in v) if (v[t] && v[t].type === jt) m[t] = v[t].fn; else if (v[t] && v[t].type === Ut) {
	            const n = v[t].name, r = v[t].length;
	            for (let t = 0; t < r; t++) {
	                const r = `${n}[${t}]`;
	                m[r] = e.prop(r);
	            }
	        } else m[t] = e.prop(t);
	        const g = {
	            vert: c,
	            frag: f,
	            uniforms: m,
	            attributes: d
	        };
	        o && (g.vao = e.prop("vao")), o && !r || !n || Q$1(n) || (g.elements = e.prop("elements")), 
	        g.count = e.prop("count"), g.offset = e.prop("offset"), g.primitive = e.prop("primitive"), 
	        g.framebuffer = e.prop("framebuffer"), r && (g.instances = e.prop("instances")), 
	        J$1(g, this.extraCommandProps);
	        const _ = e(g);
	        return u.key = u.map(e => e.name).join(), _.activeAttributes = u, _;
	    }
	    dispose() {
	        for (const e in this.commands) {
	            const t = this.commands[e];
	            t && (t.destroy && !t[de] && (t[de] = !0, t.destroy()));
	        }
	        this.commands = {}, delete this.vert, delete this.frag;
	    }
	    _insertDefines(e, t) {
	        const n = [];
	        for (const e in t) ie(t, e) && !K$1(t[e]) && n.push(`#define ${e} ${t[e]}\n`);
	        return n.join("") + e;
	    }
	    _compileSource() {
	        this.vert = Ht.compile(this.vert), this.frag = Ht.compile(this.frag);
	    }
	}

	function qt(e) {
	    const t = e.indexOf("["), n = e.indexOf("]");
	    return {
	        name: e.substring(0, t),
	        len: +e.substring(t + 1, n)
	    };
	}

	class Wt extends Xt {
	    draw(e, t) {
	        if (!t || !t.length) return 0;
	        const n = [];
	        let r, i = 0;
	        for (let o = 0, s = t.length; o < s; o++) {
	            if (!t[o].isValid()) {
	                o === s - 1 && r && n.length && r(n);
	                continue;
	            }
	            if (!t[o].geometry.getDrawCount() || !this._runFilter(t[o])) {
	                o === s - 1 && r && n.length && r(n);
	                continue;
	            }
	            const a = this.getMeshCommand(e, t[o]);
	            n.length && r !== a && (r(n), n.length = 0);
	            const c = t[o].getREGLProps(e, a.activeAttributes);
	            this._ensureContextDefines(c), c.shaderContext = this.context, this.appendDescUniforms(c), 
	            n.push(c), i++, o < s - 1 ? r = a : o === s - 1 && a(n);
	        }
	        return i;
	    }
	    _ensureContextDefines(e) {
	        if (this.context && (e.contextKeys || (e.contextKeys = {}), e.contextKeys[this.uid] !== this.contextKeys)) {
	            for (const t in this.context) Object.getOwnPropertyDescriptor(e, t) || Object.defineProperty(e, t, {
	                configurable: !1,
	                enumerable: !0,
	                get: function() {
	                    return this.shaderContext && this.shaderContext[t];
	                }
	            });
	            e.contextKeys[this.uid] = this.contextKeys;
	        }
	    }
	    _runFilter(e) {
	        const t = this.filter;
	        if (!t) return !0;
	        if (Array.isArray(t)) {
	            for (let n = 0; n < t.length; n++) if (!t[n](e)) return !1;
	            return !0;
	        }
	        return t(e);
	    }
	    getMeshCommand(e, t) {
	        this._cmdKeys || (this._cmdKeys = {});
	        const n = this.dkey || "default";
	        let r = this._cmdKeys[n];
	        r || (r = this._cmdKeys[n] = {});
	        const i = t.getCommandKey(e);
	        r[i] || (r[i] = n + "_" + t.getCommandKey(e));
	        const o = r[i];
	        let s = this.commands[o];
	        if (!s) {
	            const n = t.getDefines(), r = t.getMaterial();
	            if (r) {
	                r.doubleSided && this.extraCommandProps && this.extraCommandProps.cull && (this.extraCommandProps.cull.enable = !1);
	            }
	            s = this.commands[o] = this.createREGLCommand(e, n, t.getElements(), t instanceof it$1, t.disableVAO);
	        }
	        return s;
	    }
	}

	class Kt extends Wt {
	    constructor(e = {}) {
	        let t = e.extraCommandProps || {};
	        const n = [];
	        t = J$1({}, t, {
	            blend: {
	                enable: !0,
	                func: {
	                    src: "src alpha",
	                    dst: "one minus src alpha"
	                },
	                equation: "add"
	            },
	            sample: {
	                alpha: !0
	            }
	        }), super({
	            vert: "#include <gl2_vert>\nattribute vec3 aPosition;\nattribute vec3 aBarycentric;\nvarying vec3 vBarycentric;\nuniform mat4 modelMatrix;\nuniform mat4 projViewMatrix;\nuniform mat4 projViewModelMatrix;\nuniform mat4 positionMatrix;\nvarying vec3 vPosition;\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#include <fog_render_vert>\nvoid main() {\n  mat4 c = getPositionMatrix();\n  vec4 d = getPosition(aPosition);\n  gl_Position = projViewModelMatrix * c * d;\n  vBarycentric = aBarycentric;\n  vPosition = aPosition;\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * c * d);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * c * d);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * c * d);\n#endif\n}",
	            frag: "#if __VERSION__ == 100\n#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\n#endif\nprecision mediump float;\n#include <gl2_frag>\nvarying vec3 vBarycentric;\nuniform float time;\nuniform float thickness;\nuniform float secondThickness;\nuniform float dashRepeats;\nuniform float dashLength;\nuniform bool dashOverlap;\nuniform bool dashEnabled;\nuniform bool dashAnimate;\nuniform bool seeThrough;\nuniform bool insideAltColor;\nuniform bool dualStroke;\nuniform bool squeeze;\nuniform float squeezeMin;\nuniform float squeezeMax;\nuniform vec4 stroke;\nuniform vec4 fill;\nuniform float opacity;\nuniform bool noiseEnable;\nvarying vec3 vPosition;\n#ifdef HAS_INSTANCE\nvarying vec4 vInstanceColor;\n#endif\n#include <viewshed_frag>\n#include <flood_frag>\n#include <fog_render_frag>\n#define F4 0.309016994374947451\n#define halfDist 0.5\nvec4 c(vec4 x) {\n  return x - floor(x * (1. / 289.)) * 289.;\n}\nfloat c(float x) {\n  return x - floor(x * (1. / 289.)) * 289.;\n}\nvec4 d(vec4 x) {\n  return c((x * 34. + 1.) * x);\n}\nfloat d(float x) {\n  return c((x * 34. + 1.) * x);\n}\nvec4 e(vec4 r) {\n  return 1.79284291400159 - .85373472095314 * r;\n}\nfloat e(float r) {\n  return 1.79284291400159 - .85373472095314 * r;\n}\nvec4 f(float h, vec4 i) {\n  const vec4 k = vec4(1., 1., 1., -1.);\n  vec4 p, s;\n  p.xyz = floor(fract(vec3(h) * i.xyz) * 7.) * i.z - 1.;\n  p.w = 1.5 - dot(abs(p.xyz), k.xyz);\n  s = vec4(lessThan(p, vec4(.0)));\n  p.xyz = p.xyz + (s.xyz * 2. - 1.) * s.www;\n  return p;\n}\nfloat l(vec4 m) {\n  const vec4 n = vec4(.138196601125011, .276393202250021, .414589803375032, -.447213595499958);\n  vec4 o = floor(m + dot(m, vec4(F4)));\n  vec4 u = m - o + dot(o, n.xxxx);\n  vec4 A;\n  vec3 B = step(u.yzw, u.xxx);\n  vec3 D = step(u.zww, u.yyz);\n  A.x = B.x + B.y + B.z;\n  A.yzw = 1. - B;\n  A.y += D.x + D.y;\n  A.zw += 1. - D.xy;\n  A.z += D.z;\n  A.w += 1. - D.z;\n  vec4 E = clamp(A, .0, 1.);\n  vec4 F = clamp(A - 1., .0, 1.);\n  vec4 G = clamp(A - 2., .0, 1.);\n  vec4 H = u - G + n.xxxx;\n  vec4 I = u - F + n.yyyy;\n  vec4 J = u - E + n.zzzz;\n  vec4 K = u + n.wwww;\n  o = c(o);\n  float L = d(d(d(d(o.w) + o.z) + o.y) + o.x);\n  vec4 M = d(d(d(d(o.w + vec4(G.w, F.w, E.w, 1.)) + o.z + vec4(G.z, F.z, E.z, 1.)) + o.y + vec4(G.y, F.y, E.y, 1.)) + o.x + vec4(G.x, F.x, E.x, 1.));\n  vec4 i = vec4(1. / 294., 1. / 49., 1. / 7., .0);\n  vec4 N = f(L, i);\n  vec4 O = f(M.x, i);\n  vec4 P = f(M.y, i);\n  vec4 Q = f(M.z, i);\n  vec4 R = f(M.w, i);\n  vec4 S = e(vec4(dot(N, N), dot(O, O), dot(P, P), dot(Q, Q)));\n  N *= S.x;\n  O *= S.y;\n  P *= S.z;\n  Q *= S.w;\n  R *= e(dot(R, R));\n  vec3 T = max(.6 - vec3(dot(u, u), dot(H, H), dot(I, I)), .0);\n  vec2 U = max(.6 - vec2(dot(J, J), dot(K, K)), .0);\n  T = T * T;\n  U = U * U;\n  return 49. * (dot(T * T, vec3(dot(N, u), dot(O, H), dot(P, I))) + dot(U * U, vec2(dot(Q, J), dot(R, K))));\n}\nconst float V = 3.14159265359;\nfloat W(float X, float Y) {\n  float Z = fwidth(Y) * halfDist;\n  return smoothstep(X - Z, X + Z, Y);\n}\nvec4 ba(vec3 bb) {\n  float bc = min(min(bb.x, bb.y), bb.z);\n  float bd = .0;\n  if(noiseEnable)\n    bd += l(vec4(vPosition.xyz * 80.0, time * halfDist)) * .12;\n  bc += bd;\n  float be = max(bb.x, bb.y);\n  if(bb.y < bb.x && bb.y < bb.z) {\n    be = 1. - be;\n  }\n  float bf = thickness;\n  if(squeeze) {\n    bf *= mix(squeezeMin, squeezeMax, (1. - sin(be * V)));\n  }\n  if(dashEnabled) {\n    float bg = 1. / dashRepeats * dashLength / 2.;\n    if(!dashOverlap) {\n      bg += 1. / dashRepeats / 2.;\n    }\n    if(dashAnimate) {\n      bg += time * .22;\n    }\n    float bh = fract((be + bg) * dashRepeats);\n    bf *= 1. - W(dashLength, bh);\n  }\n  float bi = 1. - W(bf, bc);\n#ifdef HAS_INSTANCE\nvec4 bj = vInstanceColor;\n#else\nvec4 bj = stroke;\n#endif\nvec4 bk = vec4(.0);\n  if(seeThrough) {\n    bk = vec4(bj.xyz, bi);\n    if(insideAltColor && !gl_FrontFacing) {\n      bk.rgb = fill.xyz;\n    }\n  } else {\n    vec3 bl = mix(fill.xyz, bj.xyz, bi);\n    bk.a = fill.a;\n    if(dualStroke) {\n      float bm = 1. - W(secondThickness, bc);\n      vec3 bn = mix(fill.xyz, stroke.xyz, abs(bm - bi));\n      bk.rgb = bn;\n    } else {\n      bk.rgb = bl;\n    }\n  }\n  return bk;\n}\nvoid main() {\n  glFragColor = ba(vBarycentric);\n  glFragColor *= halfDist + opacity;\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
	            uniforms: [ {
	                name: "projViewModelMatrix",
	                type: "function",
	                fn: (e, t) => multiply$5(n, t.projViewMatrix, t.modelMatrix)
	            } ],
	            extraCommandProps: t
	        }), this.version = 300;
	    }
	}

	var Yt = "precision mediump float;\n#include <gl2_frag>\nuniform vec4 baseColorFactor;\nuniform float materialShininess;\nuniform float opacity;\nuniform float ambientStrength;\nuniform float specularStrength;\nuniform vec3 light0_viewDirection;\nuniform vec3 ambientColor;\nuniform vec4 light0_diffuse;\nuniform vec3 lightSpecular;\nuniform vec3 cameraPosition;\n#ifdef HAS_TOON\nuniform float toons;\nuniform float specularToons;\n#endif\n#ifdef HAS_TANGENT\nvarying vec4 vTangent;\n#endif\n#ifdef HAS_MAP\nvarying vec2 vTexCoord;\n#endif\nvarying vec3 vNormal;\nvarying vec3 vFragPos;\n#ifdef HAS_INSTANCE_COLOR\nvarying vec4 vInstanceColor;\n#endif\n#ifdef HAS_BASECOLOR_MAP\nuniform sampler2D baseColorTexture;\n#endif\n#ifdef HAS_EXTRUSION_OPACITY\nuniform vec2 extrusionOpacityRange;\nvarying float vExtrusionOpacity;\n#endif\n#if defined(HAS_COLOR) || defined(HAS_COLOR0)\nvarying vec4 vColor;\n#elif defined(IS_LINE_EXTRUSION)\nuniform vec4 lineColor;\n#else\nuniform vec4 polygonFill;\n#endif\n#ifdef IS_LINE_EXTRUSION\nuniform float lineOpacity;\n#else\nuniform float polygonOpacity;\n#endif\n#ifdef HAS_OCCLUSION_MAP\nuniform sampler2D occlusionTexture;\n#endif\n#ifdef HAS_NORMAL_MAP\nuniform sampler2D normalTexture;\n#endif\n#ifdef HAS_EMISSIVE_MAP\nuniform sampler2D emissiveTexture;\n#endif\n#ifdef SHADING_MODEL_SPECULAR_GLOSSINESS\nuniform vec4 diffuseFactor;\nuniform vec3 specularFactor;\n#ifdef HAS_DIFFUSE_MAP\nuniform sampler2D diffuseTexture;\n#endif\n#ifdef HAS_SPECULARGLOSSINESS_MAP\nuniform sampler2D specularGlossinessTexture;\n#endif\n#endif\n#include <viewshed_frag>\n#include <flood_frag>\n#include <heatmap_render_frag>\n#include <fog_render_frag>\nvec3 c() {\n  \n#if defined(HAS_NORMAL_MAP)\nvec3 d = normalize(vNormal);\n  vec3 e = texture2D(normalTexture, vTexCoord).xyz * 2. - 1.;\n#if defined(HAS_TANGENT)\nvec3 t = normalize(vTangent.xyz);\n  vec3 b = normalize(cross(d, t) * sign(vTangent.w));\n  mat3 f = mat3(t, b, d);\n  return normalize(f * e);\n#else\nreturn normalize(e);\n#endif\n#else\nreturn normalize(vNormal);\n#endif\n}\nvec4 h(const in vec4 i) {\n  return vec4(i.r < .0031308 ? i.r * 12.92 : 1.055 * pow(i.r, 1. / 2.4) - .055, i.g < .0031308 ? i.g * 12.92 : 1.055 * pow(i.g, 1. / 2.4) - .055, i.b < .0031308 ? i.b * 12.92 : 1.055 * pow(i.b, 1. / 2.4) - .055, i.a);\n}\nvec4 j() {\n  \n#if defined(HAS_BASECOLOR_MAP)\nreturn texture2D(baseColorTexture, vTexCoord);\n#elif defined(HAS_DIFFUSE_MAP)\nreturn texture2D(diffuseTexture, vTexCoord);\n#elif defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nreturn diffuseFactor;\n#else\nreturn baseColorFactor;\n#endif\n}\nvec3 k() {\n  \n#if defined(HAS_SPECULARGLOSSINESS_MAP)\nreturn texture2D(specularGlossinessTexture, vTexCoord).rgb;\n#elif defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nreturn specularFactor;\n#else\nreturn vec3(1.);\n#endif\n}\nvoid main() {\n  vec4 l = j();\n  vec3 m = ambientStrength * ambientColor * l.rgb;\n#ifdef HAS_INSTANCE_COLOR\nm *= vInstanceColor.rgb;\n#endif\nvec3 o = c();\n  vec3 u = normalize(-light0_viewDirection);\n  float v = max(dot(o, u), .0);\n#ifdef HAS_TOON\nfloat A = floor(v * toons);\n  v = A / toons;\n#endif\nvec3 B = light0_diffuse.rgb * v * l.rgb;\n#if defined(HAS_COLOR) || defined(HAS_COLOR0)\nvec3 i = vColor.rgb;\n#elif defined(IS_LINE_EXTRUSION)\nvec3 i = lineColor.rgb;\n#else\nvec3 i = polygonFill.rgb;\n#endif\n#ifdef HAS_INSTANCE_COLOR\ni *= vInstanceColor.rgb;\n#endif\nm *= i.rgb;\n  B *= i.rgb;\n  vec3 C = normalize(cameraPosition - vFragPos);\n  vec3 D = normalize(u + C);\n  float E = pow(max(dot(o, D), .0), materialShininess);\n#ifdef HAS_TOON\nfloat F = floor(E * specularToons);\n  E = F / specularToons;\n#endif\nvec3 G = specularStrength * lightSpecular * E * k();\n#ifdef HAS_OCCLUSION_MAP\nfloat H = texture2D(occlusionTexture, vTexCoord).r;\n  m *= H;\n#endif\nvec3 I = m + B + G;\n#ifdef HAS_EMISSIVE_MAP\nvec3 J = texture2D(emissiveTexture, vTexCoord).rgb;\n  I += J;\n#endif\nglFragColor = vec4(I, opacity);\n#if defined(HAS_COLOR) || defined(HAS_COLOR0)\nfloat K = vColor.a;\n#elif defined(IS_LINE_EXTRUSION)\nfloat K = lineColor.a;\n#else\nfloat K = polygonFill.a;\n#endif\nglFragColor *= K;\n#ifdef HAS_EXTRUSION_OPACITY\nfloat L = extrusionOpacityRange.x;\n  float M = extrusionOpacityRange.y;\n  float N = L + vExtrusionOpacity * (M - L);\n  N = clamp(N, .0, 1.);\n  glFragColor *= N;\n#endif\n#ifdef HAS_HEATMAP\nglFragColor = heatmap_getColor(glFragColor);\n#endif\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}", Jt = "attribute vec3 aPosition;\n#include <line_extrusion_vert>\n#ifdef HAS_MAP\nuniform vec2 uvScale;\nuniform vec2 uvOffset;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n#endif\n#if defined(HAS_COLOR)\nattribute vec4 aColor;\nvarying vec4 vColor;\n#elif defined(HAS_COLOR0)\nattribute vec4 aColor0;\nvarying vec4 vColor;\n#endif\n#if defined(HAS_TANGENT)\nattribute vec4 aTangent;\n#elif defined(HAS_NORMAL)\nattribute vec3 aNormal;\n#endif\nvarying vec3 vFragPos;\nvarying vec3 vNormal;\nuniform mat4 projMatrix;\nuniform mat4 viewModelMatrix;\nuniform mat3 modelNormalMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\nuniform vec2 halton;\nuniform vec2 outSize;\nuniform mat4 projViewMatrix;\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#include <heatmap_render_vert>\n#include <fog_render_vert>\n#ifdef HAS_FLOODANALYSE\nvarying float vHeight;\n#endif\n#ifdef HAS_EXTRUSION_OPACITY\nattribute float aExtrusionOpacity;\nvarying float vExtrusionOpacity;\n#endif\n#if defined(HAS_TANGENT)\nvarying vec4 vTangent;\n#endif\nvoid c(const highp vec4 q, out highp vec3 d) {\n  d = vec3(.0, .0, 1.) + vec3(2., -2., -2.) * q.x * q.zwx + vec3(2., 2., -2.) * q.y * q.wzy;\n}\nvoid c(const highp vec4 q, out highp vec3 d, out highp vec3 t) {\n  c(q, d);\n  t = vec3(1., .0, .0) + vec3(-2., 2., -2.) * q.y * q.yxw + vec3(-2., 2., 2.) * q.z * q.zwx;\n}\nvoid main() {\n  \n#ifdef IS_LINE_EXTRUSION\nvec4 e = getPosition(getLineExtrudePosition(aPosition));\n#else\nvec4 e = getPosition(aPosition);\n#endif\nmat4 f = getPositionMatrix();\n  vFragPos = vec3(modelMatrix * f * e);\n#if defined(HAS_NORMAL) || defined(HAS_TANGENT)\nmat3 h = modelNormalMatrix * mat3(f);\n  vec3 i;\n#if defined(HAS_TANGENT)\nvec3 t;\n  c(aTangent, i, t);\n  vTangent = vec4(h * t, aTangent.w);\n#else\ni = aNormal;\n#endif\nvec3 j = appendMorphNormal(i);\n  vNormal = normalize(h * j);\n#else\nvNormal = vec3(.0);\n#endif\nmat4 k = projMatrix;\n  k[2].xy += halton.xy / outSize.xy;\n  gl_Position = k * viewModelMatrix * f * e;\n#ifdef HAS_MAP\nvTexCoord = aTexCoord * uvScale + uvOffset;\n#endif\n#ifdef HAS_EXTRUSION_OPACITY\nvExtrusionOpacity = aExtrusionOpacity;\n#endif\n#if defined(HAS_COLOR)\nvColor = aColor / 255.;\n#elif defined(HAS_COLOR0)\nvColor = aColor0 / 255.;\n#endif\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * f * e);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * f * e);\n#endif\n#ifdef HAS_HEATMAP\nheatmap_compute(projMatrix * viewModelMatrix * f, e);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * f * e);\n#endif\n}";

	class Zt extends Wt {
	    constructor(e = {}) {
	        const t = [], n = [];
	        super({
	            vert: Jt,
	            frag: Yt,
	            uniforms: [ {
	                name: "modelNormalMatrix",
	                type: "function",
	                fn: function(e, n) {
	                    return fromMat4$1(t, n.modelMatrix);
	                }
	            }, {
	                name: "viewModelMatrix",
	                type: "function",
	                fn: function(e, t) {
	                    return multiply$5(n, t.viewMatrix, t.modelMatrix);
	                }
	            } ],
	            defines: e.defines || {},
	            extraCommandProps: e.extraCommandProps || {}
	        });
	    }
	    getGeometryDefines(e) {
	        const t = {};
	        return e.data[e.desc.tangentAttribute] ? t.HAS_TANGENT = 1 : e.data[e.desc.normalAttribute] && (t.HAS_NORMAL = 1), 
	        t;
	    }
	}

	class Qt extends Wt {
	    constructor(e = {}) {
	        const t = [];
	        super({
	            vert: "attribute vec3 aPosition;\n#ifdef HAS_COLOR0\nattribute vec4 aColor0;\nvarying vec4 vColor;\n#endif\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\nuniform mat4 projViewModelMatrix;\nuniform float pointSize;\n#if defined(HAS_MAP)\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\n#endif\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#include <heatmap_render_vert>\n#include <fog_render_vert>\n#ifdef HAS_FLOODANALYSE\nvarying float vHeight;\n#endif\nvoid main() {\n  vec4 c = getPosition(aPosition);\n  mat4 d = getPositionMatrix();\n  gl_PointSize = pointSize;\n  gl_Position = projViewModelMatrix * d * c;\n#ifdef HAS_COLOR0\nvColor = aColor0 / 255.;\n#endif\n#ifdef HAS_MAP\nvTexCoord = aTexCoord;\n#endif\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * d * c);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * d * c);\n#endif\n#ifdef HAS_HEATMAP\nheatmap_compute(projMatrix * viewModelMatrix * d, c);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * d * c);\n#endif\n}",
	            frag: "precision mediump float;\n#include <gl2_frag>\n#if defined(HAS_COLOR0)\nvarying vec4 vColor;\n#endif\n#include <viewshed_frag>\n#include <flood_frag>\n#include <heatmap_render_frag>\n#include <fog_render_frag>\nuniform vec4 baseColorFactor;\n#if defined(HAS_MAP)\n#if defined(HAS_ALBEDO_MAP)\nuniform sampler2D baseColorTexture;\n#endif\n#if defined(HAS_DIFFUSE_MAP)\nuniform sampler2D diffuseTexture;\n#endif\nvarying vec2 vTexCoord;\n#endif\nvoid main() {\n  \n#ifdef HAS_COLOR0\nglFragColor = vColor * baseColorFactor;\n#else\nglFragColor = vec4(1.) * baseColorFactor;\n#endif\n#ifdef HAS_MAP\n#ifdef HAS_ALBEDO_MAP\nglFragColor *= texture2D(baseColorTexture, vTexCoord);\n#endif\n#ifdef HAS_DIFFUSE_MAP\nglFragColor *= texture2D(diffuseTexture, vTexCoord);\n#endif\n#endif\n#ifdef HAS_HEATMAP\nglFragColor = heatmap_getColor(glFragColor);\n#endif\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
	            uniforms: [ {
	                name: "projViewModelMatrix",
	                type: "function",
	                fn: (e, n) => multiply$5(t, n.projViewMatrix, n.modelMatrix)
	            } ],
	            defines: e.defines || {},
	            extraCommandProps: e.extraCommandProps || {}
	        });
	    }
	}

	class $t extends Zt {
	    constructor(e = {}) {
	        super({
	            vert: Jt,
	            frag: Yt,
	            defines: e.defines || {},
	            extraCommandProps: e.extraCommandProps || {}
	        });
	    }
	}

	var en = "#if __VERSION__ == 300\n#define attribute in\n#define varying out\n#endif\nattribute vec2 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = vec4(aPosition, 0., 1.);\n  vTexCoord = aTexCoord;\n}";

	const tn = new Int8Array([ -1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1 ]), nn = new Uint8Array([ 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0 ]);

	class rn extends Wt {
	    constructor(e) {
	        e.vert = e.vert || en, e.extraCommandProps = e.extraCommandProps || {}, e.extraCommandProps.depth || (e.extraCommandProps.depth = {
	            enable: !1,
	            mask: !1
	        }), e.extraCommandProps.stencil || (e.extraCommandProps.stencil = {
	            enable: !1
	        }), super(e);
	    }
	    draw(e) {
	        return this._quadMesh || this._createQuadMesh(e), super.draw(e, this._quadMesh);
	    }
	    getMeshCommand(e) {
	        const t = this.dkey || "";
	        return this.commands[t + "_quad"] || (this.commands[t + "_quad"] = this.createREGLCommand(e, null, this._quadMesh[0].getElements())), 
	        this.commands[t + "_quad"];
	    }
	    _createQuadMesh(e) {
	        const t = new ke({
	            aPosition: tn,
	            aTexCoord: nn
	        }, null, tn.length / 2, {
	            positionSize: 2,
	            primitive: "triangles"
	        });
	        t.generateBuffers(e), this._quadMesh = [ new et$1(t) ];
	    }
	    dispose() {
	        if (this._quadMesh) {
	            const e = this._quadMesh[0];
	            e.geometry.dispose(), e.dispose();
	        }
	        return delete this._quadMesh, super.dispose();
	    }
	}

	class on extends rn {
	    constructor() {
	        super({
	            vert: en,
	            frag: "#define SHADER_NAME FXAA\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\nprecision mediump float;\nvarying vec2 vTexCoord;\nuniform float enableFXAA;\nuniform float enableToneMapping;\nuniform float enableSharpen;\nuniform vec2 resolution;\nuniform sampler2D textureSource;\n#ifdef HAS_NOAA_TEX\nuniform sampler2D noAaTextureSource;\n#endif\n#ifdef HAS_POINT_TEX\nuniform sampler2D pointTextureSource;\n#endif\n#ifdef HAS_TAA_TEX\nuniform sampler2D taaTextureSource;\n#ifdef HAS_FXAA_TEX\nuniform sampler2D fxaaTextureSource;\n#endif\n#endif\nuniform float pixelRatio;\nuniform float sharpFactor;\n#ifdef HAS_OUTLINE_TEX\nuniform sampler2D textureOutline;\nuniform float enableOutline;\nuniform float highlightFactor;\nuniform float outlineFactor;\nuniform float outlineWidth;\nuniform vec3 outlineColor;\n#endif\nvec2 c;\nvec4 d(vec2 e) {\n  \n#ifdef HAS_TAA_TEX\nvec4 f = texture2D(textureSource, e);\n  vec4 taa = texture2D(taaTextureSource, e);\n#ifdef HAS_FXAA_TEX\nvec4 h = texture2D(fxaaTextureSource, e);\n#else\nvec4 h = vec4(.0);\n#endif\nvec4 i = taa + f * (1. - taa.a);\n  return h + i * (1. - h.a);\n#else\nreturn texture2D(textureSource, e);\n#endif\n}\nvec4 j(vec2 k) {\n  vec4 l;\n  mediump vec2 m = vec2(1. / resolution.x, 1. / resolution.y);\n  vec3 n = d((k + vec2(-1., -1.)) * m).xyz;\n  vec3 o = d((k + vec2(1., -1.)) * m).xyz;\n  vec3 u = d((k + vec2(-1., 1.)) * m).xyz;\n  vec3 v = d((k + vec2(1.)) * m).xyz;\n  vec4 A = d(k * m);\n  vec3 B = A.xyz;\n  vec3 C = vec3(.299, .587, .114);\n  float D = dot(n, C);\n  float E = dot(o, C);\n  float F = dot(u, C);\n  float G = dot(v, C);\n  float H = dot(B, C);\n  float I = min(H, min(min(D, E), min(F, G)));\n  float J = max(H, max(max(D, E), max(F, G)));\n  mediump vec2 K;\n  K.x = -((D + E) - (F + G));\n  K.y = (D + F) - (E + G);\n  float L = max((D + E + F + G) * (.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n  float M = 1. / (min(abs(K.x), abs(K.y)) + L);\n  K = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), K * M)) * m;\n  vec4 N = .5 * (d(k * m + K * (1. / 3. - .5)) + d(k * m + K * (2. / 3. - .5)));\n  vec4 O = N * .5 + .25 * (d(k * m + K * -.5) + d(k * m + K * .5));\n  float P = dot(O.xyz, C);\n  if(P < I || P > J)\n    l = N;\n  else\n    l = O;\n  return l;\n}\nvec3 Q(const in vec3 l, const float R) {\n  vec2 S = pixelRatio / resolution.xy;\n  float T = .0;\n  vec4 n = texture2D(textureSource, c + S * vec2(-1., -1.));\n  n.rgb = mix(vec3(.0), n.rgb, sign(n.a));\n  T += mix(.0, 1., sign(n.a));\n  vec4 v = texture2D(textureSource, c + S * vec2(1.));\n  v.rgb = mix(vec3(.0), v.rgb, sign(v.a));\n  T += mix(.0, 1., sign(v.a));\n  vec4 o = texture2D(textureSource, c + S * vec2(1., -1.));\n  o.rgb = mix(vec3(.0), o.rgb, sign(o.a));\n  T += mix(.0, 1., sign(o.a));\n  vec4 u = texture2D(textureSource, c + S * vec2(-1., 1.));\n  u.rgb = mix(vec3(.0), u.rgb, sign(u.a));\n  T += mix(.0, 1., sign(u.a));\n  return l + R * (T * l - n.rgb - o.rgb - u.rgb - v.rgb);\n}\nvec4 U(const in vec4 l) {\n  return vec4(Q(l.rgb, sharpFactor), l.a);\n}\nvec3 V(const vec3 x) {\n  const float a = 2.51;\n  const float b = .03;\n  const float W = 2.43;\n  const float X = .59;\n  const float Y = .14;\n  return (x * (a * x + b)) / (x * (W * x + X) + Y);\n}\nvec3 Z(vec3 l) {\n  l = l / (l + vec3(1.));\n  return l = pow(l, vec3(1. / 2.2));\n}\n#ifdef HAS_OUTLINE_TEX\nvec4 ba() {\n  float bb = 2.;\n  float bc = 1.;\n  float bd = pixelRatio / resolution[0] * outlineWidth;\n  float be = pixelRatio / resolution[1] * outlineWidth;\n  vec4 bf = (texture2D(textureOutline, c + vec2(bd, be)));\n  vec4 bg = (texture2D(textureOutline, c + vec2(bd, .0)));\n  vec4 bh = (texture2D(textureOutline, c + vec2(bd, -be)));\n  vec4 bi = (texture2D(textureOutline, c + vec2(.0, -be)));\n  vec4 bj = (texture2D(textureOutline, c + vec2(-bd, -be)));\n  vec4 bk = (texture2D(textureOutline, c + vec2(-bd, .0)));\n  vec4 bl = (texture2D(textureOutline, c + vec2(-bd, be)));\n  vec4 bm = (texture2D(textureOutline, c + vec2(.0, be)));\n  vec4 bn = -bb * bk + bb * bg + -bc * bl + bc * bf + -bc * bj + bc * bh;\n  vec4 bo = -bb * bi + bb * bm + -bc * bj + bc * bl + -bc * bh + bc * bf;\n  float bp = sqrt(dot(bo, bo) + dot(bn, bn));\n  bool bq = bp < 1. / 65025.;\n  vec3 br = (texture2D(textureOutline, c)).r * outlineColor;\n  if(br == vec3(.0) || (highlightFactor == .0 && bq)) {\n    return vec4(.0);\n  }\n  float bs = bq ? highlightFactor : min(1., sqrt(bp) * outlineFactor);\n  return bs * vec4(br, 1.);\n}\nvec4 bt(const in vec4 l) {\n  vec4 ba = ba();\n  return ba + vec4(l) * (1. - ba.a);\n}\n#endif\nvoid main() {\n  c = vTexCoord;\n  vec4 l;\n  if(enableFXAA == 1.) {\n    l = j(c * resolution);\n  } else {\n    l = d(vTexCoord);\n  }\n  if(enableSharpen == 1.) {\n    l = U(l);\n  }\n#if defined(HAS_NOAA_TEX) || defined(HAS_POINT_TEX)\nvec4 bu = vec4(.0);\n  vec4 bv = vec4(.0);\n#ifdef HAS_POINT_TEX\nbu = texture2D(pointTextureSource, vTexCoord);\n#endif\n#ifdef HAS_NOAA_TEX\nbv = texture2D(noAaTextureSource, vTexCoord);\n#endif\nvec4 bw = bu + bv * (1. - bu.a);\n  l = bw + l * (1. - bw.a);\n#endif\nif(enableToneMapping == 1.) {\n    l.rgb = Z(l.rgb);\n  }\n#ifdef HAS_OUTLINE_TEX\nl = bt(l);\n#endif\ngl_FragColor = l;\n}",
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.resolution[0],
	                    height: (e, t) => t.resolution[1]
	                }
	            }
	        });
	    }
	    getMeshCommand(e, t) {
	        const n = this.dkey || "";
	        return this.commands[n + "_fxaa"] || (this.commands[n + "_fxaa"] = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands[n + "_fxaa"];
	    }
	}

	class sn extends rn {
	    constructor({blurOffset: e}) {
	        super({
	            vert: en,
	            frag: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D textureSource;\nuniform vec2 resolution;\nuniform float ignoreTransparent;\nvoid main() {\n  vec4 c = vec4(.0);\n  float d = .0;\n  for(int x = -BOXBLUR_OFFSET; x <= BOXBLUR_OFFSET; ++x)\n    for(int y = -BOXBLUR_OFFSET; y <= BOXBLUR_OFFSET; ++y) {\n      vec2 e = vTexCoord.st + vec2(float(x) / resolution.x, float(y) / resolution.y);\n      e = clamp(e, .0, 1.);\n      vec4 f = texture2D(textureSource, e);\n      float h;\n      if(ignoreTransparent == 1.) {\n        h = sign(f.a);\n      } else {\n        h = 1.;\n      }\n      d += h;\n      c += h * f;\n    }\n  gl_FragColor = c / max(d, 1.) * clamp(sign(d - 1.), .0, 1.);\n}",
	            defines: {
	                BOXBLUR_OFFSET: e || 2
	            },
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.resolution[0],
	                    height: (e, t) => t.resolution[1]
	                }
	            }
	        }), this._blurOffset = e || 2;
	    }
	    getMeshCommand(e, t) {
	        const n = "box_blur_" + this._blurOffset;
	        return this.commands[n] || (this.commands[n] = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands[n];
	    }
	}

	class an extends rn {
	    constructor() {
	        super({
	            vert: en,
	            frag: "precision mediump float;\n#define SHADER_NAME SSAO_BLUR\nstruct MaterialParams {\n  float farPlaneOverEdgeDistance;\n  vec2 axis;\n  vec2 resolution;\n};\nuniform sampler2D materialParams_ssao;\nuniform sampler2D TextureInput;\nuniform MaterialParams materialParams;\nvarying vec2 vTexCoord;\nconst int c = 6;\nfloat d[8];\nvoid e() {\n  d[0] = .099736;\n  d[1] = .096667;\n  d[2] = .088016;\n  d[3] = .075284;\n  d[4] = .060493;\n  d[5] = .045662;\n}\nfloat f(vec2 h) {\n  return (h.x * (256. / 257.) + h.y * (1. / 257.));\n}\nvoid tap(inout float i, inout float j, float k, float h, vec2 l) {\n  vec3 m = texture2D(materialParams_ssao, l).rgb;\n  float n = k;\n  i += m.r * n;\n  j += n;\n}\nvoid main() {\n  e();\n  highp vec2 o = vTexCoord;\n  vec3 m = texture2D(materialParams_ssao, o).rgb;\n  if(m.g * m.b == 1.) {\n    if(materialParams.axis.y > .0) {\n      vec4 u = texture2D(TextureInput, o);\n      gl_FragColor = u;\n    } else {\n      gl_FragColor = vec4(m, 1.);\n    }\n    return;\n  }\n  float h = f(m.gb);\n  float j = d[0];\n  float i = m.r * j;\n  vec2 v = materialParams.axis / materialParams.resolution;\n  vec2 A = v;\n  for(int B = 1; B < c; B++) {\n    float k = d[B];\n    tap(i, j, k, h, o + A);\n    tap(i, j, k, h, o - A);\n    A += v;\n  }\n  float C = i * (1. / j);\n  vec2 gb = m.gb;\n  if(materialParams.axis.y > .0) {\n    vec4 u = texture2D(TextureInput, o);\n    gl_FragColor = vec4(u.rgb * C, u.a);\n  } else {\n    gl_FragColor = vec4(C, gb, 1.);\n  }\n}",
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.outputSize[0],
	                    height: (e, t) => t.outputSize[1]
	                }
	            }
	        });
	    }
	    getMeshCommand(e, t) {
	        return this.commands.ssao_blur || (this.commands.ssao_blur = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.ssao_blur;
	    }
	}

	const cn = [ -2e-6, 0, 2e-6, -.095089, .004589, -.031253, .01518, -.025586, .003765, .073426, .021802, .002778, .094587, .043218, .089148, -.009509, .051369, .019673, .139973, -.101685, .10857, -.103804, .219853, -.043016, .004841, -.033988, .094187, .028011, .058466, -.25711, -.051031, .074993, .259843, .118822, -.186537, -.134192, .063949, -.094894, -.072683, .108176, .327108, -.254058, -.04718, .21918, .263895, -.407709, .240834, -.200352 ];

	class ln extends rn {
	    constructor() {
	        super({
	            vert: en,
	            frag: "#if __VERSION__ == 100\n#if defined(GL_OES_standard_derivatives)\n#extension GL_OES_standard_derivatives : enable\n#endif\n#endif\nprecision highp float;\n#include <gl2_frag>\nvarying vec2 vTexCoord;\n#define saturate(x)        clamp(x, 0.0, 1.0)\n#define SHADER_NAME SSAO_EXTRACT\n#define PI 3.14159265359\nconst float c = .0625;\nstruct MaterialParams {\n  mat4 projMatrix;\n  mat4 invProjMatrix;\n  vec4 resolution;\n  float radius;\n  float bias;\n  float power;\n  vec2 cameraNearFar;\n};\nuniform MaterialParams materialParams;\nuniform sampler2D materialParams_depth;\n#define NOISE_NONE      0\n#define NOISE_PATTERN   1\n#define NOISE_RANDOM    2\n#define NOISE_TYPE      NOISE_PATTERN\nconst int d = 16;\nuniform vec3 kSphereSamples[16];\nvec3 e(const int x) {\n  if(x == 0) {\n    return vec3(-.078247, -.749924, -.656880);\n  } else if(x == 1) {\n    return vec3(-.572319, -.102379, -.813615);\n  } else if(x == 2) {\n    return vec3(.048653, -.380791, .923380);\n  } else if(x == 3) {\n    return vec3(.281202, -.656664, -.699799);\n  } else if(x == 4) {\n    return vec3(.711911, -.235841, -.661485);\n  } else if(x == 5) {\n    return vec3(-.445893, .611063, .654050);\n  } else if(x == 6) {\n    return vec3(-.703598, .674837, .222587);\n  } else if(x == 7) {\n    return vec3(.768236, .507457, .390257);\n  } else if(x == 8) {\n    return vec3(-.670286, -.470387, .573980);\n  } else if(x == 9) {\n    return vec3(.199235, .849336, -.488808);\n  } else if(x == 10) {\n    return vec3(-.768068, -.583633, -.263520);\n  } else if(x == 11) {\n    return vec3(-.897330, .328853, .294372);\n  } else if(x == 12) {\n    return vec3(-.570930, -.531056, -.626114);\n  } else if(x == 13) {\n    return vec3(.699014, .063283, -.712303);\n  } else if(x == 14) {\n    return vec3(.207495, .976129, -.064172);\n  } else if(x == 15) {\n    return vec3(-.060901, -.869738, -.489742);\n  } else {\n    return vec3(.0);\n  }\n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n}\nvec2 f(highp float h) {\n  highp float z = clamp(h * 1. / -materialParams.cameraNearFar.y, .0, 1.);\n  highp float t = floor(256. * z);\n  mediump float i = t * (1. / 256.);\n  mediump float j = 256. * z - t;\n  return vec2(i, j);\n}\nfloat k(highp vec2 l) {\n  l = fract(l * vec2(5.3987, 5.4421));\n  l += dot(l.yx, l.xy + vec2(21.5351, 14.3137));\n  highp float xy = l.x * l.y;\n  return fract(xy * 95.4307) + fract(xy * 75.04961) * .5;\n}\nvec3 m(const vec2 o) {\n  \n#if NOISE_TYPE == NOISE_RANDOM\nreturn normalize(2. * vec3(k(o), k(o * 2.), k(o * 4.)) - vec3(1.));\n#elif NOISE_TYPE == NOISE_PATTERN\nvec2 xy = floor(gl_FragCoord.xy);\n  float u = mod(xy.x, 4.);\n  float v = mod(xy.y, 4.);\n  return e(int(u + v * 4.));\n#else\nreturn vec3(.0);\n#endif\n}\nhighp mat4 A() {\n  return materialParams.projMatrix;\n}\nhighp mat4 B() {\n  return materialParams.invProjMatrix;\n}\nhighp float C(const vec2 o) {\n  return texture2D(materialParams_depth, o).r;\n}\nhighp float D(highp float h) {\n  highp mat4 E = A();\n  highp float z = h * 2. - 1.;\n  return -E[3].z / (z + E[2].z);\n}\nhighp float F(const vec2 o) {\n  return D(texture2D(materialParams_depth, o).r);\n}\nhighp vec3 G(in vec2 p, highp float H) {\n  p = p * 2. - 1.;\n  highp mat4 I = B();\n  p.x *= I[0].x;\n  p.y *= I[1].y;\n  return vec3(p * -H, H);\n}\nhighp vec3 J(const highp vec3 K) {\n  highp vec3 L = dFdx(K);\n  highp vec3 M = dFdy(K);\n  return cross(L, M);\n}\nhighp vec3 J(const highp vec3 K, const vec2 o) {\n  vec2 N = o + vec2(materialParams.resolution.z, .0);\n  vec2 O = o + vec2(.0, materialParams.resolution.w);\n  highp vec3 px = G(N, F(N));\n  highp vec3 py = G(O, F(O));\n  highp vec3 L = px - K;\n  highp vec3 M = py - K;\n  return cross(L, M);\n}\nfloat P(const highp vec3 Q, const highp float R, mat3 S, const vec3 T, const vec3 U) {\n  highp mat4 E = A();\n  float V = materialParams.radius;\n  float W = materialParams.bias;\n  highp vec3 X = S * U;\n  float Y = dot(X, T);\n  X = sign(Y) * X;\n  X = Q + X * V;\n  highp vec4 Z = E * vec4(X, 1.);\n  Z.xy = Z.xy * (.5 / Z.w) + .5;\n  highp float ba = C(Z.xy);\n  ba = D(ba);\n  float t = saturate(V / abs(R - ba));\n  float bb = t * t * (3. - 2. * t);\n  return (ba >= X.z + W ? bb : .0);\n}\nvoid main() {\n  highp vec2 o = vTexCoord;\n  highp float h = C(o);\n  highp float bc = D(h);\n  highp vec3 Q = G(o, bc);\n  highp vec3 T = J(Q, o);\n  T = normalize(T);\n  vec3 bd = m(o);\n  vec3 be = bd.xyz;\n  vec3 bf = normalize(be - T * dot(be, T));\n  vec3 bg = cross(T, bf);\n  mat3 S = mat3(bf, bg, T);\n  float bh = .0;\n  for(int bi = 0; bi < d; bi++) {\n    bh += P(Q, bc, S, T, kSphereSamples[bi]);\n  }\n  float bj = 1. - bh / float(d);\n  bj = mix(bj, bj * bj, materialParams.power);\n  glFragColor = vec4(bj, f(Q.z), 1.);\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
	            uniforms: [ {
	                name: "kSphereSamples",
	                type: "function",
	                fn: function() {
	                    return cn;
	                }
	            } ],
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.outputSize[0],
	                    height: (e, t) => t.outputSize[1]
	                }
	            }
	        }), this.version = 300;
	    }
	    getMeshCommand(e, t) {
	        return this.commands.ssao_extract || (this.commands.ssao_extract = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.ssao_extract;
	    }
	}

	const fn = [];

	class un {
	    constructor(e) {
	        this._renderer = e;
	    }
	    render(e, t, n) {
	        const {width: r, height: i} = n;
	        return this._initShaders(), this._extractFBO || this._createTextures(n), this._extract(e, r, i, n), 
	        this._blurAndCombine(t, e.cameraFar, r, i);
	    }
	    _blurAndCombine(e, t, n, r) {
	        const i = Math.floor(n / 2), o = Math.floor(r / 2);
	        this._blurHTex.width === i && this._blurHTex.height === o || (this._blurHFBO.resize(i, o), 
	        this._blurVFBO.resize(n, r));
	        const s = [ n, r ], a = [ 1, 0 ];
	        return this._renderer.render(this._ssaoBlurShader, {
	            TextureInput: e,
	            materialParams_ssao: this._extractTex,
	            materialParams: {
	                axis: a,
	                farPlaneOverEdgeDistance: -t / .0625,
	                resolution: s
	            },
	            outputSize: [ i, o ]
	        }, null, this._blurHFBO), a[0] = 0, a[1] = 1, this._renderer.render(this._ssaoBlurShader, {
	            TextureInput: e,
	            materialParams_ssao: this._blurHTex,
	            materialParams: {
	                axis: a,
	                farPlaneOverEdgeDistance: -t / .0625,
	                resolution: s
	            },
	            outputSize: [ n, r ]
	        }, null, this._blurVFBO), this._blurVTex;
	    }
	    _extract(e, t, n, i) {
	        const o = Math.floor(t / 2), s = Math.floor(n / 2);
	        this._extractFBO.width === o && this._extractFBO.height === s || this._extractFBO.resize(o, s);
	        const {projMatrix: a} = e, c = invert$2(fn, a);
	        this._renderer.render(this._ssaoExtractShader, {
	            materialParams_depth: i,
	            materialParams: {
	                projMatrix: a,
	                invProjMatrix: c,
	                resolution: [ o, s, 1 / o, 1 / s ],
	                radius: e.radius,
	                bias: e.bias,
	                power: e.power || 1,
	                cameraNearFar: [ e.cameraNear, e.cameraFar ]
	            },
	            outputSize: [ o, s ]
	        }, null, this._extractFBO);
	    }
	    _createTextures(e) {
	        const t = Math.floor(e.width / 2), n = Math.floor(e.height / 2);
	        this._extractTex = this._createTex(t, n, "uint8"), this._extractFBO = this._createFBO(this._extractTex), 
	        this._blurHTex = this._createTex(t, n, "uint8"), this._blurHFBO = this._createFBO(this._blurHTex), 
	        this._blurVTex = this._createTex(e.width, e.height, "uint8"), this._blurVFBO = this._createFBO(this._blurVTex);
	    }
	    _createTex(e, t, n) {
	        return this._renderer.regl.texture({
	            min: "linear",
	            mag: "linear",
	            wrap: "clamp",
	            type: n,
	            width: e,
	            height: t
	        });
	    }
	    _createFBO(e) {
	        return this._renderer.regl.framebuffer({
	            width: e.width,
	            height: e.height,
	            colors: [ e ],
	            depth: !1,
	            stencil: !1
	        });
	    }
	    dispose() {
	        this._extractFBO && (this._extractFBO.destroy(), delete this._extractFBO, this._blurVFBO.destroy(), 
	        this._blurHFBO.destroy(), this._ssaoExtractShader.dispose(), this._ssaoBlurShader.dispose(), 
	        delete this._ssaoExtractShader);
	    }
	    _initShaders() {
	        this._ssaoExtractShader || (this._ssaoExtractShader = new ln, this._ssaoBlurShader = new an);
	    }
	}

	class hn extends rn {
	    constructor() {
	        super({
	            vert: en,
	            frag: "precision mediump float;\nvarying vec2 vTexCoord;\nuniform vec2 resolution;\nuniform sampler2D textureSource;\nuniform float enableVignette;\nuniform float enableGrain;\nuniform float enableLut;\nuniform float timeGrain;\nuniform float grainFactor;\nuniform vec2 lensRadius;\nuniform float frameMod;\nuniform sampler2D lookupTable;\nfloat c(const in vec2 d) {\n  vec3 e = fract(vec3(d.xyx) * .1031);\n  e += dot(e, e.yzx + 19.19);\n  return fract((e.x + e.y) * e.z);\n}\nfloat f() {\n  float h = c(gl_FragCoord.xy + 1000.0 * fract(timeGrain));\n  float i = h * 2. - 1.;\n  h = i * inversesqrt(abs(i));\n  h = max(-1., h);\n  h = h - sign(i) + .5;\n  return (h + .5) * .5;\n}\nvec4 j(const in vec4 k) {\n  float l = f();\n  return vec4(mix(k.rgb, k.rgb * (k.rgb + (1. - k.rgb) * 2. * l), grainFactor), k.a);\n}\nfloat m(const in float k) {\n  return k < .0031308 ? k * 12.92 : 1.055 * pow(k, 1. / 2.4) - .055;\n}\nvec3 m(const in vec3 k) {\n  return vec3(k.r < .0031308 ? k.r * 12.92 : 1.055 * pow(k.r, 1. / 2.4) - .055, k.g < .0031308 ? k.g * 12.92 : 1.055 * pow(k.g, 1. / 2.4) - .055, k.b < .0031308 ? k.b * 12.92 : 1.055 * pow(k.b, 1. / 2.4) - .055);\n}\nvec4 m(const in vec4 k) {\n  return vec4(k.r < .0031308 ? k.r * 12.92 : 1.055 * pow(k.r, 1. / 2.4) - .055, k.g < .0031308 ? k.g * 12.92 : 1.055 * pow(k.g, 1. / 2.4) - .055, k.b < .0031308 ? k.b * 12.92 : 1.055 * pow(k.b, 1. / 2.4) - .055, k.a);\n}\nfloat n(const in float k) {\n  return k < .04045 ? k * (1. / 12.92) : pow((k + .055) * (1. / 1.055), 2.4);\n}\nvec3 n(const in vec3 k) {\n  return vec3(k.r < .04045 ? k.r * (1. / 12.92) : pow((k.r + .055) * (1. / 1.055), 2.4), k.g < .04045 ? k.g * (1. / 12.92) : pow((k.g + .055) * (1. / 1.055), 2.4), k.b < .04045 ? k.b * (1. / 12.92) : pow((k.b + .055) * (1. / 1.055), 2.4));\n}\nvec4 n(const in vec4 k) {\n  return vec4(k.r < .04045 ? k.r * (1. / 12.92) : pow((k.r + .055) * (1. / 1.055), 2.4), k.g < .04045 ? k.g * (1. / 12.92) : pow((k.g + .055) * (1. / 1.055), 2.4), k.b < .04045 ? k.b * (1. / 12.92) : pow((k.b + .055) * (1. / 1.055), 2.4), k.a);\n}\nfloat o(const in vec2 d, const in float u) {\n  vec3 v = vec3(.06711056, .00583715, 52.9829189);\n  return fract(v.z * fract(dot(d.xy + u * vec2(47., 17.) * .695, v.xy)));\n}\nfloat A() {\n  vec2 B = lensRadius;\n  B.y = min(B.y, B.x - 1e-4);\n  float C = o(gl_FragCoord.xy, frameMod);\n  C = (B.x - B.y) * (B.x + B.y) * .07 * (C - .5);\n  return smoothstep(B.x, B.y, C + distance(vTexCoord, vec2(.5)));\n}\nvec4 D(const in vec4 k) {\n  float l = A();\n  return vec4(m(n(k.rgb) * l), clamp(k.a + (1. - l), .0, 1.));\n}\nvec4 E(in vec4 F, in sampler2D G) {\n  mediump float H = F.b * 63.;\n  mediump vec2 I;\n  I.y = floor(floor(H) / 8.);\n  I.x = floor(H) - I.y * 8.;\n  mediump vec2 J;\n  J.y = floor(ceil(H) / 8.);\n  J.x = ceil(H) - J.y * 8.;\n  highp vec2 K;\n  K.x = I.x * .125 + .5 / 512. + (.125 - 1. / 512.) * F.r;\n  K.y = I.y * .125 + .5 / 512. + (.125 - 1. / 512.) * F.g;\n#ifdef LUT_FLIP_Y\nK.y = 1. - K.y;\n#endif\nhighp vec2 L;\n  L.x = J.x * .125 + .5 / 512. + (.125 - 1. / 512.) * F.r;\n  L.y = J.y * .125 + .5 / 512. + (.125 - 1. / 512.) * F.g;\n#ifdef LUT_FLIP_Y\nL.y = 1. - L.y;\n#endif\nlowp vec4 M = texture2D(G, K);\n  lowp vec4 N = texture2D(G, L);\n  lowp vec4 O = mix(M, N, fract(H));\n  return O;\n}\nvoid main() {\n  vec4 k = texture2D(textureSource, vTexCoord);\n  if(enableLut == 1.) {\n    k = E(k, lookupTable);\n  }\n  if(enableVignette == 1.) {\n    k = D(k);\n  }\n  if(enableGrain == 1.) {\n    k = j(k);\n  }\n  gl_FragColor = k;\n}",
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.resolution[0],
	                    height: (e, t) => t.resolution[1]
	                }
	            }
	        });
	    }
	    getMeshCommand(e, t) {
	        return this.commands.postprocess || (this.commands.postprocess = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.postprocess;
	    }
	}

	class dn extends rn {
	    constructor() {
	        super({
	            vert: en,
	            frag: "#define SHADER_NAME TAA\nprecision mediump float;\n#define saturate(x)        clamp(x, 0.0, 1.0)\n#if defined(TARGET_METAL_ENVIRONMENT) || defined(TARGET_VULKAN_ENVIRONMENT)\n#define TEXTURE_SPACE_UP    -1\n#define TEXTURE_SPACE_DN     1\n#else\n#define TEXTURE_SPACE_UP     1\n#define TEXTURE_SPACE_DN    -1\n#endif\n#define BOX_TYPE_AABB           0\n#define BOX_TYPE_VARIANCE       1\n#define BOX_TYPE_AABB_VARIANCE  2\n#define VARIANCE_GAMMA          1.0\n#define BOX_CLIPPING_ACCURATE   0\n#define BOX_CLIPPING_CLAMP      1\n#define BOX_CLIPPING_NONE       2\n#if defined(TARGET_MOBILE)\n#define BOX_CLIPPING            BOX_CLIPPING_ACCURATE\n#define BOX_TYPE                BOX_TYPE_VARIANCE\n#define USE_YCoCg               0\n#define FILTER_INPUT            1\n#define FILTER_HISTORY          0\n#else\n#define BOX_CLIPPING            BOX_CLIPPING_ACCURATE\n#define BOX_TYPE                BOX_TYPE_AABB_VARIANCE\n#define USE_YCoCg               0\n#define FILTER_INPUT            0\n#define FILTER_HISTORY          0\n#endif\n#define HISTORY_REPROJECTION    1\n#define PREVENT_FLICKERING      0\nstruct MaterialParams {\n  float alpha;\n  mat4 reprojection;\n};\nuniform sampler2D materialParams_color;\nuniform sampler2D materialParams_history;\nuniform vec2 materialParams_history_size;\nuniform vec2 textureOutputSize;\nuniform sampler2D materialParams_depth;\nuniform MaterialParams materialParams;\nfloat c(const vec3 d) {\n  return dot(d, vec3(.2126, .7152, .0722));\n}\nfloat e(const vec3 f) {\n  \n#if USE_YCoCg\nreturn f.x;\n#else\nreturn c(f);\n#endif\n}\nvec3 h(const vec3 i) {\n  float j = dot(i.rgb, vec3(1, 2, 1) * .25);\n  float k = dot(i.rgb, vec3(2, 0, -2) * .25);\n  float l = dot(i.rgb, vec3(-1, 2, -1) * .25);\n  return vec3(j, k, l);\n}\nvec3 m(const vec3 i) {\n  float j = i.x;\n  float k = i.y;\n  float l = i.z;\n  float r = j + k - l;\n  float g = j + l;\n  float b = j - k - l;\n  return vec3(r, g, b);\n}\nvec4 n(const int o, const vec3 u, const vec3 v, const vec4 i, const vec4 A) {\n  const float B = .0001;\n  if(o == BOX_CLIPPING_ACCURATE) {\n    vec4 r = i - A;\n    vec3 C = 1. / (B + r.rgb);\n    vec3 D = (v - A.rgb) * C;\n    vec3 E = (u - A.rgb) * C;\n    vec3 F = min(D, E);\n    return A + r * saturate(max(max(F.x, F.y), F.z));\n  } else if(o == BOX_CLIPPING_CLAMP) {\n    return vec4(clamp(A.rgb, u, v), A.a);\n  }\n  return A;\n}\nvec4 G(const sampler2D H, const highp vec2 I, const highp vec2 J) {\n  highp vec2 K = I * J;\n  highp vec2 L = floor(K - .5) + .5;\n  highp vec2 M = K - L;\n  highp vec2 N = M * M;\n  highp vec2 O = N * M;\n  vec2 P = N - .5 * (O + M);\n  vec2 Q = 1.5 * O - 2.5 * N + 1.;\n  vec2 R = .5 * (O - N);\n  vec2 S = 1. - P - Q - R;\n  vec2 T = Q + S;\n  highp vec2 U = L - vec2(1.);\n  highp vec2 V = L + vec2(2.);\n  highp vec2 W = L + S / T;\n  highp vec2 X = 1. / J;\n  U *= X;\n  V *= X;\n  W *= X;\n  float Z = T.x * P.y;\n  float ba = P.x * T.y;\n  float bb = T.x * T.y;\n  float bc = R.x * T.y;\n  float bd = T.x * R.y;\n  vec4 be = texture2D(H, vec2(W.x, U.y)) * Z + texture2D(H, vec2(U.x, W.y)) * ba + texture2D(H, vec2(W.x, W.y)) * bb + texture2D(H, vec2(V.x, W.y)) * bc + texture2D(H, vec2(W.x, V.y)) * bd;\n  be *= 1. / (Z + ba + bb + bc + bd);\n  return be;\n}\nvec4 bf(sampler2D H, vec2 I, float bg, ivec2 bh) {\n  return texture2D(H, I + vec2(bh));\n}\nvoid main() {\n  highp vec4 I = (gl_FragCoord.xy / textureOutputSize.xy).xyxy;\n  float bi = texture2D(materialParams_depth, I.xy).r;\n#if HISTORY_REPROJECTION\n#if defined(TARGET_METAL_ENVIRONMENT) || defined(TARGET_VULKAN_ENVIRONMENT)\nI.w = 1. - I.w;\n#endif\nhighp vec4 q = materialParams.reprojection * vec4(I.zw, bi, 1.);\n  I.zw = (q.xy * (1. / q.w)) * .5 + .5;\n#if defined(TARGET_METAL_ENVIRONMENT) || defined(TARGET_VULKAN_ENVIRONMENT)\nI.w = 1. - I.w;\n#endif\n#endif\nvec4 f = bf(materialParams_color, I.xy, .0, ivec2(0));\n#if FILTER_HISTORY\nvec4 bj = G(materialParams_history, I.zw, materialParams_history_size);\n#else\nvec4 bj = texture2D(materialParams_history, I.zw);\n#endif\n#if USE_YCoCg\nbj.rgb = h(bj.rgb);\n#endif\nvec3 s[9];\n  s[0] = bf(materialParams_color, I.xy, .0, ivec2(-1, TEXTURE_SPACE_DN)).rgb;\n  s[1] = bf(materialParams_color, I.xy, .0, ivec2(0, TEXTURE_SPACE_DN)).rgb;\n  s[2] = bf(materialParams_color, I.xy, .0, ivec2(1, TEXTURE_SPACE_DN)).rgb;\n  s[3] = bf(materialParams_color, I.xy, .0, ivec2(-1, 0)).rgb;\n  s[4] = f.rgb;\n  s[5] = bf(materialParams_color, I.xy, .0, ivec2(1, 0)).rgb;\n  s[6] = bf(materialParams_color, I.xy, .0, ivec2(-1, TEXTURE_SPACE_UP)).rgb;\n  s[7] = bf(materialParams_color, I.xy, .0, ivec2(0, TEXTURE_SPACE_UP)).rgb;\n  s[8] = bf(materialParams_color, I.xy, .0, ivec2(1, TEXTURE_SPACE_UP)).rgb;\n#if USE_YCoCg\nfor(int bk = 0; bk < 9; bk++) {\n    s[bk] = h(s[bk]);\n  }\n  f.rgb = s[4].rgb;\n#endif\n#if FILTER_INPUT\n#else\nvec4 bl = f;\n#endif\n#if BOX_TYPE == BOX_TYPE_AABB || BOX_TYPE == BOX_TYPE_AABB_VARIANCE\nvec3 u = min(s[4], min(min(s[1], s[3]), min(s[5], s[7])));\n  vec3 v = max(s[4], max(max(s[1], s[3]), max(s[5], s[7])));\n  vec3 bm = min(u, min(min(s[0], s[2]), min(s[6], s[8])));\n  vec3 bn = max(v, max(max(s[0], s[2]), max(s[6], s[8])));\n  u = (u + bm) * .5;\n  v = (v + bn) * .5;\n#endif\n#if BOX_TYPE == BOX_TYPE_VARIANCE || BOX_TYPE == BOX_TYPE_AABB_VARIANCE\nvec3 bo = s[4];\n  vec3 bp = s[4] * s[4];\n  for(int bk = 1; bk < 9; bk += 2) {\n    bo += s[bk];\n    bp += s[bk] * s[bk];\n  }\n  vec3 bq = bo * (1. / 5.);\n  vec3 br = bp * (1. / 5.);\n  vec3 bs = sqrt(br - bq * bq);\n#if BOX_TYPE == BOX_TYPE_VARIANCE\nvec3 u = bq - VARIANCE_GAMMA * bs;\n  vec3 v = bq + VARIANCE_GAMMA * bs;\n#else\nu = min(u, bq - VARIANCE_GAMMA * bs);\n  v = max(v, bq + VARIANCE_GAMMA * bs);\n#endif\n#endif\nfloat bt = e(bl.rgb);\n  float bu = e(bj.rgb);\n  float bv = materialParams.alpha;\n#if PREVENT_FLICKERING\nfloat bw = 1. - abs(bt - bu) / (.001 + max(bt, bu));\n  bv *= bw * bw;\n#endif\nbl.rgb *= 1. / (1. + bt);\n  bj.rgb *= 1. / (1. + bu);\n  vec4 be = mix(bj, bl, bv);\n  be.rgb *= 1. / (1. - e(be.rgb));\n#if USE_YCoCg\nbe.rgb = m(be.rgb);\n#endif\nbe = max(vec4(0), be);\n  gl_FragColor = be;\n}",
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.materialParams_color.width,
	                    height: (e, t) => t.materialParams_color.height
	                },
	                blend: {
	                    enable: !1
	                }
	            }
	        });
	    }
	    getMeshCommand(e, t) {
	        return this.commands.taa || (this.commands.taa = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.taa;
	    }
	}

	const mn = [ 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, -2, 0, -1, -1, 1, 1 ];

	class vn {
	    constructor(e, t) {
	        this._jitter = t, this._renderer = e, this._halton = [], this._counter = 0;
	    }
	    needToRedraw() {
	        return this._counter < this._jitter.getSampleCount();
	    }
	    render(e, t, n, i) {
	        const s = this._jitter;
	        this._initShaders(), this._createTextures(e), i && (this._counter = 0), this._counter++;
	        const a = s.getSampleCount();
	        if (this._counter >= a) return this._prevTex;
	        this._fbo.width === e.width && this._fbo.height === e.height || this._fbo.resize(e.width, e.height);
	        const c = this._outputTex, l = this._prevTex, f = this._uniforms || {
	            materialParams_history_size: [ l.width, l.height ],
	            textureOutputSize: [],
	            materialParams: {
	                alpha: 1,
	                reprojection: [],
	                filterWeights: []
	            }
	        };
	        f.materialParams.alpha = 1 / this._counter;
	        const u = f.materialParams.reprojection;
	        multiply$5(u, this._prevProjMatrix || n, invert$2(u, n)), multiply$5(u, u, mn), 
	        set(f.materialParams_history_size, l.width, l.height), set(f.textureOutputSize, e.width, e.height), 
	        f.materialParams_depth = t, f.materialParams_color = e, f.materialParams_history = l, 
	        this._renderer.render(this._shader, f, null, this._fbo);
	        const h = this._outputTex, d = this._fbo;
	        return this._outputTex = this._prevTex, this._fbo = this._prevFbo, this._prevTex = h, 
	        this._prevFbo = d, this._prevProjMatrix = copy$5(this._prevProjMatrix || [], n), 
	        c;
	    }
	    dispose() {
	        this._shader && (this._shader.dispose(), delete this._shader), this._fbo && this._fbo.destroy(), 
	        this._prevFbo && this._prevFbo.destroy(), delete this._uniforms;
	    }
	    _createTextures(e) {
	        if (this._outputTex) return;
	        const t = this._renderer.regl;
	        this._outputTex = this._createColorTex(e), this._fbo = t.framebuffer({
	            width: e.width,
	            height: e.height,
	            colors: [ this._outputTex ],
	            depth: !1,
	            stencil: !1
	        }), this._prevTex = this._createColorTex(e), this._prevFbo = t.framebuffer({
	            width: e.width,
	            height: e.height,
	            colors: [ this._prevTex ],
	            depth: !1,
	            stencil: !1
	        });
	    }
	    _createColorTex(e) {
	        return this._renderer.regl.texture({
	            min: "linear",
	            mag: "linear",
	            type: "uint8",
	            width: e.width,
	            height: e.height
	        });
	    }
	    _initShaders() {
	        this._shader || (this._shader = new dn);
	    }
	}

	const gn = [ [ .263385, -.0252475 ], [ -.38545, .054485 ], [ -.139795, -.5379925 ], [ -.2793775, .6875475 ], [ .7139025, .4710925 ], [ .90044, -.16422 ], [ .4481775, -.82799 ], [ -.9253375, -.2910625 ], [ .3468025, 1.02292 ], [ -1.13742, .33522 ], [ -.7676225, -.9123175 ], [ -.2005775, -1.1774125 ], [ -.926525, .96876 ], [ 1.12909, -.7500325 ], [ .9603, 1.14625 ] ], _n = gn.length, bn = [ 0, 0 ];

	for (let e = 0; e < gn.length; e++) bn[0] += gn[e][0], bn[1] += gn[e][1];

	bn[0] /= _n, bn[1] /= _n;

	class pn {
	    constructor(e) {
	        this._frameNum = 0, this._ratio = e || .05, this._avg = [ bn[0] * this._ratio, bn[1] * this._ratio ];
	    }
	    getRatio() {
	        return this._ratio;
	    }
	    setRatio(e) {
	        this._ratio !== e && (this._ratio = e, this.reset()), this._avg = [ bn[0] * this._ratio, bn[1] * this._ratio ];
	    }
	    getAverage() {
	        return this._avg;
	    }
	    reset() {
	        this._frameNum = 0;
	    }
	    getJitter(e) {
	        const t = this._frameNum % _n, n = this._ratio;
	        return set(e, gn[t][0] * n, gn[t][1] * n), e;
	    }
	    frame() {
	        this._frameNum++, this._frameNum % _n == 0 && (this._frameNum = 0);
	    }
	    getSampleCount() {
	        return _n;
	    }
	}

	class xn {
	    constructor(e, t, n = 5) {
	        this._regl = e, this._renderer = new xe(e), this._inputRGBM = t, this._level = n;
	    }
	    render(e, t) {
	        this._initShaders(), this._createTextures(e), this._blur(e, t || 0);
	        const n = {
	            blurTex0: this._blur01Tex,
	            blurTex1: this._blur11Tex,
	            blurTex2: this._blur21Tex,
	            blurTex3: this._blur31Tex,
	            blurTex4: this._blur41Tex
	        };
	        return this._level > 5 && (n.blurTex5 = this._blur51Tex, n.blurTex6 = this._blur61Tex), 
	        n;
	    }
	    _blur(e, t) {
	        let n = this._blurUniforms;
	        n || (n = this._blurUniforms = {
	            rgbmRange: 7,
	            blurDir: [ 0, 0 ],
	            outSize: [ 0, 0 ],
	            pixelRatio: [ 1, 1 ],
	            outputSize: [ 0, 0 ]
	        }), set(n.outSize, e.width, e.height), this._blurOnce(this._blur0Shader, e, this._blur00FBO, this._blur01FBO, .5, t), 
	        this._blurOnce(this._blur1Shader, this._blur01FBO.color[0], this._blur10FBO, this._blur11FBO, .5), 
	        this._blurOnce(this._blur2Shader, this._blur11FBO.color[0], this._blur20FBO, this._blur21FBO, .5), 
	        this._blurOnce(this._blur3Shader, this._blur21FBO.color[0], this._blur30FBO, this._blur31FBO, .5), 
	        this._blurOnce(this._blur4Shader, this._blur31FBO.color[0], this._blur40FBO, this._blur41FBO, .5), 
	        this._level > 5 && (this._blurOnce(this._blur5Shader, this._blur41FBO.color[0], this._blur50FBO, this._blur51FBO, .5), 
	        this._blurOnce(this._blur6Shader, this._blur51FBO.color[0], this._blur60FBO, this._blur51FBO, .5));
	    }
	    _blurOnce(e, t, n, r, i, s) {
	        const a = Math.ceil(i * t.width), c = Math.ceil(i * t.height);
	        n.width === a && n.height === c || n.resize(a, c), r.width === a && r.height === c || r.resize(a, c);
	        const l = this._blurUniforms;
	        l.luminThreshold = s, l.TextureBlurInput = t, l.inputRGBM = +this._inputRGBM, set(l.blurDir, 0, 1), 
	        set(l.outputSize, n.width, n.height), this._renderer.render(e, l, null, n), l.luminThreshold = 0, 
	        l.inputRGBM = 1, set(l.blurDir, 1, 0), l.TextureBlurInput = n.color[0], this._renderer.render(e, l, null, r);
	    }
	    dispose() {
	        this._blur0Shader && (this._blur0Shader.dispose(), delete this._blur0Shader, this._blur1Shader.dispose(), 
	        this._blur2Shader.dispose(), this._blur3Shader.dispose(), this._blur4Shader.dispose(), 
	        this._blur5Shader && (this._blur5Shader.dispose(), this._blur6Shader.dispose(), 
	        delete this._blur5Shader)), this._blur00Tex && (delete this._blur00Tex, this._blur00FBO.destroy(), 
	        this._blur01FBO.destroy(), this._blur10FBO.destroy(), this._blur11FBO.destroy(), 
	        this._blur20FBO.destroy(), this._blur21FBO.destroy(), this._blur30FBO.destroy(), 
	        this._blur31FBO.destroy(), this._blur40FBO.destroy(), this._blur41FBO.destroy(), 
	        this._blur50FBO && (this._blur50FBO.destroy(), this._blur51FBO.destroy(), this._blur60FBO.destroy(), 
	        this._blur61FBO.destroy()));
	    }
	    _createTextures(e) {
	        if (this._blur00Tex) return;
	        let t = e.width, n = e.height;
	        this._blur00Tex = this._createColorTex(e, t, n), this._blur00FBO = this._createBlurFBO(this._blur00Tex), 
	        this._blur01Tex = this._createColorTex(e), this._blur01FBO = this._createBlurFBO(this._blur01Tex), 
	        t = Math.ceil(t / 2), n = Math.ceil(n / 2), this._blur10Tex = this._createColorTex(e, t, n), 
	        this._blur10FBO = this._createBlurFBO(this._blur10Tex), this._blur11Tex = this._createColorTex(e, t, n), 
	        this._blur11FBO = this._createBlurFBO(this._blur11Tex), t = Math.ceil(t / 2), n = Math.ceil(n / 2), 
	        this._blur20Tex = this._createColorTex(e, t, n), this._blur20FBO = this._createBlurFBO(this._blur20Tex), 
	        this._blur21Tex = this._createColorTex(e, t, n), this._blur21FBO = this._createBlurFBO(this._blur21Tex), 
	        t = Math.ceil(t / 2), n = Math.ceil(n / 2), this._blur30Tex = this._createColorTex(e, t, n), 
	        this._blur30FBO = this._createBlurFBO(this._blur30Tex), this._blur31Tex = this._createColorTex(e, t, n), 
	        this._blur31FBO = this._createBlurFBO(this._blur31Tex), t = Math.ceil(t / 2), n = Math.ceil(n / 2), 
	        this._blur40Tex = this._createColorTex(e, t, n), this._blur40FBO = this._createBlurFBO(this._blur40Tex), 
	        this._blur41Tex = this._createColorTex(e, t, n), this._blur41FBO = this._createBlurFBO(this._blur41Tex), 
	        this._level > 5 && (t = Math.ceil(t / 2), n = Math.ceil(n / 2), this._blur50Tex = this._createColorTex(e, t, n), 
	        this._blur50FBO = this._createBlurFBO(this._blur50Tex), this._blur51Tex = this._createColorTex(e, t, n), 
	        this._blur51FBO = this._createBlurFBO(this._blur51Tex), t = Math.ceil(t / 2), n = Math.ceil(n / 2), 
	        this._blur60Tex = this._createColorTex(e, t, n), this._blur60FBO = this._createBlurFBO(this._blur60Tex), 
	        this._blur61Tex = this._createColorTex(e, t, n), this._blur61FBO = this._createBlurFBO(this._blur61Tex));
	    }
	    _createColorTex(e, t, n) {
	        return this._regl.texture({
	            min: "linear",
	            mag: "linear",
	            type: "uint8",
	            width: t || e.width,
	            height: n || e.height
	        });
	    }
	    _createBlurFBO(e) {
	        return this._regl.framebuffer({
	            width: e.width,
	            height: e.height,
	            colors: [ e ],
	            depth: !1,
	            stencil: !1
	        });
	    }
	    _initShaders() {
	        if (!this._blur0Shader) {
	            const e = {
	                vert: en,
	                extraCommandProps: {
	                    viewport: {
	                        x: 0,
	                        y: 0,
	                        width: (e, t) => t.outputSize[0],
	                        height: (e, t) => t.outputSize[1]
	                    }
	                },
	                frag: "#version 100\nprecision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\nuniform float inputRGBM;\nuniform float luminThreshold;\n#define SHADER_NAME GAUSSIAN_BLUR0\nconst vec3 c = vec3(.2126, .7152, .0722);\nfloat d(const in vec3 e) {\n  return dot(e, c);\n}\nvec4 f(vec4 e) {\n  float h = max(sign(d(e.rgb) - luminThreshold), .0);\n  return e * h;\n}\nvec2 i;\nvec4 j(const in vec3 e, const in float k) {\n  vec4 l;\n  vec3 m = e / k;\n  l.a = clamp(max(max(m.r, m.g), max(m.b, 1e-6)), .0, 1.);\n  l.a = ceil(l.a * 255.) / 255.;\n  l.rgb = m / l.a;\n  return l;\n}\nvec3 n(const in vec4 e, const in float k) {\n  if(inputRGBM == .0)\n    return e.rgb;\n  return k * e.rgb * e.a;\n}\nvec4 o() {\n  vec3 u = .375 * (f(vec4(n(texture2D(TextureBlurInput, i.xy), rgbmRange), 1.))).rgb;\n  vec2 v;\n  vec2 A = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  v = A * 1.2;\n  u += .3125 * (f(vec4(n(texture2D(TextureBlurInput, i.xy + v.xy), rgbmRange), 1.))).rgb;\n  u += .3125 * (f(vec4(n(texture2D(TextureBlurInput, i.xy - v.xy), rgbmRange), 1.))).rgb;\n  return vec4(u, 1.);\n}\nvoid main(void) {\n  i = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = o();\n  e = j(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}"
	            };
	            this._blur0Shader = new rn(e), e.frag = "#version 100\nprecision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\n#define SHADER_NAME GAUSSIAN_BLUR1\nvec2 c;\nvec4 d(const in vec3 e, const in float f) {\n  if(f <= .0)\n    return vec4(e, 1.);\n  vec4 h;\n  vec3 i = e / f;\n  h.a = clamp(max(max(i.r, i.g), max(i.b, 1e-6)), .0, 1.);\n  h.a = ceil(h.a * 255.) / 255.;\n  h.rgb = i / h.a;\n  return h;\n}\nvec3 j(const in vec4 e, const in float f) {\n  if(f <= .0)\n    return e.rgb;\n  return f * e.rgb * e.a;\n}\nvec4 k() {\n  vec3 l = .3125 * (vec4(j(texture2D(TextureBlurInput, c.xy), rgbmRange), 1.)).rgb;\n  vec2 m;\n  vec2 n = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  m = n * 1.2857142857142858;\n  l += .328125 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .328125 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  return vec4(l, 1.);\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = k();\n  e = d(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}", 
	            this._blur1Shader = new rn(e), e.frag = "#version 100\nprecision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\n#define SHADER_NAME GAUSSIAN_BLUR2\nvec2 c;\nvec4 d(const in vec3 e, const in float f) {\n  if(f <= .0)\n    return vec4(e, 1.);\n  vec4 h;\n  vec3 i = e / f;\n  h.a = clamp(max(max(i.r, i.g), max(i.b, 1e-6)), .0, 1.);\n  h.a = ceil(h.a * 255.) / 255.;\n  h.rgb = i / h.a;\n  return h;\n}\nvec3 j(const in vec4 e, const in float f) {\n  if(f <= .0)\n    return e.rgb;\n  return f * e.rgb * e.a;\n}\nvec4 k() {\n  vec3 l = .2734375 * (vec4(j(texture2D(TextureBlurInput, c.xy), rgbmRange), 1.)).rgb;\n  vec2 m;\n  vec2 n = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  m = n * 1.3333333333333333;\n  l += .328125 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .328125 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 3.111111111111111;\n  l += .03515625 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .03515625 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  return vec4(l, 1.);\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = k();\n  e = d(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}", 
	            this._blur2Shader = new rn(e), e.frag = "#version 100\nprecision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\n#define SHADER_NAME GAUSSIAN_BLUR3\nvec2 c;\nvec4 d(const in vec3 e, const in float f) {\n  if(f <= .0)\n    return vec4(e, 1.);\n  vec4 h;\n  vec3 i = e / f;\n  h.a = clamp(max(max(i.r, i.g), max(i.b, 1e-6)), .0, 1.);\n  h.a = ceil(h.a * 255.) / 255.;\n  h.rgb = i / h.a;\n  return h;\n}\nvec3 j(const in vec4 e, const in float f) {\n  if(f <= .0)\n    return e.rgb;\n  return f * e.rgb * e.a;\n}\nvec4 k() {\n  vec3 l = .24609375 * (vec4(j(texture2D(TextureBlurInput, c.xy), rgbmRange), 1.)).rgb;\n  vec2 m;\n  vec2 n = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  m = n * 1.3636363636363635;\n  l += .322265625 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .322265625 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 3.1818181818181817;\n  l += .0537109375 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .0537109375 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  return vec4(l, 1.);\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = k();\n  e = d(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}", 
	            this._blur3Shader = new rn(e), e.frag = "#version 100\nprecision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\n#define SHADER_NAME GAUSSIAN_BLUR4\nvec2 c;\nvec4 d(const in vec3 e, const in float f) {\n  if(f <= .0)\n    return vec4(e, 1.);\n  vec4 h;\n  vec3 i = e / f;\n  h.a = clamp(max(max(i.r, i.g), max(i.b, 1e-6)), .0, 1.);\n  h.a = ceil(h.a * 255.) / 255.;\n  h.rgb = i / h.a;\n  return h;\n}\nvec3 j(const in vec4 e, const in float f) {\n  if(f <= .0)\n    return e.rgb;\n  return f * e.rgb * e.a;\n}\nvec4 k() {\n  vec3 l = .2255859375 * (vec4(j(texture2D(TextureBlurInput, c.xy), rgbmRange), 1.)).rgb;\n  vec2 m;\n  vec2 n = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  m = n * 1.3846153846153846;\n  l += .314208984375 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .314208984375 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 3.230769230769231;\n  l += .06982421875 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .06982421875 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 5.076923076923077;\n  l += .003173828125 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .003173828125 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  return vec4(l, 1.);\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = k();\n  e = d(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}", 
	            this._blur4Shader = new rn(e), this._level > 5 && (e.frag = "precision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 outSize;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\n#define SHADER_NAME GAUSSIAN_BLUR5\nvec2 c;\nvec4 d(const in vec3 e, const in float f) {\n  if(f <= .0)\n    return vec4(e, 1.);\n  vec4 h;\n  vec3 i = e / f;\n  h.a = clamp(max(max(i.r, i.g), max(i.b, 1e-6)), .0, 1.);\n  h.a = ceil(h.a * 255.) / 255.;\n  h.rgb = i / h.a;\n  return h;\n}\nvec3 j(const in vec4 e, const in float f) {\n  if(f <= .0)\n    return e.rgb;\n  return f * e.rgb * e.a;\n}\nvec4 k() {\n  vec3 l = .20947265625 * (vec4(j(texture2D(TextureBlurInput, c.xy), rgbmRange), 1.)).rgb;\n  vec2 m;\n  vec2 n = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  n *= outSize.y * .00075;\n  m = n * 1.4;\n  l += .30548095703125 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .30548095703125 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 3.2666666666666666;\n  l += .08331298828125 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .08331298828125 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 5.133333333333334;\n  l += .00640869140625 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .00640869140625 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  return vec4(l, 1.);\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = k();\n  e = d(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}", 
	            this._blur5Shader = new rn(e), e.frag = "#version 100\nprecision highp float;\nuniform float rgbmRange;\nuniform sampler2D TextureBlurInput;\nuniform sampler2D TextureInput;\nuniform vec2 blurDir;\nuniform vec2 outSize;\nuniform vec2 pixelRatio;\nuniform vec2 outputSize;\n#define SHADER_NAME GAUSSIAN_BLUR6\nvec2 c;\nvec4 d(const in vec3 e, const in float f) {\n  if(f <= .0)\n    return vec4(e, 1.);\n  vec4 h;\n  vec3 i = e / f;\n  h.a = clamp(max(max(i.r, i.g), max(i.b, 1e-6)), .0, 1.);\n  h.a = ceil(h.a * 255.) / 255.;\n  h.rgb = i / h.a;\n  return h;\n}\nvec3 j(const in vec4 e, const in float f) {\n  if(f <= .0)\n    return e.rgb;\n  return f * e.rgb * e.a;\n}\nvec4 k() {\n  vec3 l = .196380615234375 * (vec4(j(texture2D(TextureBlurInput, c.xy), rgbmRange), 1.)).rgb;\n  vec2 m;\n  vec2 n = pixelRatio.xy * blurDir.xy / outputSize.xy;\n  n *= outSize.y * .00075;\n  m = n * 1.411764705882353;\n  l += .2967529296875 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .2967529296875 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 3.2941176470588234;\n  l += .09442138671875 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .09442138671875 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  m = n * 5.176470588235294;\n  l += .0103759765625 * (vec4(j(texture2D(TextureBlurInput, c.xy + m.xy), rgbmRange), 1.)).rgb;\n  l += .0103759765625 * (vec4(j(texture2D(TextureBlurInput, c.xy - m.xy), rgbmRange), 1.)).rgb;\n  return vec4(l, 1.);\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = k();\n  e = d(e.rgb, rgbmRange);\n  gl_FragColor = e;\n}", 
	            this._blur6Shader = new rn(e));
	        }
	    }
	}

	class yn {
	    constructor(e) {
	        this._regl = e, this._renderer = new xe(e);
	    }
	    render(e, t, n, r, i, o, s, a, c) {
	        this._initShaders(), this._createTextures(e);
	        const l = this._blurPass.render(t, n);
	        return this._combine(e, l, t, r, i, o, s, a, c);
	    }
	    _combine(e, t, n, r, i, s, a, c, l) {
	        l || this._combineTex.width === e.width && this._combineTex.height === e.height || this._combineFBO.resize(e.width, e.height);
	        let f = this._combineUniforms;
	        const {blurTex0: u, blurTex1: h, blurTex2: d, blurTex3: m, blurTex4: v} = t;
	        f || (f = this._combineUniforms = {
	            bloomFactor: 0,
	            bloomRadius: 0,
	            rgbmRange: 7,
	            TextureBloomBlur1: u,
	            TextureBloomBlur2: h,
	            TextureBloomBlur3: d,
	            TextureBloomBlur4: m,
	            TextureBloomBlur5: v,
	            TextureInput: null,
	            TextureSource: null,
	            outputSize: [ 0, 0 ]
	        }), f.noAaTextureSource = s, f.pointTextureSource = a, f.enableAA = c, f.bloomFactor = r, 
	        f.bloomRadius = i, f.TextureInput = n, f.TextureSource = e, set(f.outputSize, e.width, e.height);
	        const g = {};
	        return s ? g.HAS_NOAA_TEX = 1 : delete g.HAS_NOAA_TEX, a ? g.HAS_POINT_TEX = 1 : delete g.HAS_POINT_TEX, 
	        this._combineShader.setDefines(g), this._renderer.render(this._combineShader, f, null, l ? null : this._combineFBO), 
	        l ? null : this._combineTex;
	    }
	    dispose() {
	        this._combineFBO && (this._combineFBO.destroy(), delete this._combineFBO), this._blurPass && (this._blurPass.dispose(), 
	        delete this._blurPass), delete this._uniforms;
	    }
	    _createTextures(e) {
	        if (this._combineTex) return;
	        this._combineTex = this._createColorTex(e, e.width, e.height, "uint8"), this._combineFBO = this._createBlurFBO(this._combineTex);
	    }
	    _createColorTex(e, t, n, r) {
	        const i = this._renderer.regl, o = r || (i.hasExtension("OES_texture_half_float") ? "float16" : "float");
	        return i.texture({
	            min: "linear",
	            mag: "linear",
	            type: o,
	            width: t || e.width,
	            height: n || e.height
	        });
	    }
	    _createBlurFBO(e) {
	        return this._renderer.regl.framebuffer({
	            width: e.width,
	            height: e.height,
	            colors: [ e ],
	            depth: !1,
	            stencil: !1
	        });
	    }
	    _initShaders() {
	        if (!this._combineShader) {
	            const e = {
	                x: 0,
	                y: 0,
	                width: (e, t) => t.outputSize[0],
	                height: (e, t) => t.outputSize[1]
	            };
	            this._blurPass = new xn(this._regl, !1), this._combineShader = new rn({
	                vert: en,
	                frag: "#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\nprecision highp float;\nuniform float bloomFactor;\nuniform float bloomRadius;\nuniform float rgbmRange;\nuniform sampler2D TextureBloomBlur1;\nuniform sampler2D TextureBloomBlur2;\nuniform sampler2D TextureBloomBlur3;\nuniform sampler2D TextureBloomBlur4;\nuniform sampler2D TextureBloomBlur5;\nuniform sampler2D TextureInput;\nuniform sampler2D TextureSource;\n#ifdef HAS_NOAA_TEX\nuniform sampler2D noAaTextureSource;\n#endif\n#ifdef HAS_POINT_TEX\nuniform sampler2D pointTextureSource;\n#endif\nuniform float enableAA;\nuniform vec2 outputSize;\n#define SHADER_NAME bloomCombine\nvec2 c;\nvec3 d(const in vec3 e) {\n  return vec3(e.r < .0031308 ? e.r * 12.92 : 1.055 * pow(e.r, 1. / 2.4) - .055, e.g < .0031308 ? e.g * 12.92 : 1.055 * pow(e.g, 1. / 2.4) - .055, e.b < .0031308 ? e.b * 12.92 : 1.055 * pow(e.b, 1. / 2.4) - .055);\n}\nvec3 f(const in vec4 e, const in float h) {\n  if(h <= .0)\n    return e.rgb;\n  return h * e.rgb * e.a;\n}\nfloat i(const float j, const float k) {\n  return mix(j, k * 2. - j, bloomRadius);\n}\nvec4 l(sampler2D m, vec2 n) {\n  vec4 e;\n  mediump vec2 o = vec2(1. / outputSize.x, 1. / outputSize.y);\n  vec3 u = texture2D(m, (n + vec2(-1., -1.)) * o).xyz;\n  vec3 v = texture2D(m, (n + vec2(1., -1.)) * o).xyz;\n  vec3 A = texture2D(m, (n + vec2(-1., 1.)) * o).xyz;\n  vec3 B = texture2D(m, (n + vec2(1.)) * o).xyz;\n  vec4 C = texture2D(m, n * o);\n  vec3 D = C.xyz;\n  vec3 E = vec3(.299, .587, .114);\n  float F = dot(u, E);\n  float G = dot(v, E);\n  float H = dot(A, E);\n  float I = dot(B, E);\n  float J = dot(D, E);\n  float K = min(J, min(min(F, G), min(H, I)));\n  float L = max(J, max(max(F, G), max(H, I)));\n  mediump vec2 M;\n  M.x = -((F + G) - (H + I));\n  M.y = (F + H) - (G + I);\n  float N = max((F + G + H + I) * (.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n  float O = 1. / (min(abs(M.x), abs(M.y)) + N);\n  M = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), M * O)) * o;\n  vec4 P = .5 * (texture2D(m, n * o + M * (1. / 3. - .5)) + texture2D(m, n * o + M * (2. / 3. - .5)));\n  vec4 Q = P * .5 + .25 * (texture2D(m, n * o + M * -.5) + texture2D(m, n * o + M * .5));\n  float R = dot(Q.xyz, E);\n  if(R < K || R > L)\n    e = P;\n  else\n    e = Q;\n  return e;\n}\nvec4 S() {\n  vec3 T = vec3(.0);\n  const float U = .6;\n  const float V = 1.1;\n  const float W = .9;\n  const float X = .6;\n  const float Y = .3;\n  const float Z = .1;\n  T += (vec4(f(texture2D(TextureBloomBlur1, c), rgbmRange), 1.)).rgb * i(V, U);\n  T += (vec4(f(texture2D(TextureBloomBlur2, c), rgbmRange), 1.)).rgb * i(W, U);\n  T += (vec4(f(texture2D(TextureBloomBlur3, c), rgbmRange), 1.)).rgb * i(X, U);\n  T += (vec4(f(texture2D(TextureBloomBlur4, c), rgbmRange), 1.)).rgb * i(Y, U);\n  T += (vec4(f(texture2D(TextureBloomBlur5, c), rgbmRange), 1.)).rgb * i(Z, U);\n  vec4 ba;\n  if(enableAA == 1.) {\n    ba = l(TextureInput, gl_FragCoord.xy);\n  } else {\n    ba = texture2D(TextureInput, c);\n  }\n  ba.rgb = mix(vec3(.0), ba.rgb, sign(ba.a));\n  vec4 bb = texture2D(TextureSource, c);\n#ifdef HAS_NOAA_TEX\nvec4 bc = texture2D(noAaTextureSource, c);\n  bb = bc + bb * (1. - bc.a);\n#endif\nvec4 bd = vec4(.0);\n#ifdef HAS_POINT_TEX\nbd = texture2D(pointTextureSource, c);\n#endif\nfloat be = sqrt((T.r + T.g + T.b) / 3.);\n  vec4 bf = vec4(d(T * bloomFactor), be);\n  return bd + (ba + bb * (1. - ba.a)) * (1. - bd.a) + bf;\n}\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 e = S();\n  gl_FragColor = e;\n}",
	                extraCommandProps: {
	                    viewport: e
	                }
	            });
	        }
	    }
	}

	class Tn extends rn {
	    constructor() {
	        const e = [];
	        super({
	            vert: en,
	            frag: "precision highp float;\n#include <gl2_frag>\n#define SHADER_NAME COPY_DEPTH\nuniform sampler2D TextureDepth;\nuniform vec2 textureSize;\n#include <common_pack_float>\nvoid main(void) {\n  vec2 c = gl_FragCoord.xy / textureSize.xy;\n  float d = texture2D(TextureDepth, c).r;\n  glFragColor = common_encodeDepth(d);\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
	            uniforms: [ {
	                name: "textureSize",
	                type: "function",
	                fn: (t, n) => (e[0] = n.TextureDepth.width, e[1] = n.TextureDepth.height, e)
	            } ],
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.TextureDepth.width,
	                    height: (e, t) => t.TextureDepth.height
	                }
	            }
	        }), this.version = 300;
	    }
	    getMeshCommand(e, t) {
	        return this.commands.copy_depth || (this.commands.copy_depth = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.copy_depth;
	    }
	}

	class An {
	    static getUniformDeclares() {
	        const e = [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ], t = new Array(16);
	        return [ {
	            name: "invProjMatrix",
	            type: "function",
	            fn: (e, n) => invert$2(t, n.projMatrix)
	        }, {
	            name: "outputFovInfo",
	            type: "array",
	            length: 2,
	            fn: function(t, r) {
	                const i = Math.tan(.5 * r.fov), o = r.outSize[0] / r.outSize[1] * i;
	                return set$3(e[0], o, i, o, -i), set$3(e[1], -o, i, -o, -i), e;
	            }
	        }, {
	            name: "reprojViewProjMatrix",
	            type: "function",
	            fn: (e, t) => multiply$5([], t.prevProjViewMatrix, t.cameraWorldMatrix)
	        } ];
	    }
	    static getDefines() {
	        return {
	            HAS_SSR: 1
	        };
	    }
	    constructor(e) {
	        this._regl = e, this._renderer = new xe(e), this._inputRGBM = 0;
	    }
	    setup(e) {
	        this._initShaders(), this._createTextures(e);
	    }
	    getSSRUniforms(e, t, n) {
	        if (!this._depthCopy) return null;
	        const r = this._depthCopy;
	        return {
	            TextureDepth: r,
	            TextureReflected: this.getMipmapTexture(),
	            ssrFactor: t || 1,
	            ssrQuality: n || 2,
	            outSize: [ r.width, r.height ],
	            fov: e.getFov() * Math.PI / 180,
	            prevProjViewMatrix: this._projViewMatrix || e.projViewMatrix,
	            cameraWorldMatrix: e.cameraWorldMatrix
	        };
	    }
	    genMipMap(e, t, n) {
	        return this.setup(e), this._mipmap(e), this.copyDepthTex(t), this._projViewMatrix || (this._projViewMatrix = []), 
	        copy$5(this._projViewMatrix, n), delete this._depthCopied, this._outputTex;
	    }
	    getPrevProjViewMatrix() {
	        return this._projViewMatrix;
	    }
	    copyDepthTex(e) {
	        if (this._depthCopied) return null;
	        if (this.setup(e), this._depthCopy) e.width === this._depthCopy.width && e.height === this._depthCopy.height || this._depthCopyFBO.resize(e.width, e.height); else {
	            this._depthCopy = this._regl.texture({
	                min: "nearest",
	                mag: "nearest",
	                mipmap: !1,
	                type: "uint8",
	                width: e.width,
	                height: e.height
	            });
	            this._depthCopyFBO = this._regl.framebuffer({
	                width: e.width,
	                height: e.height,
	                colors: [ this._depthCopy ],
	                colorFormat: "rgba"
	            });
	        }
	        return this._renderer.render(this._copyDepthShader, {
	            TextureDepth: e
	        }, null, this._depthCopyFBO), this._depthCopied = !0, this._depthCopy;
	    }
	    _mipmap(e) {
	        const t = this._targetFBO, n = Math.ceil(.5 * e.width), r = Math.ceil(.5 * e.height);
	        t.width === n && t.height === r || t.resize(n, r);
	        let i = this._blurUniforms;
	        i || (i = this._blurUniforms = {
	            rgbmRange: 7,
	            outputSize: [ 0, 0 ]
	        }), i.TextureInput = e, i.inputRGBM = +this._inputRGBM, set(i.outputSize, t.width, t.height), 
	        this._renderer.render(this._ssrQuadShader, i, null, t);
	    }
	    getMipmapTexture() {
	        return this._outputTex || (this._outputTex = this._renderer.regl.texture({
	            type: "uint8",
	            width: 2,
	            height: 2
	        })), this._outputTex;
	    }
	    dispose() {
	        this._copyDepthShader && (this._ssrQuadShader.dispose(), this._copyDepthShader.dispose(), 
	        this._targetFBO.destroy(), delete this._copyDepthShader), this._depthCopy && (this._depthCopyFBO.destroy(), 
	        delete this._depthCopy, delete this._depthCopyFBO);
	    }
	    _initShaders() {
	        if (!this._copyDepthShader) {
	            this._copyDepthShader = new Tn;
	            this._ssrQuadShader = new rn({
	                vert: en,
	                frag: "#version 100\nprecision mediump float;\nuniform sampler2D TextureInput;\nuniform vec2 outputSize;\n#define SHADER_NAME QUAD\nvec2 c;\nvoid main(void) {\n  c = gl_FragCoord.xy / outputSize.xy;\n  vec4 d = texture2D(TextureInput, c.xy);\n  gl_FragColor = d;\n}",
	                extraCommandProps: {
	                    viewport: {
	                        x: 0,
	                        y: 0,
	                        width: (e, t) => t.outputSize[0],
	                        height: (e, t) => t.outputSize[1]
	                    }
	                }
	            });
	        }
	    }
	    _createTextures(e) {
	        if (!this._targetFBO) {
	            const t = this._regl;
	            this._outputTex && this._outputTex.destroy(), this._outputTex = t.texture({
	                min: "linear",
	                mag: "linear",
	                type: "uint8",
	                width: e.width,
	                height: e.height
	            }), this._targetFBO = t.framebuffer({
	                width: e.width,
	                height: e.height,
	                colors: [ this._outputTex ],
	                depth: !1,
	                stencil: !1
	            });
	        }
	    }
	}

	class Sn {
	    constructor(e) {
	        this._renderer = e, this.regl = e.regl, this._init();
	    }
	    render(e, t, {projViewMatrix: n, lineColor: r, lineWidth: i}) {
	        if (!e || !e.length) return;
	        this._clear(), this._resize(t);
	        const o = new ft$1(e);
	        this._drawExtent(o, n), this._drawOutline(r, i, t);
	    }
	    _init() {
	        this.fboExtent = this._createFBO();
	        const e = {
	            x: 0,
	            y: 0,
	            width: () => this.fboExtent.width,
	            height: () => this.fboExtent.height
	        };
	        this.extentShader = new Wt({
	            vert: "attribute vec3 aPosition;\nuniform mat4 projViewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\n#include <get_output>  \nvoid main() {\n  mat4 c = getPositionMatrix();\n  gl_Position = projViewMatrix * modelMatrix * c * getPosition(aPosition);\n}",
	            frag: "precision highp float;\nvoid main() {\n  gl_FragColor = vec4(.0, .0, .0, 1.);\n}",
	            extraCommandProps: {
	                viewport: e,
	                cull: {
	                    enable: !1
	                }
	            }
	        }), this.outlineShader = new rn({
	            vert: en,
	            frag: "precision highp float;\nprecision highp int;\nvarying vec2 vTexCoord;\nuniform sampler2D maskTexture;\nuniform vec2 texSize;\nuniform vec3 visibleEdgeColor;\nuniform float lineWidth;\nvoid main() {\n  vec2 c = (1. / texSize) * lineWidth;\n  vec4 d = vec4(1., .0, .0, 1.) * vec4(c.x, c.y, c.x, c.y);\n  vec4 e = texture2D(maskTexture, vTexCoord + d.xy);\n  vec4 f = texture2D(maskTexture, vTexCoord - d.xy);\n  vec4 h = texture2D(maskTexture, vTexCoord + d.yw);\n  vec4 i = texture2D(maskTexture, vTexCoord - d.yw);\n  float j = (e.r - f.r) * .7;\n  float k = (h.r - i.r) * .7;\n  float l = length(vec2(j, k));\n  float m = min(e.g, f.g);\n  float n = min(h.g, i.g);\n  float o = min(m, n);\n  gl_FragColor = 1. - o > .001 ? vec4(visibleEdgeColor, 1.) * vec4(l) : vec4(.0);\n}",
	            extraCommandProps: {
	                viewport: e,
	                depth: {
	                    enable: !0,
	                    mask: !1,
	                    func: "always"
	                },
	                blend: {
	                    enable: !0,
	                    func: {
	                        src: "one",
	                        dst: "one minus src alpha"
	                    },
	                    equation: "add"
	                }
	            }
	        });
	    }
	    _drawExtent(e, t) {
	        this._renderer.render(this.extentShader, {
	            projViewMatrix: t
	        }, e, this.fboExtent);
	    }
	    _drawOutline(e, t, n) {
	        this._renderer.render(this.outlineShader, {
	            texSize: [ n.width, n.height ],
	            visibleEdgeColor: e || [ 1, 0, 0 ],
	            maskTexture: this.fboExtent,
	            lineWidth: t || 1
	        }, null, n);
	    }
	    _createFBO() {
	        return this.regl.framebuffer({
	            color: this.regl.texture({
	                width: 2,
	                height: 2,
	                wrap: "clamp",
	                mag: "linear",
	                min: "linear"
	            }),
	            depth: !0
	        });
	    }
	    _clear() {
	        this.regl.clear({
	            color: [ 1, 1, 1, 1 ],
	            depth: 1,
	            framebuffer: this.fboExtent
	        });
	    }
	    dispose() {
	        this.fboExtent && (this.fboExtent.destroy(), this.extentShader.dispose(), this.outlineShader.dispose(), 
	        delete this.fboExtent);
	    }
	    _resize(e) {
	        const {width: t, height: n} = e;
	        this.fboExtent.width === t && this.fboExtent.height === n || this.fboExtent.resize(t, n);
	    }
	}

	class Mn {
	    constructor(e, t) {
	        this.renderer = e, this._viewport = t, this._width = 1, this._height = 1, this._init();
	    }
	    _init() {
	        this._depthFBOViewport = this._viewport, this._depthShader = new Wt({
	            vert: "attribute vec3 aPosition;\nuniform mat4 projViewMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 positionMatrix;\n#include <get_output>\nvoid main() {\n  mat4 c = getPositionMatrix();\n  gl_Position = projViewMatrix * modelMatrix * c * getPosition(aPosition);\n}",
	            frag: "#ifdef GL_ES\nprecision highp float;\n#endif\nvec4 c(float d) {\n  const vec4 e = vec4(1., 256., 256. * 256., 256. * 256. * 256.);\n  const vec4 f = vec4(1. / 256., 1. / 256., 1. / 256., .0);\n  vec4 h = fract(d * e);\n  h -= h.gbaa * f;\n  return h;\n}\nvoid main() {\n  gl_FragColor = c(gl_FragCoord.z);\n}",
	            extraCommandProps: {
	                viewport: this._depthFBOViewport
	            }
	        }), this._depthFBO = this.renderer.regl.framebuffer({
	            color: this.renderer.regl.texture({
	                width: this._width,
	                height: this._height,
	                wrap: "clamp",
	                mag: "linear",
	                min: "linear"
	            }),
	            depth: !0
	        });
	    }
	    render(e, t) {
	        this._resize(), this.renderer.clear({
	            color: [ 1, 0, 0, 1 ],
	            depth: 1,
	            framebuffer: this._depthFBO
	        });
	        const n = new ft$1(e), r = this._createProjViewMatrix(t.eyePos, t.lookPoint, t.verticalAngle, t.horizonAngle);
	        return this._renderDepth(n, r), {
	            depthMap: this._depthFBO,
	            projViewMatrixFromViewpoint: r
	        };
	    }
	    _renderDepth(e, t) {
	        this.renderer.render(this._depthShader, {
	            projViewMatrix: t
	        }, e, this._depthFBO);
	    }
	    _createProjViewMatrix(e, t, n, i) {
	        const o = n / i, s = Math.sqrt(Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2) + Math.pow(e[2] - t[2], 2)), a = perspective([], i * Math.PI / 180, o, 1, s), c = lookAt([], e, t, [ 0, 1, 0 ]);
	        return multiply$5([], a, c);
	    }
	    dispose() {
	        this._depthFBO && this._depthFBO.destroy();
	    }
	    _resize() {
	        this._width = K$1(this._viewport.width.data) ? this._viewport.width.data() : this._viewport.width, 
	        this._height = K$1(this._viewport.height.data) ? this._viewport.height.data() : this._viewport.height, 
	        !this._depthFBO || this._depthFBO.width === this._width && this._depthFBO.height === this._height || this._depthFBO.resize(this._width, this._height);
	    }
	}

	class En extends Wt {
	    constructor(e) {
	        const t = [];
	        super({
	            vert: "#define SHADER_NAME HEATMAP\nfloat c(const vec2 d, const float t) {\n  return mix(d[0], d[1], t);\n}\nuniform mat4 projViewModelMatrix;\nuniform float extrudeScale;\nuniform float heatmapIntensity;\nattribute vec3 aPosition;\nvarying vec2 vExtrude;\n#ifdef HAS_HEAT_WEIGHT\nuniform lowp float heatmapWeightT;\nattribute highp vec2 aWeight;\nvarying highp float weight;\n#else\nuniform highp float heatmapWeight;\n#endif\nuniform mediump float heatmapRadius;\nconst highp float e = 1. / 255. / 16.;\n#define GAUSS_COEF 0.3989422804014327\nvoid main(void) {\n  \n#ifdef HAS_HEAT_WEIGHT\nweight = c(aWeight, heatmapWeightT);\n#else\nhighp float f = heatmapWeight;\n#endif\nmediump float h = heatmapRadius;\n  vec2 i = vec2(mod(aPosition.xy, 2.) * 2. - 1.);\n  float j = sqrt(-2. * log(e / f / heatmapIntensity / GAUSS_COEF)) / 3.;\n  vExtrude = j * i;\n  vec2 k = vExtrude * h * extrudeScale;\n  vec4 l = vec4(floor(aPosition.xy * .5) + k, aPosition.z, 1);\n  gl_Position = projViewModelMatrix * l;\n}",
	            frag: "#define SHADER_NAME HEATMAP\nprecision mediump float;\nuniform highp float heatmapIntensity;\nvarying vec2 vExtrude;\n#ifdef HAS_HEAT_WEIGHT\nvarying highp float weight;\n#else\nuniform highp float heatmapWeight;\n#endif\n#define GAUSS_COEF 0.3989422804014327\nvoid main() {\n  \n#ifndef HAS_HEAT_WEIGHT\nhighp float c = heatmapWeight;\n#endif\nfloat d = -.5 * 3. * 3. * dot(vExtrude, vExtrude);\n  float e = c * heatmapIntensity * GAUSS_COEF * exp(d);\n  gl_FragColor = vec4(e, 1., 1., 1.);\n}",
	            uniforms: [ {
	                name: "extrudeScale",
	                type: "function",
	                fn: function(e, t) {
	                    return t.resolution / t.dataResolution * t.tileRatio;
	                }
	            }, {
	                name: "projViewModelMatrix",
	                type: "function",
	                fn: function(e, n) {
	                    return multiply$5(t, n.projViewMatrix, n.modelMatrix);
	                }
	            } ],
	            extraCommandProps: J$1({}, e && e.extraCommandProps || {}, {
	                blend: {
	                    enable: !0,
	                    func: {
	                        src: "one",
	                        dst: "one"
	                    },
	                    equation: "add"
	                }
	            })
	        });
	    }
	}

	var wn = [ -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, 1 ], On = "#if __VERSION__ == 100\n#ifdef GL_EXT_shader_texture_lod\n#extension GL_EXT_shader_texture_lod : enable\n#define textureCubeLod(tex, uv, lod) textureCubeLodEXT(tex, uv, lod)\n#else\n#define textureCubeLod(tex, uv, lod) textureCube(tex, uv, lod)\n#endif\n#else\n#define textureCubeLod(tex, uv, lod) textureLod(tex, uv, lod)\n#endif\nprecision highp float;\n#include <gl2_frag>\n#include <hsv_frag>\nuniform vec3 hsv;\nvarying vec3 vWorldPos;\n#ifdef USE_AMBIENT\nuniform vec3 diffuseSPH[9];\n#else\nuniform samplerCube cubeMap;\nuniform float bias;\nuniform float size;\n#endif\nuniform float environmentExposure;\n#if defined(INPUT_RGBM) || defined(ENC_RGBM)\nuniform float rgbmRange;\n#endif\nvec4 c(const in vec3 d, const in float e) {\n  if(e <= .0)\n    return vec4(d, 1.);\n  vec4 f;\n  vec3 h = d / e;\n  f.a = clamp(max(max(h.r, h.g), max(h.b, 1e-6)), .0, 1.);\n  f.a = ceil(f.a * 255.) / 255.;\n  f.rgb = h / f.a;\n  return f;\n}\nvec3 i(const in vec4 d, const in float e) {\n  if(e <= .0)\n    return d.rgb;\n  return e * d.rgb * d.a;\n}\nvec4 j(const in samplerCube k, const in vec3 l, const in float m, const in float n) {\n  vec3 o = l;\n  return textureCubeLod(k, o, n);\n}\nvec3 u(const in vec3 v, const in vec3 A[9]) {\n  float x = v.x;\n  float y = v.y;\n  float z = v.z;\n  vec3 B = (A[0] + A[1] * x + A[2] * y + A[3] * z + A[4] * z * x + A[5] * y * z + A[6] * y * x + A[7] * (3. * z * z - 1.) + A[8] * (x * x - y * y));\n  return max(B, vec3(.0));\n}\nfloat C(const in vec2 D) {\n  vec3 E = fract(vec3(D.xyx) * .1031);\n  E += dot(E, E.yzx + 19.19);\n  return fract((E.x + E.y) * E.z);\n}\nvoid main() {\n  vec4 F;\n#ifdef USE_AMBIENT\nvec3 v = normalize(vWorldPos + mix(-.5 / 255., .5 / 255., C(gl_FragCoord.xy)) * 2.);\n  F = vec4(u(v, diffuseSPH), 1.);\n  if(length(hsv) > .0) {\n    F.rgb = hsv_apply(F.rgb, hsv);\n  }\n#ifdef ENC_RGBM\nF = c(F.rgb, rgbmRange);\n#endif\n#else\nF = j(cubeMap, normalize(vWorldPos), size, bias);\n#endif\nF.rgb *= environmentExposure;\n#ifdef ENC_RGBM\n#if !defined(USE_AMBIENT) && defined(INPUT_RGBM)\nif(length(hsv) > .0) {\n    F.rgb = hsv_apply(i(F, rgbmRange).rgb, hsv);\n    F = c(F.rgb, rgbmRange);\n  }\n#endif\nglFragColor = vec4(clamp(F.rgb, .0, 1.), 1.);\n#elif !defined(USE_AMBIENT) && defined(INPUT_RGBM)\nglFragColor = vec4(i(F, rgbmRange), 1.);\n  if(length(hsv) > .0) {\n    glFragColor.rgb = hsv_apply(clamp(glFragColor.rgb, .0, 1.), hsv);\n  }\n#else\nif(length(hsv) > .0) {\n    F.rgb = hsv_apply(F.rgb, hsv);\n  }\n  glFragColor = F;\n#endif\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}";

	class Cn extends Wt {
	    constructor() {
	        super({
	            vert: "#include <gl2_vert>\nattribute vec3 aPosition;\nuniform mat4 projMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 transformMatrix;\nvarying vec3 vWorldPos;\nvoid main() {\n  vWorldPos = aPosition;\n  mat4 c = mat4(mat3(viewMatrix) * transformMatrix);\n  vec4 d = projMatrix * c * vec4(vWorldPos, 1.);\n  gl_Position = d.xyww;\n}",
	            frag: On,
	            extraCommandProps: {
	                depth: {
	                    enable: !0,
	                    range: [ 1, 1 ],
	                    func: "lequal"
	                },
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.resolution[0],
	                    height: (e, t) => t.resolution[1]
	                }
	            }
	        }), this.version = 300;
	    }
	    setMode(e, t, n) {
	        const r = {};
	        return e && (r.INPUT_RGBM = 1), t && (r.ENC_RGBM = 1), 0 === n && (r.USE_AMBIENT = 1), 
	        this._skyboxMesh ? this._skyboxMesh[0].setDefines(r) : this._meshDefines = r, this;
	    }
	    draw(e) {
	        return this._skyboxMesh || this._createSkyboxMesh(e), super.draw(e, this._skyboxMesh);
	    }
	    _createSkyboxMesh(e) {
	        const t = new ke({
	            aPosition: new Int8Array(wn)
	        }, null, wn.length / 3);
	        t.generateBuffers(e), this._skyboxMesh = [ new et$1(t) ], this._meshDefines && (this._skyboxMesh[0].setDefines(this._meshDefines), 
	        delete this._meshDefines);
	    }
	    dispose() {
	        if (this._skyboxMesh) {
	            const e = this._skyboxMesh[0];
	            e.geometry.dispose(), e.dispose();
	        }
	        return delete this._skyboxMesh, super.dispose();
	    }
	}

	class Pn extends Wt {
	    constructor(e) {
	        const t = {
	            blend: {
	                enable: !0,
	                func: {
	                    src: "one",
	                    dst: "one minus src alpha"
	                },
	                equation: "add"
	            },
	            viewport: {
	                x: 0,
	                y: 0,
	                width: (e, t) => t.inputTexture.width,
	                height: (e, t) => t.inputTexture.height
	            }
	        };
	        e && e.extraCommandProps && J$1(t, e.extraCommandProps);
	        const n = [], i = [];
	        super({
	            vert: "#define SHADER_NAME HEATMAP_DISPLAY\nuniform mat4 projViewModelMatrix;\nattribute vec3 aPosition;\nvoid main() {\n  gl_Position = projViewModelMatrix * vec4(aPosition, 1.);\n}",
	            frag: "#define SHADER_NAME HEATMAP_DISPLAY\nprecision mediump float;\nuniform sampler2D inputTexture;\nuniform sampler2D colorRamp;\nuniform vec2 textureOutputSize;\nuniform float heatmapOpacity;\nvoid main() {\n  vec2 c = gl_FragCoord.xy / textureOutputSize.xy;\n  float t = texture2D(inputTexture, c).r;\n  vec4 d = texture2D(colorRamp, vec2(t, .5));\n  gl_FragColor = d * heatmapOpacity;\n}",
	            uniforms: [ {
	                name: "projViewModelMatrix",
	                type: "function",
	                fn: function(e, t) {
	                    return multiply$5(n, t.projViewMatrix, t.modelMatrix);
	                }
	            }, {
	                name: "textureOutputSize",
	                type: "function",
	                fn: function(e) {
	                    return i[0] = e.drawingBufferWidth, i[1] = e.drawingBufferHeight, i;
	                }
	            } ],
	            extraCommandProps: t
	        });
	    }
	}

	class In extends Wt {
	    constructor(e = {}) {
	        super({
	            vert: "precision highp float;\nprecision highp sampler2D;\nconst float c = 3.141592653589793;\nuniform mat4 projMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 modelMatrix;\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nattribute vec3 aNormal;\nvarying vec2 vuv;\nvarying vec3 vpos;\nvarying vec3 vnormal;\nvarying mat3 vtbnMatrix;\nvec4 d(mat4 e, mat4 f, vec3 h) {\n  return e * modelMatrix * f * vec4(h, 1.);\n}\nvec3 i(in vec3 h, in vec3 j) {\n  return normalize(h + j);\n}\nmat3 k(in vec3 l) {\n  vec3 t = normalize(cross(vec3(.0, .0, 1.), l));\n  vec3 b = normalize(cross(l, t));\n  return mat3(t, b, l);\n}\nvoid m() {\n  \n}\nvoid main(void) {\n  vuv = aTexCoord;\n  vpos = (modelMatrix * vec4(aPosition, 1.)).xyz;\n  vnormal = aNormal;\n  vtbnMatrix = k(vnormal);\n  gl_Position = d(projMatrix, viewMatrix, vpos);\n  m();\n}",
	            frag: "precision highp float;\nprecision highp sampler2D;\nuniform sampler2D texWaveNormal;\nuniform sampler2D texWavePerturbation;\nuniform vec3 octaveTextureRepeat;\nuniform vec4 waveParams;\nuniform vec2 waveDirection;\nuniform vec4 waterColor;\nuniform vec3 lightingDirection;\nuniform vec3 lightingIntensity;\nuniform vec3 camPos;\nuniform float timeElapsed;\nvarying vec2 vuv;\nvarying vec3 vpos;\nvarying vec3 vnormal;\nvarying mat3 vtbnMatrix;\nconst vec2 c = vec2(6. / 25., 5. / 24.);\nvec2 d(sampler2D e, vec2 f) {\n  return 2. * texture2D(e, f).rg - 1.;\n}\nfloat h(vec2 f) {\n  return texture2D(texWavePerturbation, f).b;\n}\nvec3 i(sampler2D e, vec2 f) {\n  return 2. * texture2D(e, f).rgb - 1.;\n}\nfloat j(vec2 f, float k) {\n  return fract(k);\n}\nfloat l(vec2 f, float k) {\n  float m = j(f, k);\n  return 1. - abs(1. - 2. * m);\n}\nvec3 n(sampler2D o, vec2 f, float k, float u) {\n  float v = waveParams[2];\n  float A = waveParams[3];\n  vec2 B = d(o, f) * v;\n  float m = j(f, k + u);\n  float C = l(f, k + u);\n  vec2 D = f;\n  D -= B * (m + A);\n  D += u;\n  D += (k - m) * c;\n  return vec3(D, C);\n}\nconst float E = .3737;\nconst float F = 7.77;\nvec3 G(sampler2D H, sampler2D I, vec2 f, vec2 J, float k) {\n  float K = waveParams[0];\n  vec2 L = k * -J;\n  float M = h(f * E) * F;\n  vec3 N = n(I, f + L, k + M, .0);\n  vec3 O = n(I, f + L, k + M, .5);\n  vec3 P = i(H, N.xy) * N.z;\n  vec3 Q = i(H, O.xy) * O.z;\n  vec3 R = normalize(P + Q);\n  R.xy *= K;\n  R.z = sqrt(1. - dot(R.xy, R.xy));\n  return R;\n}\nvec3 S(vec2 f, float k) {\n  float T = waveParams[1];\n  return G(texWaveNormal, texWavePerturbation, f * T, waveDirection, k);\n}\nconst float U = 3.141592653589793;\nconst float V = 1. / U;\nconst float W = .3183098861837907;\nconst float X = 1.570796326794897;\nstruct PBRShadingWater {\n  float NdotL;\n  float NdotV;\n  float NdotH;\n  float VdotH;\n  float LdotH;\n  float VdotN;\n};\nfloat Y = 2.2;\nvec3 Z(float ba, vec3 bb, float bc) {\n  return bb + (bc - bb) * pow(1. - ba, 5.);\n}\nfloat bd(float be, float bf) {\n  float bg = bf * bf;\n  float bh = be * be;\n  float bi = pow((bh * (bg - 1.) + 1.), Y) * U;\n  return bg / bi;\n}\nfloat bj(float bk) {\n  return .25 / (bk * bk);\n}\nvec3 bl(in PBRShadingWater bm, float bf, vec3 bn, float bo) {\n  vec3 bp = Z(bm.VdotH, bn, bo);\n  float bq = bd(bm.NdotH, bf);\n  float br = bj(bm.LdotH);\n  return (bq * br) * bp;\n}\nvec3 bs(const vec3 x) {\n  return (x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14);\n}\nconst float bt = 2.2;\nconst float bu = .4545454545;\nvec4 bv(vec4 bw) {\n  return vec4(pow(bw.rgb, vec3(bu)), bw.w);\n}\nvec3 bx(vec3 bw) {\n  return pow(bw, vec3(bt));\n}\nconst vec3 by = vec3(.02, 1., 5.);\nconst vec2 bz = vec2(.02, .1);\nconst float bf = .06;\nconst vec3 bA = vec3(0, .6, .9);\nconst vec3 bB = vec3(.72, .92, 1.);\nPBRShadingWater bC;\nvec3 bD(in float bE, in vec3 bF, in vec3 bG) {\n  float bH = pow((1. - bE), by[2]);\n  return mix(bG, bF, bH);\n}\nvec3 bI(in vec3 bJ, in vec3 bK, in vec3 bL, vec3 bw, in vec3 bM, in vec3 bN, in float bO) {\n  vec3 bP = bx(bw);\n  vec3 bQ = normalize(bL + bK);\n  bC.NdotL = clamp(dot(bJ, bL), .0, 1.);\n  bC.NdotV = clamp(dot(bJ, bK), .001, 1.);\n  bC.VdotN = clamp(dot(bK, bJ), .001, 1.);\n  bC.NdotH = clamp(dot(bJ, bQ), .0, 1.);\n  bC.VdotH = clamp(dot(bK, bQ), .0, 1.);\n  bC.LdotH = clamp(dot(bL, bQ), .0, 1.);\n  float bR = max(dot(bN, bK), .0);\n  vec3 bS = bx(bB);\n  vec3 bT = bx(bA);\n  vec3 bB = bD(bR, bS, bT);\n  float bU = max(dot(bN, bL), .0);\n  bB *= .1 + bU * .9;\n  float bV = clamp(bO, .8, 1.);\n  vec3 bW = Z(bC.VdotN, vec3(by[0]), by[1]) * bB * bV;\n  vec3 bX = bP * mix(bB, bU * bM * V, 2. / 3.) * bV;\n  vec3 bY = vec3(.0);\n  if(bR > .0 && bU > .0) {\n    vec3 bZ = bl(bC, bf, vec3(bz[0]), bz[1]);\n    vec3 ca = bM * V * bO;\n    bY = bC.NdotL * ca * bZ;\n  }\n  return bs(bW + bX + bY);\n}\nvoid main() {\n  vec3 bN = vnormal;\n  vec3 cb = S(vuv, timeElapsed);\n  vec3 bJ = normalize(vtbnMatrix * cb);\n  vec3 bK = -normalize(vpos - camPos);\n  vec3 bL = normalize(-lightingDirection);\n  float bO = 1.;\n  vec4 cc = vec4(bI(bJ, bK, bL, waterColor.rgb, lightingIntensity, bN, bO), waterColor.w);\n  gl_FragColor = bv(cc);\n}",
	            defines: e.defines || {},
	            extraCommandProps: e.extraCommandProps || {}
	        });
	    }
	}

	class Dn extends rn {
	    constructor() {
	        super({
	            vert: en,
	            frag: "precision highp float;\nuniform sampler2D texture;\nuniform vec2 size;\nuniform float enableSharpen;\nuniform float sharpFactor;\nuniform float pixelRatio;\nvec2 c;\nvec3 d(const in vec3 e, const float f) {\n  vec2 h = pixelRatio / size.xy;\n  float i = .0;\n  vec4 j = texture2D(texture, c + h * vec2(-1., -1.));\n  j.rgb = mix(vec3(.0), j.rgb, sign(j.a));\n  i += mix(.0, 1., sign(j.a));\n  vec4 k = texture2D(texture, c + h * vec2(1.));\n  k.rgb = mix(vec3(.0), k.rgb, sign(k.a));\n  i += mix(.0, 1., sign(k.a));\n  vec4 l = texture2D(texture, c + h * vec2(1., -1.));\n  l.rgb = mix(vec3(.0), l.rgb, sign(l.a));\n  i += mix(.0, 1., sign(l.a));\n  vec4 m = texture2D(texture, c + h * vec2(-1., 1.));\n  m.rgb = mix(vec3(.0), m.rgb, sign(m.a));\n  i += mix(.0, 1., sign(m.a));\n  return e + f * (i * e - j.rgb - l.rgb - m.rgb - k.rgb);\n}\nvoid main() {\n  c = gl_FragCoord.xy / size;\n  vec4 e = texture2D(texture, c);\n  if(enableSharpen == 1.) {\n    e.rgb = d(e.rgb, sharpFactor);\n  }\n  gl_FragColor = e;\n}",
	            extraCommandProps: {
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.size[0],
	                    height: (e, t) => t.size[1]
	                }
	            }
	        });
	    }
	    getMeshCommand(e, t) {
	        return this.commands.copy || (this.commands.copy = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.copy;
	    }
	}

	const Nn = [];

	class Fn {
	    constructor(e, t, n) {
	        this._regl = e, this.joints = t, this.inverseBindMatrices = [], this.jointMatrices = [], 
	        this.jointData = new Float32Array(16 * t.length);
	        for (let e = 0; e < t.length; ++e) this.inverseBindMatrices.push(new Float32Array(n.buffer, n.byteOffset + 16 * Float32Array.BYTES_PER_ELEMENT * e, 16)), 
	        this.jointMatrices.push(new Float32Array(this.jointData.buffer, 16 * Float32Array.BYTES_PER_ELEMENT * e, 16));
	        this.jointTexture = e.texture(), this.jointTextureSize = [ 4, 6 ];
	    }
	    updateJointTexture(e) {
	        this.jointTexture || this.jointTexture.texture({
	            width: 4,
	            height: e
	        });
	    }
	    setJointTexture(e) {
	        this.jointTexture = e;
	    }
	    update(e) {
	        invert$2(Nn, e);
	        for (let e = 0; e < this.joints.length; ++e) {
	            const t = this.jointMatrices[e];
	            multiply$5(t, Nn, this.joints[e].nodeMatrix), multiply$5(t, t, this.inverseBindMatrices[e]);
	        }
	        this.jointTexture({
	            width: 4,
	            type: "float",
	            height: this.joints.length,
	            data: this.jointData
	        });
	    }
	    dispose() {
	        this.jointTexture.destroy();
	    }
	}

	const Rn = [ 0, 0, 0 ], Bn = [ 0, 0, 0, 1 ], Ln = [ 1, 1, 1 ], Hn = [];

	class zn {
	    constructor(e = [ 0, 0, 0 ], t = [ 0, 0, 0, 1 ], n = [ 1, 1, 1 ]) {
	        this.translation = e, this.rotation = t, this.scale = n;
	    }
	    getMatrix() {
	        return fromRotationTranslationScale(Hn, this.rotation, this.translation, this.scale);
	    }
	    decompose(e) {
	        getTranslation$1(this.translation, e), getRotation(this.rotation, e), getScaling(this.scale, e);
	    }
	    update(n) {
	        n && (n.translation && !equals$4(n.translation, Rn) && copy$4(this.translation, n.translation), 
	        n.rotation && !equals$2(n.rotation, Bn) && copy$2(this.rotation, n.rotation), n.scale && !equals$4(n.scale, Ln) && copy$4(this.scale, n.scale));
	    }
	}

	class kn {
	    constructor(e) {
	        this._init(e);
	    }
	    _init(e) {
	        this.geometry = e.geometry, this.nodeMatrix = e.nodeMatrix, this.materialInfo = e.materialInfo, 
	        this.extraInfo = e.extraInfo, this.animationMatrix = e.animationMatrix, this.morphWeights = e.morphWeights, 
	        this.skin = e.skin;
	    }
	    copy() {
	        this.copyGeometry || (this.copyGeometry = this._copyGeometry(this.geometry));
	    }
	    createCopyBarycentric() {
	        this.copyGeometry && !this.copyGeometry.data.aBarycentric && (this.copyGeometry.buildUniqueVertex(), 
	        this.copyGeometry.createBarycentric("aBarycentric"));
	    }
	    _copyGeometry(e) {
	        const t = e.data, n = e.elements, r = {};
	        for (const n in t) if (ee(t[n])) r[n] = t[n].slice(); else if (t[n].buffer && t[n].buffer.destroy) r[n] = {
	            buffer: t[n].buffer
	        }, ee(t[n].array) && (r[n].array = t[n].array.slice()); else {
	            const t = e._getAttributeData(n);
	            r[n] = n !== e.desc.positionAttribute ? t : t.slice();
	        }
	        const i = void 0 !== n.length ? n.slice() : n, o = e.count, s = JSON.parse(JSON.stringify(e.desc)), a = new ke(r, i, o, s);
	        return a.properties = e.properties, a;
	    }
	}

	let Vn = 0;

	class jn {
	    constructor(e, t) {
	        this.gltf = e, this.regl = t, this.geometries = [], t && (this._emptyTexture = t.texture({
	            width: 2,
	            height: 2
	        }));
	    }
	    getMeshesInfo() {
	        if (!this.gltf) return null;
	        if (this.geometries.length) return this.geometries;
	        this._createTextures(this.gltf.textures), this._createSkins(this.gltf.skins);
	        return this.gltf.scenes[0].nodes.forEach(e => {
	            this._parserNode(e, this.geometries);
	        }), this.geometries;
	    }
	    _createSkins(e) {
	        if (e) {
	            this._skinMap = {};
	            for (let t = 0; t < e.length; t++) {
	                const n = e[t];
	                n.joints = n.joints.map(e => this.gltf.nodes[e]), this._skinMap[t] = new Fn(this.regl, n.joints, n.inverseBindMatrices.array), 
	                delete n.inverseBindMatrices;
	            }
	        }
	    }
	    _createTextures(e) {
	        if (e) {
	            this._textureMap = {};
	            for (let t = 0; t < e.length; t++) {
	                const n = e[t];
	                this._textureMap[t] || (this._textureMap[t] = this._toTexture(n), delete n.image);
	            }
	        }
	    }
	    dispose() {
	        this._emptyTexture && this._emptyTexture.destroy();
	        const e = this.getMeshesInfo();
	        if (e) {
	            e.forEach(e => {
	                e.geometry.dispose();
	                for (const t in e.materialInfo) {
	                    const n = e.materialInfo[t];
	                    n.destroy && !n[de] && n.destroy();
	                }
	            });
	            for (const e in this._textureMap) {
	                const t = this._textureMap[e];
	                t.destroy && !t[de] && t.destroy();
	            }
	            for (const e in this._skinMap) {
	                const t = this._skinMap[e];
	                t.jointTexture && !t.jointTexture[de] && t.jointTexture.destroy();
	            }
	            for (const e in this.gltf.nodes) {
	                const t = this.gltf.nodes[e];
	                t.skin && t.skin.jointTexture && !t.skin.jointTexture[de] && t.skin.jointTexture.destroy();
	            }
	            delete this.gltf;
	        }
	    }
	    updateAnimation(e, t, n, r) {
	        const i = this.gltf;
	        if (!i) return;
	        if (Vn = i.animations ? k$1.getAnimationTimeSpan(i, r) : null, !Vn) return;
	        const o = t ? e * n * .001 % (Vn.max - Vn.min) + Vn.min : e * n * .001 + Vn.min;
	        this._startTime || (this._startTime = e), i.scenes[0].nodes.forEach(e => {
	            this._updateNodeMatrix(r, o, e);
	        });
	        for (const e in this.gltf.nodes) {
	            const t = this.gltf.nodes[e];
	            t.skin && t.skin.update(t.nodeMatrix);
	        }
	    }
	    isFirstLoop(e, t, n) {
	        const r = this.gltf;
	        return !this._startTime || !r || (Vn = r.animations ? k$1.getAnimationTimeSpan(r, n) : null, 
	        (e - this._startTime) * t * .001 / (Vn.max - Vn.min) < 1);
	    }
	    hasSkinAnimation() {
	        return !!this._isAnimation;
	    }
	    _updateNodeMatrix(e, t, n, i) {
	        if (n.trs) {
	            const r = k$1.getAnimationClip(this.gltf, Number(n.nodeIndex), t, e);
	            r.weights && this._updateMorph(n, r.weights), n.trs.update(r);
	        }
	        i ? multiply$5(n.nodeMatrix, i, n.matrix || n.trs.getMatrix()) : copy$5(n.nodeMatrix, n.matrix || n.trs.getMatrix());
	        const o = n.nodeMatrix;
	        n.children && n.children.forEach(n => {
	            this._updateNodeMatrix(e, t, n, o);
	        }), this._updateSkinTexture(n);
	    }
	    _updateMorph(e, t) {
	        const n = t.length;
	        if (!e.influencesList) {
	            e.influencesList = [];
	            for (let t = 0; t < n; t++) e.influencesList[t] = [ t, 0 ];
	        }
	        const r = e.influencesList;
	        for (let e = 0; e < r.length; e++) {
	            const n = r[e];
	            n[0] = e, n[1] = t[e];
	        }
	        r.sort(Gn);
	        const i = [];
	        for (let e = 0; e < 8; e++) i[e] = [ e, 0 ];
	        for (let e = 0; e < 8; e++) e < n && r[e][1] ? (i[e][0] = r[e][0], i[e][1] = r[e][1]) : (i[e][0] = Number.MAX_SAFE_INTEGER, 
	        i[e][1] = 0);
	        i.sort(Un);
	        e.geometries.forEach(e => {
	            const t = e.properties.morphTargets;
	            for (let n = 0; n < 8; n++) {
	                const r = i[n], o = r[0], s = r[1];
	                o !== Number.MAX_SAFE_INTEGER && s ? (e.updateData("POSITION" + n, t["POSITION_" + o].array), 
	                e.properties.morphWeights[n] = s) : e.properties.morphWeights[n] = 0;
	            }
	        });
	    }
	    _updateSkinTexture(e) {
	        if (!this.gltf.joints) return;
	        const t = this.gltf.animations;
	        if (!t) return;
	        const n = this.gltf.joints.length;
	        t.forEach(t => {
	            const r = t.channels;
	            for (let t = 0; t < r.length; t++) {
	                if (r[t].target.node === e.nodeIndex) {
	                    e.skin.updateJointTexture(n);
	                }
	            }
	        });
	    }
	    _parserNode(e, t, n) {
	        if (e.isParsed) return;
	        e.nodeMatrix = e.nodeMatrix || identity$2([]), e.localMatrix = e.localMatrix || identity$2([]), 
	        e.matrix ? (e.trs = new zn, e.trs.decompose(e.matrix)) : e.trs = new zn(e.translation, e.rotation, e.scale), 
	        e.localMatrix = e.trs.getMatrix(), n ? multiply$5(e.nodeMatrix, n, e.matrix || e.localMatrix) : copy$5(e.nodeMatrix, e.matrix || e.localMatrix);
	        const i = e.nodeMatrix;
	        if (e.children) for (let n = 0; n < e.children.length; n++) {
	            this._parserNode(e.children[n], t, i);
	        }
	        if (W$1(e.skin)) {
	            this._isAnimation = !0;
	            const t = e.skin;
	            e.trs = new zn, e.skin = this._skinMap[t];
	        }
	        if (W$1(e.mesh)) {
	            e.mesh = this.gltf.meshes[e.mesh], e.mesh.node = e, e.geometries = e.geometries || [], 
	            e.mesh.primitives.forEach(n => {
	                const r = function(e, t) {
	                    const n = e.attributes, r = n.COLOR_0;
	                    if (r && r.array instanceof Float32Array) {
	                        const e = new Uint8Array(r.array.length);
	                        for (let t = 0; t < e.length; t++) e[t] = Math.round(255 * r.array[t]);
	                        r.array = e;
	                    }
	                    const i = {};
	                    for (const e in n) i[e] = J$1({}, n[e]), t && (i[e].buffer = It(t, n[e], {
	                        dimension: n[e].itemSize
	                    }));
	                    if (e.morphTargets) {
	                        const e = fe(i.POSITION) ? i.POSITION.itemSize * i.POSITION.count : i.POSITION.array.length;
	                        for (let t = 0; t < 8; t++) i["POSITION" + t] || (i["POSITION" + t] = new Float32Array(e).fill(0));
	                        for (let e = 0; e < 4; e++) {
	                            const t = i.NORMAL.array ? i.NORMAL.array.length : i.NORMAL.length;
	                            i["NORMAL" + e] || (i["NORMAL" + e] = new Float32Array(t).fill(0));
	                        }
	                    }
	                    let o = e.indices;
	                    o && void 0 === o.bufferView && o.array && (o = o.array);
	                    const s = new ke(i, o, 0, {
	                        primitive: Q$1(e.mode) ? bt(e.mode) : e.mode,
	                        positionAttribute: "POSITION",
	                        normalAttribute: "NORMAL",
	                        uv0Attribute: "TEXCOORD_0",
	                        uv1Attribute: "TEXCOORD_1",
	                        color0Attribute: "COLOR_0"
	                    });
	                    e.morphTargets && (s.properties.morphWeights = []);
	                    e.mode > 3 && !s.data.NORMAL && s.createNormal("NORMAL");
	                    return s;
	                }(n, this.regl);
	                r.properties.morphTargets = n.morphTargets, e.geometries.push(r);
	                const o = this._createMaterialInfo(n.material), s = {
	                    geometry: r,
	                    nodeMatrix: i,
	                    materialInfo: o,
	                    extraInfo: this._createExtralInfo(n.material),
	                    animationMatrix: e.trs.getMatrix(),
	                    morphWeights: e.weights
	                };
	                e.skin && (s.skin = {
	                    jointTextureSize: [ 4, 6 ],
	                    numJoints: e.skin.joints.length,
	                    jointTexture: e.skin.jointTexture
	                });
	                const a = new kn(s);
	                t.push(a);
	            });
	        }
	        e.isParsed = !0;
	    }
	    _createMaterialInfo(e) {
	        const t = {};
	        if (this.gltf.materials && this.gltf.materials[e]) {
	            const n = this.gltf.materials[e], r = n.pbrMetallicRoughness;
	            if (r) {
	                const e = r.metallicRoughnessTexture, n = r.baseColorTexture;
	                n && (t.baseColorTexture = this._getTexture(n)), r.baseColorFactor && (t.baseColorFactor = r.baseColorFactor), 
	                e ? t.metallicRoughnessTexture = this._getTexture(e) : (W$1(r.metallicFactor) && (t.metallicFactor = r.metallicFactor), 
	                W$1(r.roughnessFactor) && (t.roughnessFactor = r.roughnessFactor));
	            }
	            const i = n.extensions;
	            if (i && i.KHR_materials_pbrSpecularGlossiness) {
	                const e = i.KHR_materials_pbrSpecularGlossiness;
	                t.name = "pbrSpecularGlossiness";
	                for (const n in e) t[n] = W$1(e[n].index) ? this._getTexture(e[n]) : e[n];
	            }
	            n.normalTexture && (t.normalTexture = this._getTexture(n.normalTexture)), n.occlusionTexture && (t.occlusionTexture = this._getTexture(n.occlusionTexture)), 
	            n.emissiveTexture && (t.emissiveTexture = this._getTexture(n.emissiveTexture)), 
	            n.emissiveFactor && (t.emissiveFactor = n.emissiveFactor), t.alphaCutoff = n.alphaCutoff || .5;
	        }
	        return t;
	    }
	    _createExtralInfo(e) {
	        const t = {};
	        if (this.gltf.materials && this.gltf.materials[e]) {
	            const n = this.gltf.materials[e];
	            t.doubleSided = n.doubleSided, t.alphaMode = n.alphaMode || "OPAQUE";
	        }
	        return t;
	    }
	    _getTexture(e) {
	        const t = e.extensions, n = e.index;
	        if (!W$1(n)) return null;
	        t && t.KHR_texture_transform && (e.KHR_texture_transform = t.KHR_texture_transform);
	        const r = this._textureMap[n];
	        return r.texInfo = e, r;
	    }
	    _toTexture(e) {
	        if (!e) return this._emptyTexture;
	        const t = e.sampler || {};
	        return new Ft({
	            width: e.image.width,
	            height: e.image.height,
	            data: e.image.array,
	            mag: St(t.magFilter) || "linear",
	            min: Et(t.minFilter) || "linear",
	            wrapS: Ot(t.wrapS) || "repeat",
	            wrapT: Ot(t.wrapT) || "repeat"
	        });
	    }
	}

	function Un(e, t) {
	    return e[0] - t[0];
	}

	function Gn(e, t) {
	    return Math.abs(t[1]) - Math.abs(e[1]);
	}

	function Xn(e) {
	    const t = e.lastIndexOf("/"), n = e.slice(0, t), r = e.slice(e.lastIndexOf(".")).toLowerCase();
	    return ".gltf" === r ? function(e, t) {
	        return T$2.getJSON(e, t);
	    }(e, {}).then(e => Wn(n, e)) : ".glb" === r ? function(e, t) {
	        return T$2.getArrayBuffer(e, t);
	    }(e, {}).then(e => Wn(n, {
	        buffer: e.data,
	        byteOffset: 0
	    })) : null;
	}

	function qn(e, t) {
	    return new jn(e, t);
	}

	function Wn(e, t) {
	    return new k$1(e, t).load();
	}

	var Kn = Object.freeze({
	    __proto__: null,
	    load: Xn,
	    exportGLTFPack: qn
	});

	class Yn {
	    constructor(e) {
	        this.regl = e, this.resourceMap = {};
	    }
	    getGLTF(e) {
	        return this.resourceMap[e];
	    }
	    loginGLTF(e, t) {
	        this.resourceMap[e] ? this.resourceMap[e].refCount += 1 : (this.resourceMap[e] = t ? this._exportGLTFResource(t, e) : this._loadGLTFModel(e).catch(e => e), 
	        this.resourceMap[e].refCount = 1);
	    }
	    logoutGLTF(e) {
	        if (this.resourceMap[e] && (this.resourceMap[e].refCount -= 1, this.resourceMap[e].refCount < 1)) {
	            const t = this.resourceMap[e].resources;
	            if (t) for (let e = 0; e < t.length; e++) t[e].geometry.dispose(), t[e].copyGeometry && t[e].copyGeometry.dispose(), 
	            t[e].material && t[e].material.dispose();
	            this.resourceMap[e].gltfPack && this.resourceMap[e].gltfPack.dispose(), delete this.resourceMap[e];
	        }
	    }
	    _exportGLTFResource(e, t) {
	        const n = qn(e, this.regl), r = n.getMeshesInfo();
	        return {
	            gltfPack: n,
	            resources: r,
	            json: e,
	            refCount: this.resourceMap[t] ? this.resourceMap[t].refCount : 0
	        };
	    }
	    _loadData(e) {
	        return Xn(e).then(e => e);
	    }
	    _loadGLTFModel(e) {
	        return this._loadData(e).then(t => (this.resourceMap[e] = this._exportGLTFResource(t, e), 
	        this.resourceMap[e]));
	    }
	}

	const Jn = function() {
	    const e = [ 0, 0, 0 ], t = [ lookAt([], e, [ 1, 0, 0 ], [ 0, -1, 0 ]), lookAt([], e, [ -1, 0, 0 ], [ 0, -1, 0 ]), lookAt([], e, [ 0, 1, 0 ], [ 0, 0, 1 ]), lookAt([], e, [ 0, -1, 0 ], [ 0, 0, -1 ]), lookAt([], e, [ 0, 0, 1 ], [ 0, -1, 0 ]), lookAt([], e, [ 0, 0, -1 ], [ 0, -1, 0 ]) ], n = 90 * Math.PI / 180, i = [ 0, 0, 0, 0 ], o = new Array(16);
	    return function(e, s, a, c, l) {
	        const f = {
	            context: {
	                viewMatrix: function(e, n, r) {
	                    return t[r];
	                },
	                projMatrix: perspective(o, n, 1, .5, 1.1)
	            }
	        };
	        s && (f.framebuffer = s.faces ? function(e, t, n) {
	            return s.faces[n];
	        } : s);
	        return e(f)(6, (t, n, r) => {
	            const o = {
	                color: i,
	                depth: 1
	            };
	            s && (o.framebuffer = s.faces ? s.faces[r] : s), e.clear(o), a(c), l && l();
	        }), s;
	    };
	}();

	var Zn = {
	    vertices: [ 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1 ],
	    textures: [ 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0 ],
	    indices: [ 0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23 ]
	}, Qn = "attribute vec3 aPosition;\nvarying vec3 vWorldPos;\nuniform mat4 projMatrix;\nuniform mat4 viewMatrix;\nvoid main() {\n  vWorldPos = aPosition;\n  gl_Position = projMatrix * viewMatrix * vec4(vWorldPos, 1.);\n}", $n = "precision highp float;\n#define PI 3.1415926\nvarying vec3 vWorldPos;\nuniform sampler2D equirectangularMap;\nconst vec2 c = vec2(.1591, .3183);\nvec2 d(vec3 e) {\n  vec2 f = vec2(atan(e.y, e.x), asin(e.z));\n  f *= c;\n  f += .5;\n  return f;\n}\nvec3 h(const in vec4 i, const in float j) {\n  return j * i.rgb * i.a;\n}\nvec4 k(const in vec3 i, const in float j) {\n  vec4 l;\n  vec3 m = i / j;\n  l.a = clamp(max(max(m.r, m.g), max(m.b, 1e-6)), .0, 1.);\n  l.a = ceil(l.a * 255.) / 255.;\n  l.rgb = m / l.a;\n  return l;\n}\nvoid main() {\n  vec2 f = d(normalize(vWorldPos));\n  vec4 i = texture2D(equirectangularMap, f);\n#ifdef INPUT_RGBM\ngl_FragColor = i;\n#else\ngl_FragColor = vec4(h(i, 7.), 1.);\n#endif\n}";

	/*!
	 * from claygl
	 * https://github.com/pissang/claygl/
	 * License: BSD-2-Clause
	 */
	function er(e, t) {
	    var n = e[0], r = e[1], i = e[2];
	    return 0 === t ? 1 : 1 === t ? n : 2 === t ? r : 3 === t ? i : 4 === t ? n * i : 5 === t ? r * i : 6 === t ? n * r : 7 === t ? 3 * i * i - 1 : n * n - r * r;
	}

	var tr = {
	    px: [ 2, 1, 0, -1, -1, 1 ],
	    nx: [ 2, 1, 0, 1, -1, -1 ],
	    py: [ 0, 2, 1, 1, -1, -1 ],
	    ny: [ 0, 2, 1, 1, 1, 1 ],
	    pz: [ 0, 1, 2, -1, -1, -1 ],
	    nz: [ 0, 1, 2, 1, -1, 1 ]
	}, nr = [ "px", "nx", "py", "ny", "pz", "nz" ];

	const rr = Ht.compile(On);

	function ir(e, t, n) {
	    const r = e({
	        frag: rr,
	        vert: Qn,
	        attributes: {
	            aPosition: Zn.vertices
	        },
	        uniforms: {
	            projMatrix: e.context("projMatrix"),
	            viewMatrix: e.context("viewMatrix"),
	            cubeMap: t,
	            environmentExposure: 1,
	            bias: 0,
	            size: n,
	            hsv: [ 0, 0, 0 ]
	        },
	        elements: Zn.indices
	    }), i = [], o = e.framebuffer(n);
	    return Jn(e, o, r, {
	        size: n
	    }, (function() {
	        const t = e.read();
	        i.push(new t.constructor(t));
	    })), r.destroy(), o.destroy(), i;
	}

	const or = [ -1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0 ], sr = [ 0, 1, 0, 0, 1, 1, 1, 0 ];

	function ar(e, t, n, r) {
	    t = t || 256;
	    const i = cr(n = n || 1024, r = r || 256), o = e.texture({
	        data: i,
	        width: r,
	        height: n,
	        min: "nearest",
	        mag: "nearest"
	    }), s = e.buffer(or), a = e.buffer(sr), c = e.framebuffer({
	        radius: t,
	        colorType: "uint8",
	        colorFormat: "rgba",
	        min: "linear",
	        mag: "linear"
	    }), l = e({
	        frag: "precision mediump float;\nvarying vec2 vTexCoords;\nuniform sampler2D distributionMap;\nconst float c = 3.14159265359;\nvec4 d(float a, float b) {\n  a *= 65535.;\n  b *= 65535.;\n  vec4 rgba;\n  rgba[0] = mod(a, 255.);\n  rgba[1] = (a - rgba[0]) / 65280.0;\n  rgba[2] = mod(b, 255.);\n  rgba[3] = (b - rgba[2]) / 65280.0;\n  return rgba;\n}\nvec3 e(float f, vec3 h, float i) {\n  vec4 j = texture2D(distributionMap, vec2(i, f));\n  vec3 k = j.xyz;\n  float l = sign(j.w - .5);\n  float m = sign(j.w - clamp(l, .0, 1.) * 200.0 / 255. - .15);\n  k.x *= l;\n  k.y *= m;\n  vec3 n = abs(h.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 o = normalize(cross(n, h));\n  vec3 u = cross(h, o);\n  vec3 v = o * k.x + u * k.y + h * k.z;\n  return normalize(v);\n}\nfloat A(float B, float i) {\n  float a = i;\n  float C = (a * a) / 2.;\n  float D = B;\n  float E = B * (1. - C) + C;\n  return D / E;\n}\nfloat F(float B, float G, float i) {\n  float I = A(B, i);\n  float J = A(G, i);\n  return J * I;\n}\nvec2 K(float B, float i) {\n  vec3 L;\n  L.x = sqrt(1. - B * B);\n  L.y = .0;\n  L.z = B;\n  float M = .0;\n  float O = .0;\n  vec3 h = vec3(.0, .0, 1.);\n  const int P = 1024;\n  for(int Q = 0; Q < P; ++Q) {\n    vec3 k = e(float(Q) / float(P), h, i);\n    vec3 R = normalize(2. * dot(L, k) * k - L);\n    float G = max(R.z, .0);\n    float S = max(k.z, .0);\n    float T = max(dot(L, k), .0);\n    float B = max(dot(h, L), .0);\n    if(G > .0) {\n      float U = F(B, G, i);\n      float W = (U * T) / (S * B);\n      float X = pow(1. - T, 5.);\n      M += (1. - X) * W;\n      O += X * W;\n    }\n  }\n  M /= float(P);\n  O /= float(P);\n  return vec2(M, O);\n}\nvoid main() {\n  vec2 Y = K(vTexCoords.x, vTexCoords.y);\n  gl_FragColor = d(Y.x, Y.y);\n}",
	        vert: "attribute vec3 aPosition;\nattribute vec2 aTexCoord;\nvarying vec2 vTexCoords;\nvoid main() {\n  vTexCoords = aTexCoord;\n  gl_Position = vec4(aPosition, 1.);\n}",
	        attributes: {
	            aPosition: {
	                buffer: s
	            },
	            aTexCoord: {
	                buffer: a
	            }
	        },
	        uniforms: {
	            distributionMap: o
	        },
	        framebuffer: c,
	        viewport: {
	            x: 0,
	            y: 0,
	            width: t,
	            height: t
	        },
	        count: or.length / 3,
	        primitive: "triangle strip"
	    });
	    return l(), l.destroy(), s.destroy(), a.destroy(), o.destroy(), c;
	}

	function cr(e, t) {
	    const n = new Array(e * t * 4);
	    for (let r = 0; r < e; r++) {
	        const {x: i, y: o} = lr(r, e);
	        for (let e = 0; e < t; e++) {
	            const s = e / t, a = s * s, c = 2 * Math.PI * i, l = Math.sqrt((1 - o) / (1 + (a * a - 1) * o)), f = Math.sqrt(1 - l * l), u = 4 * (r * t + e), h = f * Math.cos(c), d = f * Math.sin(c);
	            n[u] = Math.abs(255 * h), n[u + 1] = Math.abs(255 * d), n[u + 2] = 255 * l, n[u + 3] = (h > 0 ? 200 : 0) + (d > 0 ? 55 : 0);
	        }
	    }
	    return n;
	}

	function lr(e, t) {
	    let n = (e << 16 | e >>> 16) >>> 0;
	    return n = ((1431655765 & n) << 1 | (2863311530 & n) >>> 1) >>> 0, n = ((858993459 & n) << 2 | (3435973836 & n) >>> 2) >>> 0, 
	    n = ((252645135 & n) << 4 | (4042322160 & n) >>> 4) >>> 0, n = (((16711935 & n) << 8 | (4278255360 & n) >>> 8) >>> 0) / 4294967296, 
	    {
	        x: e / t,
	        y: n
	    };
	}

	var fr = Object.freeze({
	    __proto__: null,
	    createIBLMaps: function(e, n = {}) {
	        const r = n.envTexture, i = n.envCubeSize || 512, o = n.sampleSize || 1024, s = n.roughnessLevels || 256, a = n.prefilterCubeSize || 256;
	        let c;
	        if (Array.isArray(r)) {
	            const t = e.cube(...r);
	            c = function(e, t, n, r) {
	                const i = e({
	                    frag: r ? "#define ENC_RGBM 1\n" + rr : rr,
	                    vert: Qn,
	                    attributes: {
	                        aPosition: Zn.vertices
	                    },
	                    uniforms: {
	                        hsv: [ 0, 0, 0 ],
	                        projMatrix: e.context("projMatrix"),
	                        viewMatrix: e.context("viewMatrix"),
	                        cubeMap: t,
	                        bias: 0,
	                        size: e.prop("size"),
	                        environmentExposure: 1
	                    },
	                    elements: Zn.indices
	                }), o = [], s = e.framebufferCube({
	                    radius: n
	                });
	                Jn(e, s, i, {
	                    size: n
	                }, (function() {
	                    const t = e.read();
	                    o.push(t);
	                }));
	                const a = e.cube({
	                    radius: n,
	                    min: "linear mipmap linear",
	                    mag: "linear",
	                    faces: o
	                });
	                return s.destroy(), i.destroy(), a;
	            }(e, t, i, !0), t.destroy();
	        } else c = function(e, t, n, r) {
	            n = n || 512;
	            const i = e({
	                frag: r ? "#define INPUT_RGBM 1\n" + $n : $n,
	                vert: Qn,
	                attributes: {
	                    aPosition: Zn.vertices
	                },
	                uniforms: {
	                    projMatrix: e.context("projMatrix"),
	                    viewMatrix: e.context("viewMatrix"),
	                    equirectangularMap: t
	                },
	                elements: Zn.indices
	            }), o = e.cube({
	                width: n,
	                height: n,
	                min: "linear",
	                mag: "linear",
	                format: "rgba"
	            }), s = e.framebufferCube({
	                radius: n,
	                color: o
	            });
	            return Jn(e, s, i), i.destroy(), s;
	        }(e, r, i, !0);
	        const {prefilterMap: l, prefilterMipmap: f} = function(e, t, n, r, i, o) {
	            const s = function(e, t, n, r, i, o) {
	                const s = cr(i = i || 1024, o = o || 256), a = e.texture({
	                    data: s,
	                    width: o,
	                    height: i,
	                    min: "nearest",
	                    mag: "nearest"
	                }), c = e({
	                    frag: "#define SHADER_NAME PBR_prefilter\nprecision highp float;\nvarying vec3 vWorldPos;\nuniform samplerCube environmentMap;\nuniform sampler2D distributionMap;\nuniform float roughness;\nuniform float resolution;\nuniform float rgbmRange;\nconst float c = 3.14159265359;\nfloat d(vec3 e, vec3 f, float h) {\n  float a = h * h;\n  float i = a * a;\n  float j = max(dot(e, f), .0);\n  float k = j * j;\n  float l = i;\n  float m = (k * (i - 1.) + 1.);\n  m = c * m * m;\n  return l / m;\n}\nvec3 n(float o, vec3 e, float h) {\n  vec4 u = texture2D(distributionMap, vec2(h, o));\n  vec3 f = u.xyz;\n  float v = sign(u.w - .5);\n  float A = sign(u.w - 200.0 / 255. * clamp(v, .0, 1.) - .15);\n  f.x *= v;\n  f.y *= A;\n  vec3 B = abs(e.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 C = normalize(cross(B, e));\n  vec3 D = cross(e, C);\n  vec3 E = C * f.x + D * f.y + e * f.z;\n  return normalize(E);\n}\nvec4 F(const in vec3 G, const in float I) {\n  if(I <= .0)\n    return vec4(G, 1.);\n  vec4 J;\n  vec3 K = G / I;\n  J.a = clamp(max(max(K.r, K.g), max(K.b, 1e-6)), .0, 1.);\n  J.a = ceil(J.a * 255.) / 255.;\n  J.rgb = K / J.a;\n  return J;\n}\nvec3 L(const in vec4 G, const in float I) {\n  if(I <= .0)\n    return G.rgb;\n  return I * G.rgb * G.a;\n}\nvoid main() {\n  vec3 e = normalize(vWorldPos);\n  vec3 M = e;\n  vec3 O = M;\n  const int P = 1024;\n  vec3 Q = vec3(.0);\n  float S = .0;\n  for(int T = 0; T < P; ++T) {\n    vec3 f = n(float(T) / float(P), e, roughness);\n    vec3 U = normalize(2. * dot(O, f) * f - O);\n    float W = max(dot(e, U), .0);\n    if(W > .0) {\n      Q += L(textureCube(environmentMap, U), rgbmRange).rgb * W;\n      S += W;\n    }\n  }\n  Q = Q / S;\n  gl_FragColor = F(Q, rgbmRange);\n}",
	                    vert: Qn,
	                    attributes: {
	                        aPosition: Zn.vertices
	                    },
	                    uniforms: {
	                        projMatrix: e.context("projMatrix"),
	                        viewMatrix: e.context("viewMatrix"),
	                        environmentMap: t,
	                        distributionMap: a,
	                        roughness: e.prop("roughness"),
	                        resolution: r,
	                        rgbmRange: n || 7
	                    },
	                    elements: Zn.indices,
	                    viewport: {
	                        x: 0,
	                        y: 0,
	                        width: e.prop("size"),
	                        height: e.prop("size")
	                    }
	                });
	                let l = r;
	                const f = e.texture({
	                    radius: r,
	                    min: "linear",
	                    mag: "linear"
	                }), u = e.framebuffer({
	                    radius: r,
	                    color: f
	                }), h = Math.log(l) / Math.log(2), d = [];
	                for (let t = 0; t <= h; t++) {
	                    let n = 0;
	                    Jn(e, u, c, {
	                        roughness: t / (h - 1),
	                        size: l
	                    }, (function() {
	                        const t = e.read({
	                            framebuffer: u
	                        });
	                        d[n] || (d[n] = {
	                            mipmap: []
	                        }), d[n].mipmap.push(t), n++;
	                    })), l /= 2, u.resize(l);
	                }
	                return a.destroy(), u.destroy(), c.destroy(), d;
	            }(e, t, n, r, i, o);
	            return {
	                prefilterMap: e.cube({
	                    radius: r,
	                    min: "linear mipmap linear",
	                    mag: "linear",
	                    faces: s
	                }),
	                prefilterMipmap: s
	            };
	        }(e, c, n.rgbmRange, a, o, s);
	        let u;
	        if (!n.ignoreSH) {
	            const n = a;
	            u = function(e, n, r) {
	                for (var i = new Array(9), o = [], s = [], a = [], c = 0; c < 9; c++) {
	                    for (var l = [ 0, 0, 0 ], f = 0; f < nr.length; f++) {
	                        for (var u = e[f], h = [ 0, 0, 0 ], d = 0, m = 0, v = tr[nr[f]], g = 0; g < r; g++) for (var _ = 0; _ < n; _++) {
	                            o[0] = _ / (n - 1) * 2 - 1, o[1] = g / (r - 1) * 2 - 1, o[2] = -1, normalize$4(o, o), 
	                            a[0] = o[v[0]] * v[3], a[1] = o[v[1]] * v[4], a[2] = o[v[2]] * v[5], s[0] = u[m++] / 255, 
	                            s[1] = u[m++] / 255, s[2] = u[m++] / 255;
	                            var b = u[m++] / 255 * 7;
	                            s[0] *= b, s[1] *= b, s[2] *= b, scaleAndAdd$2(h, h, s, er(a, c) * -o[2]), d += -o[2];
	                        }
	                        scaleAndAdd$2(l, l, h, 1 / d);
	                    }
	                    i[c] = scale$4(l, l, 1 / 6);
	                }
	                return i;
	            }(ir(e, l, n), n, n);
	            const r = [];
	            for (let e = 0; e < u.length; e++) r.push(...u[e]);
	            u = r;
	        }
	        const h = {
	            rgbmRange: n.rgbmRange,
	            envMap: c,
	            prefilterMap: l
	        };
	        return u && (h.sh = u), "array" === n.format && (h.envMap = {
	            width: c.width,
	            height: c.height,
	            faces: ir(e, c, i)
	        }, h.prefilterMap = {
	            width: l.width,
	            height: l.height,
	            faces: f
	        }, c.destroy(), l.destroy()), h;
	    },
	    generateDFGLUT: ar
	});

	const ur = {
	    uvScale: [ 1, 1 ],
	    uvOffset: [ 0, 0 ],
	    uvRotation: 0,
	    baseColorFactor: [ 1, 1, 1, 1 ],
	    emissiveFactor: [ 0, 0, 0 ],
	    baseColorIntensity: 1,
	    anisotropyDirection: 0,
	    anisotropyFactor: 0,
	    clearCoatFactor: 0,
	    clearCoatIor: 1.4,
	    clearCoatRoughnessFactor: .04,
	    clearCoatThickness: 5,
	    emitColorFactor: 1,
	    occlusionFactor: 1,
	    roughnessFactor: .4,
	    metallicFactor: 0,
	    normalMapFactor: 1,
	    specularF0: .5,
	    emitMultiplicative: 1,
	    normalMapFlipY: 0,
	    outputSRGB: 1,
	    baseColorTexture: null,
	    normalTexture: null,
	    occlusionTexture: null,
	    metallicRoughnessTexture: null,
	    emissiveTexture: null,
	    uvOrigin: [ 0, 0 ],
	    noiseTexture: null,
	    clearCoatTint: [ .006, .006, .006 ],
	    specularAAVariance: 20,
	    specularAAThreshold: 20,
	    hsv: [ 0, 0, 0 ],
	    contrast: 1,
	    bumpTexture: null,
	    bumpScale: .05,
	    bumpMinLayers: 5,
	    bumpMaxLayers: 20
	};

	class hr extends je {
	    constructor(e) {
	        const t = J$1({}, ur);
	        (e.metallicRoughnessTexture || e.metallicRoughnessTexture) && (t.roughnessFactor = 1, 
	        t.metallicFactor = 1), super(e, t);
	    }
	    appendDefines(e, t) {
	        super.appendDefines(e, t);
	        const n = this.uniforms;
	        n.GAMMA_CORRECT_INPUT && (e.GAMMA_CORRECT_INPUT = 1);
	        const r = t.data[t.desc.color0Attribute];
	        if (r) {
	            e.HAS_COLOR0 = 1;
	            let n = 3;
	            r.length ? n = r.length / t.getVertexCount() : r.buffer && (n = r.buffer._buffer.dimension), 
	            e.COLOR0_SIZE = n;
	        }
	        return t.data[t.desc.tangentAttribute] ? e.HAS_TANGENT = 1 : t.data[t.desc.normalAttribute] && (e.HAS_NORMAL = 1), 
	        t.data[t.desc.uv0Attribute] ? (n.baseColorTexture && (e.HAS_ALBEDO_MAP = 1), n.metallicRoughnessTexture && (e.HAS_METALLICROUGHNESS_MAP = 1), 
	        n.occlusionTexture && (e.HAS_AO_MAP = 1), n.emissiveTexture && (e.HAS_EMISSIVE_MAP = 1), 
	        n.normalTexture && (e.HAS_NORMAL_MAP = 1), n.bumpTexture && (e.HAS_BUMP_MAP = 1), 
	        (e.HAS_ALBEDO_MAP || e.HAS_METALLICROUGHNESS_MAP || e.HAS_AO_MAP || e.HAS_EMISSIVE_MAP || e.HAS_NORMAL_MAP || e.HAS_BUMP_MAP) && (e.HAS_MAP = 1), 
	        n.noiseTexture && (e.HAS_RANDOM_TEX = 1), e) : e;
	    }
	}

	class dr extends(Je(hr)){}

	function mr(e, t, n) {
	    if (n.ambientUpdate) {
	        const {iblTexes: r} = e;
	        if (r) {
	            const i = n.target;
	            _r(r), e.iblTexes = gr(t, i);
	        } else {
	            e.iblTexes = gr(t, n.target);
	        }
	    }
	}

	const vr = [ 0, 0 ];

	function gr(e, t) {
	    const n = t.getLightManager().getAmbientResource();
	    return n ? {
	        prefilterMap: e.cube({
	            width: n.prefilterMap.width,
	            height: n.prefilterMap.height,
	            faces: n.prefilterMap.faces,
	            min: "linear mipmap linear",
	            mag: "linear",
	            format: "rgba"
	        }),
	        sh: n.sh,
	        rgbmRange: n.rgbmRange
	    } : null;
	}

	function _r(e) {
	    for (const t in e) e[t].destroy && e[t].destroy(), delete e[t];
	}

	var br = Object.freeze({
	    __proto__: null,
	    loginIBLResOnCanvas: function(e, t, n) {
	        if (!e.dfgLUT && (e.dfgLUT = ar(t), e.dfgLUT.mtkRefCount = 0, n)) {
	            const r = mr.bind(this, e, t);
	            n.on("updatelights", r), e._iblResListener = r;
	        }
	        e.dfgLUT.mtkRefCount++;
	        const r = n.getLightManager();
	        return r && r.getAmbientResource() ? (e.iblTexes || (e.iblTexes = gr(t, n)), {
	            dfgLUT: e.dfgLUT,
	            iblTexes: e.iblTexes
	        }) : {
	            dfgLUT: e.dfgLUT,
	            iblTexes: null
	        };
	    },
	    getIBLResOnCanvas: function(e) {
	        const {dfgLUT: t, iblTexes: n} = e;
	        return {
	            dfgLUT: t,
	            iblTexes: n
	        };
	    },
	    logoutIBLResOnCanvas: function(e, t) {
	        let n = !1;
	        if (e.dfgLUT && (e.dfgLUT.mtkRefCount--, e.dfgLUT.mtkRefCount <= 0)) {
	            if (n = !0, t) {
	                t.off("updatelights", e._iblResListener);
	            }
	            e.dfgLUT.destroy(), delete e.dfgLUT;
	        }
	        e.iblTexes && n && (_r(e.iblTexes), delete e.iblTexes);
	    },
	    getPBRUniforms: function(e, t, n, r, i) {
	        const o = e.viewMatrix, s = e.projMatrix, a = e.cameraPosition, c = e.getRenderer().canvas, l = function(e, t) {
	            const n = e.getLightManager(), r = n && n.getAmbientResource(), i = n && n.getAmbientLight() || {}, o = n && n.getDirectionalLight() || {};
	            let s;
	            if (r) {
	                const e = t.prefilterMap.width, n = Math.log(e) / Math.log(2);
	                s = {
	                    prefilterMap: t.prefilterMap,
	                    diffuseSPH: t.sh,
	                    prefilterMiplevel: [ n, n ],
	                    prefilterSize: [ e, e ],
	                    hdrHSV: i.hsv || [ 0, 0, 0 ]
	                };
	            } else s = {
	                ambientColor: i.color || [ .2, .2, .2 ]
	            };
	            return s.rgbmRange = r ? t.rgbmRange : 7, s.environmentExposure = Q$1(i.exposure) ? i.exposure : 1, 
	            s.environmentOrientation = i.orientation || 0, s.light0_diffuse = [ ...o.color || [ 1, 1, 1 ], 1 ], 
	            s.light0_viewDirection = o.direction || [ 1, 1, -1 ], s;
	        }(e, t), f = J$1({
	            viewMatrix: o,
	            projMatrix: s,
	            projViewMatrix: e.projViewMatrix,
	            cameraPosition: a,
	            outSize: [ c.width, c.height ],
	            cameraNearFar: [ e.cameraNear, e.cameraFar ]
	        }, l);
	        return f.brdfLUT = n, r && r.renderUniforms && J$1(f, r.renderUniforms), f.halton = i || vr, 
	        f;
	    },
	    createIBLTextures: gr,
	    disposeIBLTextures: _r,
	    isSupported: function(e) {
	        return e.hasExtension("EXT_shader_texture_lod");
	    }
	});

	class pr extends Wt {
	    constructor(e) {
	        super({
	            vert: "attribute vec3 aPosition;\nuniform mat4 lightProjViewModelMatrix;\nuniform mat4 positionMatrix;\n#include <line_extrusion_vert>\n#include <get_output>\nvarying vec4 vPosition;\nvoid main() {\n  mat4 c = getPositionMatrix();\n#ifdef IS_LINE_EXTRUSION\nvec3 d = getLineExtrudePosition(aPosition);\n  vec4 e = getPosition(d);\n#else\nvec4 e = getPosition(aPosition);\n#endif\ngl_Position = lightProjViewModelMatrix * c * e;\n  vPosition = gl_Position;\n}",
	            frag: "#define SHADER_NAME vsm_mapping\n#ifdef USE_VSM\n#extension GL_OES_standard_derivatives : enable\n#endif\nprecision highp float;\nvarying vec4 vPosition;\n#ifdef PACK_FLOAT\n#include <common_pack_float>\n#endif\nvoid main() {\n  \n#if defined(USE_VSM)\nfloat c = vPosition.z / vPosition.w;\n  c = c * .5 + .5;\n  float d = c;\n  float e = c * c;\n  float f = dFdx(c);\n  float h = dFdy(c);\n  e += .25 * (f * f + h * h);\n  gl_FragColor = vec4(d, e, c, .0);\n#endif\n#if defined(USE_ESM)\n#ifdef PACK_FLOAT\ngl_FragColor = common_encodeDepth(gl_FragCoord.z);\n#else\ngl_FragColor = vec4(gl_FragCoord.z, .0, .0, 1.);\n#endif\n#endif\n}",
	            uniforms: [ {
	                name: "lightProjViewModelMatrix",
	                type: "function",
	                fn: function(e, t) {
	                    return multiply$5([], t.lightProjViewMatrix, t.modelMatrix);
	                }
	            } ],
	            extraCommandProps: {},
	            defines: e
	        });
	    }
	    filter(e) {
	        return e.castShadow;
	    }
	}

	class xr extends rn {
	    constructor({blurOffset: e}) {
	        super({
	            vert: en,
	            frag: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D textureSource;\nuniform vec2 resolution;\n#include <common_pack_float>\nvoid main() {\n  float c = .0;\n  float d = .0;\n  for(int x = -BOXBLUR_OFFSET; x <= BOXBLUR_OFFSET; ++x)\n    for(int y = -BOXBLUR_OFFSET; y <= BOXBLUR_OFFSET; ++y) {\n      vec2 e = vTexCoord.st + vec2(float(x) / resolution.x, float(y) / resolution.y);\n      e = clamp(e, .0, 1.);\n      float f = common_decodeDepth(texture2D(textureSource, e));\n      float s = max(.0, sign(1. - f));\n      d += sign(f) * s;\n      c += f;\n    }\n  float h = c / max(1., d);\n  gl_FragColor = common_encodeDepth(h);\n}",
	            defines: {
	                BOXBLUR_OFFSET: e || 2
	            }
	        }), this._blurOffset = e || 2;
	    }
	    getMeshCommand(e, t) {
	        const n = "box_shadow_blur_" + this._blurOffset;
	        return this.commands[n] || (this.commands[n] = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands[n];
	    }
	}

	let yr, Tr;

	class Ar {
	    constructor(e, {width: t, height: n, blurOffset: r, defines: i}) {
	        this.renderer = e, this.width = t || 512, this.height = n || 512, this.blurOffset = q$1(r) ? 2 : r, 
	        this._init(i);
	    }
	    render(e, {cameraProjViewMatrix: t, lightDir: n, farPlane: r, cameraLookAt: i}) {
	        return {
	            lightProjViewMatrix: this._renderShadow(e, t, n, r, i),
	            shadowMap: this.blurTex || this.depthTex,
	            depthFBO: this.depthFBO,
	            blurFBO: this.blurFBO
	        };
	    }
	    resize(e, t) {
	        return this.depthTex && (this.depthTex.resize(e, t), this.depthFBO.resize(e, t)), 
	        this.blurFBO && (this.blurTex.resize(e, t), this.blurFBO.resize(e, t)), this;
	    }
	    _renderShadow(e, t, n, r, i) {
	        const o = this.renderer, s = yr(t);
	        if (r) for (let e = 4; e < 8; e++) s[e] = r[e - 4];
	        const a = Tr(i, s, n);
	        return o.clear({
	            color: [ 1, 0, 0, 1 ],
	            depth: 1,
	            framebuffer: this.depthFBO
	        }), o.render(this.shadowMapShader, {
	            lightProjViewMatrix: a
	        }, e, this.depthFBO), this.blurFBO && (this.boxBlurShader || (this.boxBlurShader = new xr({
	            blurOffset: this.blurOffset
	        })), o.clear({
	            color: [ 1, 0, 0, 1 ],
	            depth: 1,
	            framebuffer: this.blurFBO
	        }), o.render(this.boxBlurShader, {
	            resolution: [ this.depthTex.width, this.depthTex.height ],
	            textureSource: this.depthTex
	        }, null, this.blurFBO)), a;
	    }
	    _init(e) {
	        const t = this.renderer.regl, n = this.width, r = this.height;
	        this.depthTex = t.texture({
	            width: n,
	            height: r,
	            format: "rgb",
	            type: "uint8",
	            min: "nearest",
	            mag: "nearest"
	        }), this.shadowMapShader = new pr(e), this.shadowMapShader.filter = e => e.castShadow, 
	        this.depthFBO = t.framebuffer({
	            color: this.depthTex
	        }), this.blurOffset <= 0 || (this.blurTex = t.texture({
	            width: n,
	            height: r,
	            format: "rgb",
	            type: "uint8",
	            min: "linear",
	            mag: "linear"
	        }), this.blurFBO = t.framebuffer({
	            color: this.blurTex
	        }));
	    }
	    dispose() {
	        this.depthTex && (this.depthTex.destroy(), this.depthFBO.destroy(), delete this.depthTex, 
	        delete this.depthFBO), this.blurTex && (this.blurTex.destroy(), this.blurFBO.destroy(), 
	        delete this.blurTex, delete this.blurFBO), this.shadowMapShader && (this.shadowMapShader.dispose(), 
	        delete this.shadowMapShader), this.boxBlurShader && (this.boxBlurShader.dispose(), 
	        delete this.boxBlurShader);
	    }
	}

	yr = function() {
	    const e = [ [ -1, -1, -1, 1 ], [ 1, -1, -1, 1 ], [ 1, 1, -1, 1 ], [ -1, 1, -1, 1 ], [ -1, -1, 1, 1 ], [ 1, -1, 1, 1 ], [ 1, 1, 1, 1 ], [ -1, 1, 1, 1 ] ], t = new Array(16);
	    return function(i) {
	        invert$2(t, i);
	        const o = [];
	        for (let r = 0; r < e.length; r++) {
	            const i = transformMat4$1([], e[r], t);
	            scale$3(i, i, 1 / i[3]), o.push(i);
	        }
	        return o;
	    };
	}(), Tr = function() {
	    let e = new Array(4);
	    const i = new Array(3), o = [ 0, 0, 0, 0 ], s = [ 0, 1, 0 ], a = new Array(3);
	    let c = new Array(16), l = new Array(16), f = new Array(16);
	    const u = [ 1, 1, 1 ], h = [ 0, 0, 0 ];
	    return function(d, m, v) {
	        set$3(o, ...d, 1), scale$4(i, v, -1), c = lookAt(c, add$4(a, o, normalize$4(a, i)), o, s), 
	        transformMat4$1(e, m[0], c);
	        let g = e[2], _ = e[2], b = e[0], p = e[0], x = e[1], y = e[1];
	        for (let t = 1; t < 8; t++) e = transformMat4$1(e, m[t], c), e[2] > _ && (_ = e[2]), 
	        e[2] < g && (g = e[2]), e[0] > p && (p = e[0]), e[0] < b && (b = e[0]), e[1] > y && (y = e[1]), 
	        e[1] < x && (x = e[1]);
	        l = ortho(l, -1, 1, -1, 1, -_, -g);
	        const T = u[0] = 2 / (p - b), A = u[1] = -2 / (y - x);
	        h[0] = -.5 * (b + p) * T, h[1] = -.5 * (x + y) * A, identity$2(f), translate$1(f, f, h), 
	        scale$5(f, f, u);
	        const S = multiply$5(l, f, l);
	        return multiply$5(new Array(16), S, c);
	    };
	}();

	class Sr extends Wt {
	    constructor(e) {
	        super({
	            vert: "#define SHADER_NAME SHADOW_DISPLAY\nattribute vec3 aPosition;\nuniform mat4 projMatrix;\nuniform mat4 modelViewMatrix;\nuniform vec2 halton;\nuniform vec2 globalTexSize;\nvarying vec4 vPosition;\n#include <vsm_shadow_vert>\nvoid main() {\n  vec4 c = vec4(aPosition, 1.);\n  vec4 d = modelViewMatrix * c;\n  mat4 e = projMatrix;\n  e[2].xy += halton.xy / globalTexSize.xy;\n  gl_Position = e * d;\n  vPosition = gl_Position;\n  shadow_computeShadowPars(c);\n}",
	            frag: "#define SHADER_NAME SHADOW_DISPLAY\nprecision mediump float;\nuniform vec3 color;\n#include <vsm_shadow_frag>\nvoid main() {\n  float c = shadow_computeShadow();\n  float d = 1. - c;\n  gl_FragColor = vec4(color * d, d);\n}",
	            uniforms: [ {
	                name: "modelViewMatrix",
	                type: "function",
	                fn: function(e, t) {
	                    const n = [];
	                    return multiply$5(n, t.viewMatrix, t.modelMatrix), n;
	                }
	            } ],
	            defines: e || {
	                USE_ESM: 1
	            },
	            extraCommandProps: {
	                depth: {
	                    enable: !0,
	                    mask: !1
	                },
	                viewport: {
	                    x: 0,
	                    y: 0,
	                    width: (e, t) => t.globalTexSize[0],
	                    height: (e, t) => t.globalTexSize[1]
	                }
	            }
	        });
	    }
	    getMeshCommand(e, t) {
	        return this.commands.shadow_display || (this.commands.shadow_display = this.createREGLCommand(e, null, t.getElements())), 
	        this.commands.shadow_display;
	    }
	}

	function Mr(e) {
	    return 256 * e[2] * 256 + 256 * e[1] + e[0];
	}

	const Er = new Uint8Array(4), wr = new Float32Array(Er.buffer);

	const Or = "\n    vec3 unpack(highp float f) {\n        highp vec3 color;\n        color.b = floor(f / 65536.0);\n        color.g = floor((f - color.b * 65536.0) / 256.0);\n        color.r = f - floor(color.b * 65536.0) - floor(color.g * 256.0);\n        // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!\n        return color / 255.0;\n    }\n", Cr = `\n    precision highp float;\n\n    varying float vPickingId;\n    varying float vFbo_picking_visible;\n\n    uniform float fbo_picking_meshId;\n\n    ${Or}\n\n    void main() {\n        if (vFbo_picking_visible == 0.0) {\n            discard;\n            return;\n        }\n        gl_FragColor = vec4(unpack(vPickingId), fbo_picking_meshId / 255.0);\n    }\n`, Pr = `\n    precision highp float;\n\n    uniform int fbo_picking_meshId;\n    varying float vFbo_picking_visible;\n\n    ${Or}\n\n    void main() {\n        if (vFbo_picking_visible == 0.0) {\n            discard;\n            return;\n        }\n        gl_FragColor = vec4(unpack(float(fbo_picking_meshId)), 1.0);\n        // gl_FragColor = vec4(unpack(float(35)), 1.0);\n    }\n`, Ir = `\n    precision highp float;\n\n    varying float vPickingId;\n    varying float vFbo_picking_visible;\n\n    ${Or}\n\n    void main() {\n        if (vFbo_picking_visible == 0.0) {\n            discard;\n            return;\n        }\n        gl_FragColor = vec4(unpack(vPickingId), 1.0);\n    }\n`;

	class Dr {
	    constructor(e, {vert: t, uniforms: n, defines: r, extraCommandProps: i}, o) {
	        this._renderer = e, this._fbo = o, this._clearFbo(o), this._vert = t, this._uniforms = n, 
	        this._defines = r, this._extraCommandProps = i, this._currentMeshes = [], this._init();
	    }
	    _init() {
	        const e = [];
	        this._uniforms && e.push(...this._uniforms);
	        const t = {
	            ENABLE_PICKING: 1,
	            HAS_PICKING_ID: 1
	        };
	        if (this._defines) for (const e in this._defines) t[e] = this._defines[e];
	        const n = this._vert, r = this._extraCommandProps;
	        this._shader0 = new Wt({
	            vert: n,
	            frag: Cr,
	            uniforms: e,
	            defines: t,
	            extraCommandProps: r
	        }), this._shader2 = new Wt({
	            vert: n,
	            frag: Ir,
	            uniforms: e,
	            defines: t,
	            extraCommandProps: r
	        });
	        const i = {
	            ENABLE_PICKING: 1,
	            HAS_PICKING_ID: 1
	        };
	        if (this._defines) for (const e in this._defines) i[e] = this._defines[e];
	        this._shader1 = new Wt({
	            vert: n,
	            frag: Pr,
	            uniforms: e,
	            defines: i,
	            extraCommandProps: r
	        }), this._depthShader = new Wt({
	            vert: n,
	            frag: "\n    #define SHADER_NAME depth\n\n    precision highp float;\n    varying float vFbo_picking_viewZ;\n\n    #include <common_pack_float>\n\n    void main() {\n        gl_FragColor = common_unpackFloat(vFbo_picking_viewZ);\n        // gl_FragColor = unpack(34678.3456789);\n    }\n",
	            uniforms: e,
	            defines: i,
	            extraCommandProps: r
	        }), this._scene = new ft$1, this._scene1 = new ft$1;
	    }
	    filter() {
	        return !0;
	    }
	    render(e, t, n = !1) {
	        if (!e || !e.length) return this;
	        const r = this._fbo;
	        n && this.clear(), e = e.filter(e => e && e.isValid()), this._scene.setMeshes(e);
	        const i = this._getShader(e, n);
	        i.filter = this.filter, this._currentShader && i !== this._currentShader && this.clear(), 
	        this._currentShader = i, e.forEach((e, t) => {
	            e.setUniform("fbo_picking_meshId", t + this._currentMeshes.length);
	        });
	        for (let t = 0; t < e.length; t++) this._currentMeshes.push(e[t]);
	        return this._renderer.render(i, t, this._scene, r), this;
	    }
	    pick(e, t, n, r, i = {}) {
	        const o = this._currentShader, s = this._currentMeshes;
	        if (!o || !s || !s.length) return {
	            pickingId: null,
	            meshId: null,
	            point: null
	        };
	        e = Math.round(e), t = Math.round(t);
	        const a = this._fbo;
	        if (e <= 2 || e >= a.width - 2 || t <= 2 || t >= a.height - 2) return {
	            pickingId: null,
	            meshId: null,
	            point: null
	        };
	        const {px: c, py: l, width: f, height: u} = this._getParams(e, t, n, a), h = new Uint8Array(4 * f * u), d = this._renderer.regl.read({
	            data: h,
	            x: c,
	            y: l,
	            framebuffer: a,
	            width: f,
	            height: u
	        }), m = [];
	        let v = [];
	        for (let e = 0; e < d.length; e += 4) {
	            const {pickingId: t, meshId: n} = this._packData(d.subarray(e, e + 4), o);
	            m.push(n), v.push(t);
	        }
	        const g = {}, _ = m.filter(e => null != e && !g[e] && (g[e] = 1, !0)).map(e => s[e]);
	        m.length && o === this._shader1 && (void 0 !== s[0].getUniform("uPickingId") || s[0].geometry.data.aPickingId) && (v = this._getPickingId(c, l, f, u, h, _, r));
	        const b = [];
	        if (m.length && i.returnPoint) {
	            const {viewMatrix: n, projMatrix: o} = i, s = this._pickDepth(c, l, f, u, h, _, r);
	            for (let r = 0; r < s.length; r++) if (s[r] && null != m[r] && null != v[r]) {
	                const i = this._getWorldPos(e, t, s[r], n, o);
	                b.push(i);
	            } else b.push(null);
	        }
	        const p = [];
	        for (let e = 0; e <= n; e++) p.push(e), e > 0 && p.push(-e);
	        for (let e = 0; e < p.length; e++) for (let t = 0; t < p.length; t++) {
	            const r = (p[t] + n) * f + (p[e] + n);
	            if (null != m[r] && null != v[r]) return {
	                meshId: m[r],
	                pickingId: v[r],
	                point: b[r] || null
	            };
	        }
	        return {
	            pickingId: null,
	            meshId: null,
	            point: null
	        };
	    }
	    clear() {
	        return this._fbo && this._clearFbo(this._fbo), this._currentMeshes = [], delete this._currentShader, 
	        this;
	    }
	    getMeshAt(e) {
	        return this._currentMeshes ? this._currentMeshes[e] : null;
	    }
	    getRenderedMeshes() {
	        return this._currentMeshes;
	    }
	    dispose() {
	        this.clear(), this._shader0 && this._shader0.dispose(), this._shader1 && this._shader1.dispose(), 
	        this._shader2 && this._shader2.dispose(), this._scene && this._scene.clear(), this._scene1 && this._scene1.clear();
	    }
	    _getWorldPos(e, t, n, i, o) {
	        const s = this._fbo, a = [], c = s.width / 2 || 1, l = s.height / 2 || 1, f = [ (e - c) / c, (l - t) / l, 0, 1 ], u = [ (e - c) / c, (l - t) / l, 1, 1 ], h = invert$2(a, o), d = [], m = [];
	        Nr(d, f, h), Nr(m, u, h);
	        const v = -d[2], g = (n - v) / (-m[2] - v), _ = multiply$5(a, o, i), b = invert$2(a, _), p = Nr(f, f, b), x = Nr(u, u, b);
	        return [ $$1(p[0], x[0], g), $$1(p[1], x[1], g), $$1(p[2], x[2], g) ];
	    }
	    _getPickingId(e, t, n, r, i, o, s) {
	        const a = this._renderer.regl, c = this._getFBO1();
	        this._clearFbo(c), this._scene1.setMeshes(o), this._renderer.render(this._shader2, s, this._scene1, c);
	        const l = a.read({
	            data: i,
	            x: e,
	            y: t,
	            framebuffer: c,
	            width: n,
	            height: r
	        }), f = [];
	        for (let e = 0; e < l.length; e += 4) f.push(Mr(l.subarray(e, e + 4)));
	        return f;
	    }
	    _pickDepth(e, t, n, r, i, o, s) {
	        const a = this._renderer.regl, c = this._getFBO1();
	        this._scene1.setMeshes(o), this._clearFbo(c), this._renderer.render(this._depthShader, s, this._scene1, c);
	        const l = a.read({
	            data: i,
	            x: e,
	            y: t,
	            framebuffer: c,
	            width: n,
	            height: r
	        }), f = [];
	        for (let e = 0; e < l.length; e += 4) f.push((u = l.subarray(e, e + 4), Er[0] = u[3], 
	        Er[1] = u[2], Er[2] = u[1], Er[3] = u[0], wr[0]));
	        var u;
	        return f;
	    }
	    _packData(e, t) {
	        if (255 === e[0] && 255 === e[1] && 255 === e[2] && 255 === e[3]) return {
	            meshId: null,
	            pickingId: null
	        };
	        let n = null, r = null;
	        return t === this._shader1 ? r = Mr(e) : t === this._shader0 ? (r = e[3], n = Mr(e)) : (r = null, 
	        n = Mr(e)), {
	            meshId: r,
	            pickingId: n
	        };
	    }
	    _clearFbo(e) {
	        this._renderer.regl.clear({
	            color: [ 1, 1, 1, 1 ],
	            depth: 1,
	            stencil: 0,
	            framebuffer: e
	        });
	    }
	    _getShader(e, t) {
	        return t && e.length < 256 ? this._shader0 : this._shader1;
	    }
	    _getFBO1() {
	        const e = this._renderer.regl, t = this._fbo;
	        return this._fbo1 ? this._fbo1.width === t.width && this._fbo1.height === t.height || this._fbo1.resize(t.width, t.height) : this._fbo1 = e.framebuffer(t.width, t.height), 
	        this._fbo1;
	    }
	    _getParams(e, t, n, r) {
	        t = r.height - t;
	        let i = 2 * n + 1, o = 2 * n + 1;
	        const s = (e -= n) + i, a = (t -= n) + o;
	        return s > r.width && (i -= s - r.width), a > r.height && (o -= a - r.height), {
	            px: e = e < 0 ? 0 : e,
	            py: t = t < 0 ? 0 : t,
	            width: i,
	            height: o
	        };
	    }
	    getPickingVert() {
	        return this._vert;
	    }
	    getUniformDeclares() {
	        return this._uniforms;
	    }
	}

	function Nr(e, t, n) {
	    const r = t[0], i = t[1], o = t[2], s = 1 / (n[3] * r + n[7] * i + n[11] * o + n[15]);
	    return e[0] = (n[0] * r + n[4] * i + n[8] * o + n[12]) * s, e[1] = (n[1] * r + n[5] * i + n[9] * o + n[13]) * s, 
	    e[2] = (n[2] * r + n[6] * i + n[10] * o + n[14]) * s, e;
	}

	const Fr = e => e && e.geometry && void 0 === e.geometry.properties.shaderHash, Rr = [], Br = [], Lr = [ {
	    name: "modelViewMatrix",
	    type: "function",
	    fn: (e, t) => multiply$5(Rr, t.viewMatrix, t.modelMatrix)
	}, {
	    name: "modelViewProjMatrix",
	    type: "function",
	    fn: (e, t) => {
	        const n = multiply$5(Rr, t.viewMatrix, t.modelMatrix);
	        return multiply$5(Rr, t.projMatrix, n);
	    }
	}, {
	    name: "modelMatrixInverse",
	    type: "function",
	    fn: (e, t) => invert$2(Rr, t.modelMatrix)
	}, {
	    name: "projMatrixInverse",
	    type: "function",
	    fn: (e, t) => invert$2(Rr, t.projMatrix)
	}, {
	    name: "modelViewMatrixInverse",
	    type: "function",
	    fn: (e, t) => (multiply$5(Rr, t.viewMatrix, t.modelMatrix), invert$2(Rr, Rr))
	}, {
	    name: "modelViewProjMatrixInverse",
	    type: "function",
	    fn: (e, t) => {
	        const n = multiply$5(Rr, t.viewMatrix, t.modelMatrix);
	        return multiply$5(Rr, t.projMatrix, n), invert$2(Rr, Rr);
	    }
	}, {
	    name: "modelInverseTransposeMatrix",
	    type: "function",
	    fn: (e, t) => {
	        const n = fromMat4$1(Br, t.modelMatrix), r = transpose$1(n, n);
	        return invert$3(r, r);
	    }
	}, {
	    name: "modelViewInverseTransposeMatrix",
	    type: "function",
	    fn: (e, t) => {
	        const n = multiply$5(Rr, t.viewMatrix, t.modelMatrix), o = fromMat4$1(Br, n), s = transpose$1(o, o);
	        return invert$3(s, s);
	    }
	} ], Hr = {
	    LOCAL: "positionMatrix",
	    MODEL: "modelMatrix",
	    VIEW: "viewMatrix",
	    PROJECTION: "projMatrix",
	    MODELVIEW: "modelViewMatrix",
	    MODELVIEWPROJECTION: "modelViewProjMatrix",
	    MODELINVERSE: "modelMatrixInverse",
	    VIEWINVERSE: "viewMatrixInverse",
	    PROJECTIONINVERSE: "projMatrixInverse",
	    MODELVIEWINVERSE: "modelViewMatrixInverse",
	    MODELVIEWPROJECTIONINVERSE: "modelViewProjMatrixInverse",
	    MODELINVERSETRANSPOSE: "modelInverseTransposeMatrix",
	    MODELVIEWINVERSETRANSPOSE: "modelViewInverseTransposeMatrix",
	    VIEWPORT: "viewport",
	    JOINTMATRIX: "jointMatrix",
	    ALPHACUTOFF: "alphaCutoff"
	};

	class zr {
	    constructor(e, t, n) {
	        this._regl = e, this._khrShaders = {}, this._commandProps = t, this._resLoader = n;
	    }
	    getExcludeFilter() {
	        return Fr;
	    }
	    forEachShader(e) {
	        for (const t in this._khrShaders) {
	            const n = this._khrShaders[t];
	            e(n.shader, n.filter, n.uniformSemantics);
	        }
	    }
	    createMesh(e, t, n) {
	        const r = t.extensions.KHR_techniques_webgl, i = t.materials[e.material].extensions.KHR_techniques_webgl, {technique: o, values: s} = i, a = r.techniques[o], c = r.programs[a.program], l = r.shaders[c.fragmentShader], f = kr(r.shaders[c.vertexShader]) + "-" + kr(l);
	        this._khrShaders[f] || (this._khrShaders[f] = this._createTechniqueShader(f, r, o, this._commandProps));
	        const {attributeSemantics: u} = this._khrShaders[f], h = this._createGeometry(e, u, n, f), d = J$1({}, s);
	        for (const e in s) if (35678 === a.uniforms[e].type) {
	            d[e] = this._getTexture(t.textures[s[e].index]);
	        }
	        return {
	            geometry: h,
	            material: new je(d)
	        };
	    }
	    _createGeometry(e, t, n, r) {
	        const i = e.attributes, o = t.COLOR_0;
	        if (i[o] && i[o] instanceof Float32Array) {
	            const e = new Uint8Array(i[o].length);
	            for (let t = 0; t < e.length; t++) e[t] = Math.round(255 * i[o][t]);
	            i[o] = e;
	        }
	        const s = {};
	        for (const e in i) {
	            const n = It(this._regl, i[e], {
	                dimension: i[e].itemSize
	            }), r = t[e] || e;
	            s[r] = {
	                buffer: n
	            }, r === t.POSITION && (s[r].array = i[e].array);
	        }
	        const a = new ke(s, e.indices.array ? e.indices.array : e.indices, 0, {
	            positionAttribute: t.POSITION,
	            normalAttribute: t.NORMAL,
	            uv0Attribute: t.TEXCOORD_0,
	            uv1Attribute: t.TEXCOORD_1,
	            color0Attribute: t.COLOR_0,
	            tangentAttribute: t.TANGENT,
	            primitive: void 0 === e.mode ? "triangles" : bt(e.mode)
	        });
	        return a.generateBuffers(this._regl, {
	            excludeElementsInVAO: n
	        }), a.properties.shaderHash = r, a;
	    }
	    _getTexture(e) {
	        const t = {
	            type: e.type ? xt(e.type) : "uint8",
	            format: e.format ? Tt(e.format) : "rgba",
	            flipY: !1
	        }, n = e.image;
	        t.data = n.array, t.width = n.width, t.height = n.height;
	        const r = e.sampler || e.texture.sampler;
	        return r && (r.magFilter && (t.mag = St(r.magFilter)), r.minFilter && (t.min = Et(r.minFilter)), 
	        r.wrapS && (t.wrapS = Ot(r.wrapS)), r.wrapT && (t.wrapT = Ot(r.wrapT))), new Ft(t, this._resLoader);
	    }
	    _createTechniqueShader(e, t, n, r) {
	        const {techniques: i, programs: o, shaders: s} = t, a = i[n], c = o[a.program], l = s[c.vertexShader].content, f = s[c.fragmentShader].content, u = {};
	        for (const e in a.uniforms) {
	            const t = a.uniforms[e];
	            t.semantic && (u[t.semantic] = e);
	        }
	        const h = Lr.slice();
	        for (const e in u) {
	            h.push({
	                name: u[e],
	                type: "function",
	                fn: (t, n) => n[Hr[e]]
	            });
	        }
	        const d = new Wt({
	            vert: l,
	            frag: f,
	            uniforms: h,
	            extraCommandProps: r
	        }), m = {};
	        for (const e in a.attributes) {
	            m[a.attributes[e].semantic] = e;
	        }
	        return {
	            shader: d,
	            filter: t => t && t.geometry && t.geometry.properties.shaderHash === e,
	            uniformSemantics: u,
	            attributeSemantics: m
	        };
	    }
	    dispose() {
	        for (const e in this._khrShaders) {
	            const {shader: t} = this._khrShaders[e];
	            t.dispose();
	        }
	        this._khrShaders = {};
	    }
	}

	function kr(e) {
	    let t = 0;
	    const n = e && e.length || 0;
	    if (!n) return t;
	    let r;
	    for (let i = 0; i < n; i++) r = e.charCodeAt(i), t = (t << 5) - t + r, t &= t;
	    return t;
	}

	const Vr = {
	    parseHDR: gt
	}, jr = {
	    PBRHelper: fr,
	    StandardMaterial: hr,
	    StandardSpecularGlossinessMaterial: dr,
	    StandardShader: class extends Wt {
	        constructor(e = {}) {
	            let t = e.extraCommandProps || {};
	            const n = e.uniforms;
	            t = J$1({}, t);
	            const o = e.defines || {}, s = [], a = [], c = [], l = [], f = [], u = [ {
	                name: "modelNormalMatrix",
	                type: "function",
	                fn: (e, t) => fromMat4$1(s, t.modelMatrix)
	            }, {
	                name: "modelViewNormalMatrix",
	                type: "function",
	                fn: (e, t) => {
	                    const n = multiply$5(a, t.viewMatrix, t.modelMatrix), o = invert$2(n, n), s = transpose(o, o);
	                    return fromMat4$1(c, s);
	                }
	            }, {
	                name: "modelViewMatrix",
	                type: "function",
	                fn: (e, t) => multiply$5(l, t.viewMatrix, t.modelMatrix)
	            }, {
	                name: "uEnvironmentTransform",
	                type: "function",
	                fn: (e, t) => fromRotation$2(f, Math.PI * (t.environmentOrientation || 0) / 180)
	            } ];
	            n && u.push(...n);
	            super({
	                vert: "#include <gl2_vert>\n#define SHADER_NAME PBR\nprecision highp float;\nattribute vec3 aPosition;\n#if defined(HAS_MAP)\nattribute vec2 aTexCoord;\nuniform vec2 uvOrigin;\nuniform vec2 uvScale;\nuniform vec2 uvOffset;\nuniform float uvRotation;\n#endif\n#if defined(HAS_TANGENT)\nattribute vec4 aTangent;\n#elif defined(HAS_NORMAL)\nattribute vec3 aNormal;\n#endif\nvec3 c;\nvec3 d;\nvec4 e;\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 positionMatrix;\nuniform mat4 projMatrix;\nuniform vec2 outSize;\nuniform vec2 halton;\nuniform mediump vec3 cameraPosition;\nuniform mat3 modelNormalMatrix;\n#ifdef HAS_SSR\nuniform mat3 modelViewNormalMatrix;\nvarying vec3 vViewNormal;\n#ifdef HAS_TANGENT\nvarying vec4 vViewTangent;\n#endif\n#endif\nvarying vec3 vModelNormal;\nvarying vec4 vViewVertex;\n#if defined(HAS_TANGENT)\nvarying vec4 vModelTangent;\nvarying vec3 vModelBiTangent;\n#endif\nvarying vec3 vModelVertex;\n#if defined(HAS_MAP)\nvarying vec2 vTexCoord;\n#endif\n#if defined(HAS_COLOR)\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n#if defined(HAS_COLOR0)\n#if COLOR0_SIZE == 3\nattribute vec3 aColor0;\nvarying vec3 vColor0;\n#else\nattribute vec4 aColor0;\nvarying vec4 vColor0;\n#endif\n#endif\n#include <line_extrusion_vert>\n#include <get_output>\n#include <viewshed_vert>\n#include <flood_vert>\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_vert>\n#endif\n#include <heatmap_render_vert>\n#include <fog_render_vert>\n#if defined(HAS_BUMP_MAP) && defined(HAS_TANGENT)\nvarying vec3 vTangentViewPos;\nvarying vec3 vTangentFragPos;\n#if __VERSION__ == 100\nmat3 f(in mat3 h) {\n  vec3 i = h[0];\n  vec3 j = h[1];\n  vec3 k = h[2];\n  return mat3(vec3(i.x, j.x, k.x), vec3(i.y, j.y, k.y), vec3(i.z, j.z, k.z));\n}\n#else\nmat3 f(in mat3 h) {\n  return transpose(h);\n}\n#endif\n#endif\nvoid l(const highp vec4 q, out highp vec3 m) {\n  m = vec3(.0, .0, 1.) + vec3(2., -2., -2.) * q.x * q.zwx + vec3(2., 2., -2.) * q.y * q.wzy;\n}\nvoid l(const highp vec4 q, out highp vec3 m, out highp vec3 t) {\n  l(q, m);\n  t = vec3(1., .0, .0) + vec3(-2., 2., -2.) * q.y * q.yxw + vec3(-2., 2., 2.) * q.z * q.zwx;\n}\nconst float o = .5;\nvec2 u(vec2 v, float A) {\n  return vec2(cos(A) * (v.x - o) + sin(A) * (v.y - o) + o, cos(A) * (v.y - o) - sin(A) * (v.x - o) + o);\n}\nvoid main() {\n  \n#if defined(HAS_MAP)\n#ifdef HAS_RANDOM_TEX\nvec2 B = uvOrigin;\n  vec2 C = aTexCoord * uvScale + uvOffset;\n  if(uvRotation != .0) {\n    B = u(B, uvRotation);\n    C = u(C, uvRotation);\n  }\n  vTexCoord = mod(B, 1.) + C;\n#else\nvec2 B = uvOrigin;\n  vec2 C = aTexCoord * uvScale;\n  if(uvRotation != .0) {\n    B = u(B, uvRotation);\n    C = u(C, uvRotation);\n  }\n  vTexCoord = mod(B, 1.) + C + uvOffset;\n#endif\n#endif\nmat4 D = getPositionMatrix();\n#if defined(HAS_TANGENT) || defined(HAS_NORMAL)\nmat3 E = mat3(D);\n  mat3 F = modelNormalMatrix * E;\n#if defined(HAS_TANGENT)\nvec3 t;\n  l(aTangent, d, t);\n  vModelTangent = vec4(F * t, aTangent.w);\n#else\nd = aNormal;\n#endif\nvec3 G = d;\n  vModelNormal = F * G;\n#else\nd = vec3(.0);\n  vModelNormal = vec3(.0);\n#endif\n#ifdef IS_LINE_EXTRUSION\nvec3 H = getLineExtrudePosition(aPosition);\n  vec4 I = getPosition(H);\n#else\nvec4 I = getPosition(aPosition);\n#endif\nvModelVertex = (modelMatrix * I).xyz;\n#if defined(HAS_TANGENT)\nvModelBiTangent = cross(vModelNormal, vModelTangent.xyz) * sign(aTangent.w);\n#endif\n#ifdef HAS_SSR\nmat3 J = modelViewNormalMatrix * E;\n  vViewNormal = J * d;\n#if defined(HAS_TANGENT)\nvec4 K = vec4(t, aTangent.w);\n  vViewTangent = vec4(J * K.xyz, K.w);\n#endif\n#endif\nvec4 L = D * I;\n  vec4 M = modelViewMatrix * L;\n  vViewVertex = M;\n  mat4 N = projMatrix;\n  N[2].xy += halton.xy / outSize.xy;\n  gl_Position = N * M;\n#if defined(HAS_COLOR)\nvColor = aColor / 255.;\n#endif\n#if defined(HAS_COLOR0)\nvColor0 = aColor0 / 255.;\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nshadow_computeShadowPars(L);\n#endif\n#ifdef HAS_VIEWSHED\nviewshed_getPositionFromViewpoint(modelMatrix * L);\n#endif\n#ifdef HAS_FLOODANALYSE\nflood_getHeight(modelMatrix * L);\n#endif\n#ifdef HAS_HEATMAP\nheatmap_compute(projMatrix * modelViewMatrix * D, I);\n#endif\n#ifdef HAS_FOG\nfog_getDist(modelMatrix * L);\n#endif\n#if defined(HAS_BUMP_MAP) && defined(HAS_TANGENT)\nmat3 O = f(mat3(vModelTangent.xyz, vModelBiTangent, vModelNormal));\n  vTangentViewPos = O * cameraPosition;\n  vTangentFragPos = O * vModelVertex;\n#endif\n}",
	                frag: e.frag || "#if __VERSION__ == 100\n#if defined(GL_EXT_shader_texture_lod)\n#extension GL_EXT_shader_texture_lod : enable\n#define textureCubeLod(tex, uv, lod) textureCubeLodEXT(tex, uv, lod)\n#else\n#define textureCubeLod(tex, uv, lod) textureCube(tex, uv, lod)\n#endif\n#if defined(GL_OES_standard_derivatives)\n#extension GL_OES_standard_derivatives : enable\n#endif\n#else\n#define textureCubeLod(tex, uv, lod) textureLod(tex, uv, lod)\n#endif\n#define saturate(x)        clamp(x, 0.0, 1.0)\nprecision mediump float;\n#include <gl2_frag>\n#include <hsv_frag>\nuniform vec3 hsv;\nuniform float contrast;\nconst float c = .04;\nstruct MaterialUniforms {\n  vec2 roughnessMetalness;\n  vec3 albedo;\n  float alpha;\n  vec3 normal;\n  vec3 emit;\n  float ao;\n  vec3 specularColor;\n  float glossiness;\n} d;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n#include <vsm_shadow_frag>\n#endif\nuniform vec3 cameraPosition;\n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nuniform vec4 diffuseFactor;\nuniform vec3 specularFactor;\nuniform float glossinessFactor;\n#if defined(HAS_DIFFUSE_MAP)\nuniform sampler2D diffuseTexture;\n#endif\n#if defined(HAS_SPECULARGLOSSINESS_MAP)\nuniform sampler2D specularGlossinessTexture;\n#endif\n#endif\nuniform vec3 emissiveFactor;\nuniform vec4 baseColorFactor;\nuniform float baseColorIntensity;\nuniform float anisotropyDirection;\nuniform float anisotropyFactor;\nuniform float clearCoatFactor;\nuniform float clearCoatIor;\nuniform float clearCoatRoughnessFactor;\nuniform float clearCoatThickness;\nuniform float emitColorFactor;\nuniform float occlusionFactor;\nuniform float environmentExposure;\nuniform float roughnessFactor;\nuniform float metallicFactor;\nuniform float normalMapFactor;\nuniform float rgbmRange;\nuniform float specularF0;\nuniform int emitMultiplicative;\nuniform int normalMapFlipY;\nuniform int outputSRGB;\nuniform mat3 uEnvironmentTransform;\n#if defined(HAS_ALBEDO_MAP)\nuniform sampler2D baseColorTexture;\n#endif\n#if defined(HAS_METALLICROUGHNESS_MAP)\nuniform sampler2D metallicRoughnessTexture;\n#endif\n#if defined(HAS_EMISSIVE_MAP)\nuniform sampler2D emissiveTexture;\n#endif\n#if defined(HAS_AO_MAP)\nuniform sampler2D occlusionTexture;\n#endif\n#if defined(HAS_NORMAL_MAP) && defined(HAS_TANGENT)\nuniform sampler2D normalTexture;\n#endif\n#if defined(HAS_ALPHAMODE)\nuniform float alphaCutoff;\n#endif\n#ifdef HAS_RANDOM_TEX\nuniform highp vec2 uvOrigin;\nuniform highp float uvRotation;\nuniform sampler2D noiseTexture;\n#endif\nuniform sampler2D brdfLUT;\n#if defined(HAS_IBL_LIGHTING)\nuniform vec3 hdrHSV;\nuniform samplerCube prefilterMap;\nuniform vec3 diffuseSPH[9];\nuniform vec2 prefilterMiplevel;\nuniform vec2 prefilterSize;\n#else\nuniform vec3 ambientColor;\n#endif\nuniform vec2 cameraNearFar;\nuniform vec3 clearCoatTint;\nuniform vec3 light0_viewDirection;\nuniform vec4 light0_diffuse;\n#ifdef HAS_SSR\nvarying vec3 vViewNormal;\n#if defined(HAS_TANGENT)\nvarying vec4 vViewTangent;\n#endif\n#endif\nvarying vec3 vModelVertex;\nvarying vec4 vViewVertex;\n#if defined(HAS_MAP)\nvarying highp vec2 vTexCoord;\n#endif\nvarying vec3 vModelNormal;\n#if defined(HAS_TANGENT)\nvarying vec4 vModelTangent;\nvarying vec3 vModelBiTangent;\n#endif\n#if defined(HAS_COLOR0)\n#if COLOR0_SIZE == 3\nvarying vec3 vColor0;\n#else\nvarying vec4 vColor0;\n#endif\n#endif\n#if defined(HAS_COLOR)\nvarying vec4 vColor;\n#elif defined(IS_LINE_EXTRUSION)\nuniform vec4 lineColor;\n#else\nuniform vec4 polygonFill;\n#endif\n#ifdef HAS_INSTANCE_COLOR\nvarying vec4 vInstanceColor;\n#endif\n#ifdef IS_LINE_EXTRUSION\nuniform float lineOpacity;\n#else\nuniform float polygonOpacity;\n#endif\n#include <viewshed_frag>\n#include <flood_frag>\n#include <heatmap_render_frag>\n#include <fog_render_frag>\n#ifdef HAS_RANDOM_TEX\nconst float e = .5;\nvec2 f(vec2 h, float i) {\n  return vec2(cos(i) * (h.x - e) + sin(i) * (h.y - e) + e, cos(i) * (h.y - e) - sin(i) * (h.x - e) + e);\n}\nfloat j(vec3 k) {\n  return k.x + k.y + k.z;\n}\n#endif\nvec4 l(sampler2D m, in vec2 h) {\n  \n#ifdef HAS_RANDOM_TEX\nhighp vec2 n = uvOrigin;\n  if(uvRotation != .0) {\n    n = f(n, uvRotation);\n  }\n  highp vec2 o = h + n - mod(n, 1.);\n  float u = texture2D(noiseTexture, .005 * o).x;\n  vec2 A = dFdx(o);\n  vec2 B = dFdx(o);\n  float C = u * 8.;\n  float D = fract(C);\n#if 1\nfloat E = floor(C);\n  float F = E + 1.;\n#else\nfloat E = floor(C + .5);\n  float F = floor(C);\n  D = min(D, 1. - D) * 2.;\n#endif\nvec2 G = sin(vec2(3., 7.) * E);\n  vec2 H = sin(vec2(3., 7.) * F);\n  float I = .5;\n  vec4 J = texture2DGradEXT(m, h + I * G, A, B);\n  vec4 K = texture2DGradEXT(m, h + I * H, A, B);\n  return mix(J, K, smoothstep(.2, .8, D - .1 * j(J.xyz - K.xyz)));\n#else\nreturn texture2D(m, h);\n#endif\n}\n#if defined(HAS_BUMP_MAP) && defined(HAS_TANGENT)\nuniform sampler2D bumpTexture;\nuniform float bumpScale;\nuniform float bumpMaxLayers;\nuniform float bumpMinLayers;\nvec2 L(vec2 h, vec3 M) {\n  float N = mix(bumpMaxLayers, bumpMinLayers, abs(dot(vec3(.0, .0, 1.), M)));\n  float O = 1. / N;\n  float P = .0;\n  vec2 Q = M.xy * bumpScale / (M.z * N);\n  vec2 R = h;\n  float S = l(bumpTexture, R).r;\n  for(int T = 0; T < 30; T++) {\n    P += O;\n    R -= Q;\n    S = l(bumpTexture, R).r;\n    if(S < P) {\n      break;\n    }\n  }\n  vec2 U = R + Q;\n  float V = S - P;\n  float W = l(bumpTexture, U).r - P + O;\n  return mix(R, U, V / (V - W));\n}\nvarying vec3 vTangentViewPos;\nvarying vec3 vTangentFragPos;\n#endif\n#define SHADER_NAME PBR\nvec3 X(const in vec3 Y) {\n  return vec3(Y.r < .0031308 ? Y.r * 12.92 : 1.055 * pow(Y.r, 1. / 2.4) - .055, Y.g < .0031308 ? Y.g * 12.92 : 1.055 * pow(Y.g, 1. / 2.4) - .055, Y.b < .0031308 ? Y.b * 12.92 : 1.055 * pow(Y.b, 1. / 2.4) - .055);\n}\nvec3 Z(const in vec3 Y) {\n  return vec3(Y.r < .04045 ? Y.r * (1. / 12.92) : pow((Y.r + .055) * (1. / 1.055), 2.4), Y.g < .04045 ? Y.g * (1. / 12.92) : pow((Y.g + .055) * (1. / 1.055), 2.4), Y.b < .04045 ? Y.b * (1. / 12.92) : pow((Y.b + .055) * (1. / 1.055), 2.4));\n}\nvec3 ba(const in vec4 Y, const in float bb) {\n  if(bb <= .0)\n    return Y.rgb;\n  return bb * Y.rgb * Y.a;\n}\nvec3 bc() {\n  return d.albedo;\n}\nfloat bd() {\n  \n#if defined(HAS_ALPHAMODE)\nif(d.alpha >= alphaCutoff) {\n    return 1.;\n  } else {\n    return .0;\n  }\n#else\nreturn d.alpha;\n#endif\n}\nfloat be() {\n  \n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nvec3 Y = d.specularColor;\n  return max(max(Y.r, Y.g), Y.b);\n#else\nreturn d.roughnessMetalness.y;\n#endif\n}\nfloat bf() {\n  return specularF0;\n}\nfloat bg() {\n  \n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nreturn 1. - d.glossiness;\n#else\nreturn d.roughnessMetalness.x;\n#endif\n}\nvec3 bh() {\n  return d.emit;\n}\nvec3 bi() {\n  return d.normal;\n}\nfloat bj() {\n  return clearCoatFactor;\n}\nfloat bk() {\n  return clearCoatRoughnessFactor;\n}\nfloat bl() {\n  return d.ao;\n}\nfloat bm(const in vec4 bn) {\n  return bn.r + bn.g / 255.;\n}\nfloat bo(const in vec2 bp, const in float bq) {\n  vec3 br = vec3(.06711056, .00583715, 52.9829189);\n  return fract(br.z * fract(dot(bp.xy + bq * vec2(47., 17.) * .695, br.xy))) * .5;\n}\nvec3 bs(const in float bt, in vec3 bu, const in vec3 t, const in vec3 b, in vec3 bv) {\n  bu.xy = bt * bu.xy;\n  mat3 bw = mat3(t, b, bv);\n  return normalize(bw * bu);\n}\nvoid bx(const in vec3 by, const in vec3 bu, const in vec3 bz, out float bA, out vec3 bB, out float bC) {\n  bA = 1.;\n  bB = -bz;\n  bC = dot(bB, bu);\n}\nvec4 bD(const in vec3 bu, const in vec3 by, const in float bE) {\n  float bF = clamp(dot(bu, by), 0., 1.);\n  float bG = bE * bE;\n  return vec4(bG, bG * bG, bF, bF * (1. - bG));\n}\nfloat bH(const vec4 bD, const float bI) {\n  float bJ = bD.y;\n  float bK = (bI * bJ - bI) * bI + 1.;\n  return bJ / (3.141593 * bK * bK);\n}\nvec3 bL(const vec3 bM, const float bN, const in float bO) {\n  float bP = pow(1. - bO, 5.);\n  return bN * bP + (1. - bP) * bM;\n}\nfloat bL(const float bM, const float bN, const in float bO) {\n  return bM + (bN - bM) * pow(1. - bO, 5.);\n}\nfloat bQ(const vec4 bD, const float bR) {\n  float a = bD.x;\n  float bS = bR * (bD.w + a);\n  float bT = bD.z * (bR * (1. - a) + a);\n  return .5 / (bS + bT);\n}\nvec3 bU(const vec4 bD, const vec3 bu, const vec3 by, const vec3 bB, const vec3 bV, const float bR, const float bN) {\n  vec3 bW = normalize(by + bB);\n  float bI = clamp(dot(bu, bW), 0., 1.);\n  float bO = clamp(dot(bB, bW), 0., 1.);\n  float bX = bH(bD, bI);\n  float bY = bQ(bD, bR);\n  vec3 bZ = bL(bV, bN, bO);\n  return (bX * bY * 3.141593) * bZ;\n}\nvoid ca(const in vec3 bu, const in vec3 by, const in float bR, const in vec4 bD, const in vec3 cb, const in vec3 bV, const in float bA, const in vec3 cc, const in vec3 bB, const in float bN, out vec3 cd, out vec3 ce, out bool cf) {\n  cf = bR > .0;\n  if(cf == false) {\n    ce = cd = vec3(.0);\n    return;\n  }\n  vec3 cg = bA * bR * cc;\n  ce = cg * bU(bD, bu, by, bB, bV, bR, bN);\n  cd = cg * cb;\n}\nfloat ch(float at, float ab, float ci, float cj, float ck, float cl, float bF, float bR) {\n  float cm = bR * length(vec3(at * ci, ab * cj, bF));\n  float cn = bF * length(vec3(at * ck, ab * cl, bR));\n  return .5 / (cm + cn);\n}\nfloat co(const float at, const float ab, const float cp, const float cq, const float bI) {\n  float bJ = at * ab;\n  vec3 bK = vec3(ab * cp, at * cq, bJ * bI);\n  float x = bJ / dot(bK, bK);\n  return bJ * (x * x) / 3.141593;\n}\nvec3 cr(const vec4 bD, const vec3 bu, const vec3 by, const vec3 bB, const vec3 bV, const float bR, const float bN, const in vec3 cs, const in vec3 ct, const in float cu) {\n  vec3 bW = normalize(by + bB);\n  float bI = clamp(dot(bu, bW), 0., 1.);\n  float bF = clamp(dot(bu, by), 0., 1.);\n  float bO = clamp(dot(bB, bW), 0., 1.);\n  float ci = dot(cs, by);\n  float cj = dot(ct, by);\n  float ck = dot(cs, bB);\n  float cl = dot(ct, bB);\n  float cp = dot(cs, bW);\n  float cq = dot(ct, bW);\n  float cv = sqrt(1. - abs(cu) * .9);\n  if(cu > .0)\n    cv = 1. / cv;\n  float at = bD.x * cv;\n  float ab = bD.x / cv;\n  float bX = co(at, ab, cp, cq, bI);\n  float bY = ch(at, ab, ci, cj, ck, cl, bF, bR);\n  vec3 bZ = bL(bV, bN, bO);\n  return (bX * bY * 3.141593) * bZ;\n}\nvoid cw(const in vec3 bu, const in vec3 by, const in float bR, const in vec4 bD, const in vec3 cb, const in vec3 bV, const in float bA, const in vec3 cc, const in vec3 bB, const in float bN, const in vec3 cs, const in vec3 ct, const in float cu, out vec3 cd, out vec3 ce, out bool cf) {\n  cf = bR > .0;\n  if(cf == false) {\n    ce = cd = vec3(.0);\n    return;\n  }\n  vec3 cg = bA * bR * cc;\n  ce = cg * cr(bD, bu, by, bB, bV, bR, bN, cs, ct, cu);\n  cd = cg * cb;\n}\n#if defined(HAS_IBL_LIGHTING)\nvec3 cx(const in vec3 bu) {\n  vec3 bv = uEnvironmentTransform * bu;\n  float x = bv.x;\n  float y = bv.y;\n  float z = bv.z;\n  vec3 cy = (diffuseSPH[0] + diffuseSPH[1] * x + diffuseSPH[2] * y + diffuseSPH[3] * z + diffuseSPH[4] * z * x + diffuseSPH[5] * y * z + diffuseSPH[6] * y * x + diffuseSPH[7] * (3. * z * z - 1.) + diffuseSPH[8] * (x * x - y * y));\n  if(length(hdrHSV) > .0) {\n    cy = hsv_apply(cy, hdrHSV);\n  }\n  return max(cy, vec3(.0));\n}\nfloat cz(const in float cA) {\n  return cA;\n}\nvec3 cB(const in float cC, const in vec3 cD) {\n  vec3 cE = cD;\n  float cF = prefilterMiplevel.x;\n  float cG = min(cF, cz(cC) * prefilterMiplevel.y);\n  vec3 cH = ba(textureCubeLod(prefilterMap, cE, cG), rgbmRange);\n  if(length(hdrHSV) > .0) {\n    return hsv_apply(cH, hdrHSV);\n  } else {\n    return cH;\n  }\n}\nvec3 cI(const in vec3 cJ, const in vec3 cD, const in float cK) {\n  float cL = 1. - cK;\n  float cM = cL * (sqrt(cL) + cK);\n  return mix(cJ, cD, cM);\n}\nvec3 cN(const in vec3 bu, const in vec3 by, const in float bE, const in vec3 cO) {\n  vec3 cD = reflect(-by, bu);\n  cD = cI(bu, cD, bE);\n  vec3 cP = cB(bE, uEnvironmentTransform * cD);\n  float bt = clamp(1. + dot(cD, cO), .0, 1.);\n  cP *= bt * bt;\n  return cP;\n}\n#else\nvec3 cN(const in vec3 bu, const in vec3 by, const in float bE, const in vec3 cO) {\n  return ambientColor;\n}\n#endif\nvec3 cQ(const in vec3 bV, const in float bE, const in float bF, const in float bN) {\n  vec4 rgba = texture2D(brdfLUT, vec2(bF, bE));\n  float b = (rgba[3] * 65280.0 + rgba[2] * 255.);\n  float a = (rgba[1] * 65280.0 + rgba[0] * 255.);\n  const float cR = 1. / 65535.;\n  return (bV * a + b * bN) * cR;\n}\nvec3 cS(const in vec3 bu, const in vec3 by, const in float bE, const in vec3 bV, const in vec3 cO, const in float bN) {\n  float bF = dot(bu, by);\n  return cN(bu, by, bE, cO) * cQ(bV, bE, bF, bN);\n}\nvec3 cT(const float bF, const float bR, const vec3 cU, const float bK) {\n  return exp(cU * -bK * ((bR + bF) / max(bR * bF, 1e-3)));\n}\nvec3 cV(const in float bF, const in float bR, const in float cW) {\n  return mix(vec3(1.), cT(bF, bR, clearCoatTint, clearCoatThickness), cW);\n}\nvoid cX(const in float cY, const in vec3 bu, const in vec3 by, const in float bC, const in vec4 bD, const in float bA, const in vec3 cc, const in vec3 bB, const in float cW, out vec3 cZ, out vec3 da) {\n  if(bC <= .0) {\n    cZ = vec3(.0);\n    da = vec3(.0);\n    return;\n  }\n  float db = clamp(dot(bu, -refract(bB, bu, 1. / clearCoatIor)), 0., 1.);\n  vec3 dc = cV(cY, db, cW);\n  vec3 bW = normalize(by + bB);\n  float bI = clamp(dot(bu, bW), 0., 1.);\n  float bO = clamp(dot(bB, bW), 0., 1.);\n  float bX = bH(bD, bI);\n  float bY = bQ(bD, db);\n  float bZ = bL(c, 1., bO);\n  cZ = (bA * bC * cW * bX * bY * 3.141593 * bZ) * cc;\n  da = (1. - bZ * cW) * dc;\n}\nfloat dd(const in int de, const in float df, const in vec3 bu, const in vec3 by) {\n  if(de == 0)\n    return 1.;\n  float bK = dot(bu, by) + df;\n  return clamp(bK * bK - 1. + df, .0, 1.);\n}\nvec3 dg(const in vec3 bu, const in vec3 by, const in float bE, const in vec3 cs, const in vec3 ct, const in float cu) {\n  vec3 dh = cu >= .0 ? ct : cs;\n  vec3 di = cross(dh, by);\n  vec3 dj = cross(di, dh);\n  float dk = abs(cu) * clamp(5. * bE, .0, 1.);\n  return normalize(mix(bu, dj, dk));\n}\nvoid dl() {\n  \n#ifdef HAS_MAP\nvec2 h = vTexCoord;\n#endif\n#if defined(HAS_BUMP_MAP) && defined(HAS_TANGENT)\nh = L(h, normalize(vTangentViewPos - vTangentFragPos));\n#endif\nd.albedo = baseColorIntensity * baseColorFactor.rgb;\n  d.alpha = baseColorFactor.a;\n#if defined(HAS_ALBEDO_MAP)\nvec4 dm = l(baseColorTexture, h);\n  d.albedo *= Z(dm.rgb);\n  d.alpha *= dm.a;\n#endif\n#if defined(HAS_COLOR0)\nd.albedo *= vColor0.rgb;\n#if COLOR0_SIZE == 4\nd.alpha *= vColor0.a;\n#endif\n#endif\n#if defined(HAS_COLOR)\nd.albedo *= vColor.rgb;\n  d.alpha *= vColor.a;\n#elif defined(IS_LINE_EXTRUSION)\nd.albedo *= lineColor.rgb;\n  d.alpha *= lineColor.a;\n#else\nd.albedo *= polygonFill.rgb;\n  d.alpha *= polygonFill.a;\n#endif\n#if defined(HAS_INSTANCE_COLOR)\nd.albedo *= vInstanceColor.rgb;\n  d.alpha *= vInstanceColor.a;\n#endif\n#if defined(IS_LINE_EXTRUSION)\nd.alpha *= lineOpacity;\n#else\nd.alpha *= polygonOpacity;\n#endif\n#if defined(HAS_METALLICROUGHNESS_MAP)\nd.roughnessMetalness = l(metallicRoughnessTexture, h).gb * vec2(roughnessFactor, metallicFactor);\n#else\nd.roughnessMetalness = vec2(roughnessFactor, metallicFactor);\n#endif\nd.emit = emissiveFactor;\n#if defined(HAS_EMISSIVE_MAP)\nif(emitMultiplicative == 1) {\n    d.emit *= Z(l(emissiveTexture, h).rgb);\n  } else {\n    d.emit += Z(l(emissiveTexture, h).rgb);\n  }\n#endif\nd.emit *= emitColorFactor;\n#if defined(HAS_AO_MAP)\nd.ao = l(occlusionTexture, h).r;\n#else\nd.ao = 1.;\n#endif\nd.ao *= occlusionFactor;\n#if defined(HAS_NORMAL_MAP) && defined(HAS_TANGENT)\nvec3 dn = l(normalTexture, h).xyz * 2. - 1.;\n  dn.y = normalMapFlipY == 1 ? -dn.y : dn.y;\n  d.normal = dn;\n#else\nd.normal = normalize(vModelNormal);\n#endif\n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nd.albedo *= diffuseFactor.rgb;\n  d.alpha *= diffuseFactor.a;\n#if defined(HAS_DIFFUSE_MAP)\nvec4 cb = l(diffuseTexture, h);\n  d.albedo *= Z(cb.rgb);\n  d.alpha *= cb.a;\n#endif\nd.specularColor = specularFactor;\n  d.glossiness = glossinessFactor;\n#if defined(HAS_SPECULARGLOSSINESS_MAP)\nvec4 dp = l(specularGlossinessTexture, h);\n  d.specularColor *= Z(dp.rgb);\n  d.glossiness *= dp.a;\n#endif\n#endif\n}\nvec3 dq(const vec3 x) {\n  const float a = 2.51;\n  const float b = .03;\n  const float dr = 2.43;\n  const float bK = .59;\n  const float ds = .14;\n  return (x * (a * x + b)) / (x * (dr * x + bK) + ds);\n}\nvec3 dt(vec3 Y) {\n  Y = dq(Y);\n  return Y = pow(Y, vec3(1. / 2.2));\n}\nuniform float specularAAVariance;\nuniform float specularAAThreshold;\nfloat du(float bE, const vec3 dv) {\n  \n#if defined(GL_OES_standard_derivatives) || __VERSION__ == 300\nvec3 dw = dFdx(dv);\n  vec3 dx = dFdy(dv);\n  float dy = specularAAVariance * (dot(dw, dw) + dot(dx, dx));\n  float dz = min(2. * dy, specularAAThreshold);\n  float dA = saturate(bE * bE + dz);\n  return sqrt(dA);\n#else\nreturn bE;\n#endif\n}\n#ifdef HAS_SSR\nuniform sampler2D TextureDepth;\nuniform highp vec2 outSize;\nuniform float ssrFactor;\nuniform float ssrQuality;\nuniform sampler2D TextureReflected;\nuniform highp mat4 projMatrix;\nuniform mat4 invProjMatrix;\nuniform vec4 outputFovInfo[2];\nuniform mat4 reprojViewProjMatrix;\nvec3 dB(const in mat4 dC, const in vec3 dD) {\n  vec4 dE = dC * vec4(dD, 1.);\n  return vec3(.5 + .5 * dE.xy / dE.w, dE.w);\n}\nvec3 dF(const in float dG, const in vec2 h) {\n  return texture2D(TextureReflected, h).rgb;\n}\nfloat dH(float dI) {\n  highp mat4 dC = projMatrix;\n  highp float z = dI * 2. - 1.;\n  return -dC[3].z / (z + dC[2].z);\n}\nfloat dJ(const vec2 h) {\n  float dI = bm(texture2D(TextureDepth, h));\n  return dI;\n}\nvec3 dK(const in float bq, const in vec3 dL, const in vec3 dM, const in vec3 dN, const in vec3 by, const in float dO) {\n  vec2 dP;\n  dP.x = bo(gl_FragCoord.yx, bq);\n  dP.y = fract(dP.x * 52.9829189);\n  dP.y = mix(dP.y, 1., .7);\n  float dQ = 2. * 3.14159 * dP.x;\n  float dR = pow(max(dP.y, .000001), dO / (2. - dO));\n  float dS = sqrt(1. - dR * dR);\n  vec3 dT = vec3(dS * cos(dQ), dS * sin(dQ), dR);\n  dT = dT.x * dL + dT.y * dM + dT.z * dN;\n  return normalize((2. * dot(by, dT)) * dT - by);\n}\nfloat dU(const in float bq) {\n  return (bo(gl_FragCoord.xy, bq) - .5);\n}\nvec3 dV(const in vec3 dW, const in float dX, const in vec3 dY) {\n  vec3 dZ = dB(projMatrix, vViewVertex.xyz + dY * dX);\n  dZ.z = 1. / dZ.z;\n  dZ -= dW;\n  float ea = min(1., .99 * (1. - dW.x) / max(1e-5, dZ.x));\n  float eb = min(1., .99 * (1. - dW.y) / max(1e-5, dZ.y));\n  float ec = min(1., .99 * dW.x / max(1e-5, -dZ.x));\n  float ed = min(1., .99 * dW.y / max(1e-5, -dZ.y));\n  return dZ * min(ea, eb) * min(ec, ed);\n}\nfloat ee(const in vec3 dW, const in vec3 dZ, inout float ef, inout float eg) {\n  float eh = (eg + ef) * .5;\n  vec3 ei = dW + dZ * eh;\n  float z = dJ(ei.xy);\n  float dI = dH(z);\n  float ej = -1. / ei.z;\n  ef = dI > ej ? ef : eh;\n  eg = dI > ej ? eh : eg;\n  return eh;\n}\nvec4 ek(const in vec3 dW, const in float dX, in float el, const in vec3 dY, const in float bE, const in float bq) {\n  int em = 20;\n  float en = 1. / float(em);\n  el *= en;\n  vec3 dZ = dV(dW, dX, dY);\n  float eo = en;\n  vec3 ep = vec3(.0, eo, 1.);\n  vec3 ei;\n  float z, dI, ej, eq, er, es;\n  bool et;\n  float eu = 1.;\n  float eh;\n  for(int T = 0; T < em; T++) {\n    ei = dW + dZ * ep.y;\n    z = dJ(ei.xy);\n    dI = dH(z);\n    ej = -1. / ei.z;\n    float ev = clamp(sign(.999 - z), .0, 1.);\n    eq = ev * (ej - dI);\n    eq *= clamp(sign(abs(eq) - dX * en * en), .0, 1.);\n    et = abs(eq + el) < el;\n    er = clamp(ep.x / (ep.x - eq), .0, 1.);\n    es = et ? ep.y + er * en - en : 1.;\n    ep.z = min(ep.z, es);\n    ep.x = eq;\n    if(et) {\n      float ef = ep.y - en;\n      float eg = ep.y;\n      eh = ee(dW, dZ, ef, eg);\n      eh = ee(dW, dZ, ef, eg);\n      eh = ee(dW, dZ, ef, eg);\n      eu = eh;\n      break;\n    }\n    ep.y += en;\n  }\n  return vec4(dW + dZ * eu, 1. - eu);\n}\nvec4 ew(in vec4 ex, const in float ey, const in vec3 ez, const in vec3 eA, const in float bE) {\n  vec4 eB = mix(outputFovInfo[0], outputFovInfo[1], ex.x);\n  ex.xyz = vec3(mix(eB.xy, eB.zw, ex.y), 1.) * -1. / ex.z;\n  ex.xyz = (reprojViewProjMatrix * vec4(ex.xyz, 1.)).xyw;\n  ex.xy /= ex.z;\n  float eC = clamp(6. - 6. * max(abs(ex.x), abs(ex.y)), .0, 1.);\n  ex.xy = .5 + .5 * ex.xy;\n  vec3 eD = eA * dF(bE * (1. - ex.w), ex.xy);\n  return vec4(mix(ez, eD, ey * eC), 1.);\n}\nvec3 ssr(const in vec3 ez, const in vec3 eA, const in float bE, const in vec3 bu, const in vec3 by) {\n  float eE = .0;\n  vec4 cy = vec4(.0);\n  float dO = bE * bE;\n  dO = dO * dO;\n  vec3 eF = abs(bu.z) < .999 ? vec3(.0, .0, 1.) : vec3(1., .0, .0);\n  vec3 dL = normalize(cross(eF, bu));\n  vec3 dM = cross(bu, dL);\n  float ey = ssrFactor * clamp(-4. * dot(by, bu) + 3.8, .0, 1.);\n  ey *= clamp(4.7 - bE * 5., .0, 1.);\n  vec3 dW = dB(projMatrix, vViewVertex.xyz);\n  dW.z = 1. / dW.z;\n  vec3 dY = dK(eE, dL, dM, bu, by, dO);\n  float dX = mix(cameraNearFar.y + vViewVertex.z, -vViewVertex.z - cameraNearFar.x, dY.z * .5 + .5);\n  float el = .5 * dX;\n  vec4 ex;\n  if(dot(dY, bu) > .001 && ey > .0) {\n    ex = ek(dW, dX, el, dY, bE, eE);\n    if(ex.w > .0)\n      cy += ew(ex, ey, ez, eA, bE);\n    \n  }\n  return cy.w > .0 ? cy.rgb / cy.w : ez;\n}\n#endif\nvoid main() {\n  dl();\n  vec3 by = normalize(cameraPosition - vModelVertex.xyz);\n#if defined(HAS_DOUBLE_SIDE)\nvec3 cO = gl_FrontFacing ? normalize(vModelNormal) : -normalize(vModelNormal);\n#else\nvec3 cO = normalize(vModelNormal);\n#endif\n#if defined(HAS_TANGENT)\nvec4 eG;\n  eG = vModelTangent;\n#if defined(HAS_DOUBLE_SIDE)\neG.xyz = gl_FrontFacing ? normalize(eG.xyz) : -normalize(eG.xyz);\n#else\neG.xyz = normalize(eG.xyz);\n#endif\nvec3 eH = normalize(vModelBiTangent);\n#endif\nfloat bM = .08 * bf();\n  float eI = be();\n  vec3 eJ = bc();\n#if defined(SHADING_MODEL_SPECULAR_GLOSSINESS)\nvec3 eK = d.specularColor;\n#else\nvec3 eK = mix(vec3(bM), eJ, eI);\n#endif\neJ *= 1. - eI;\n  float eL = clamp(50.0 * eK.g, .0, 1.);\n  float eM = bg();\n  if(specularAAVariance > .0) {\n    eM = du(eM, cO);\n  }\n  vec3 eN = bh();\n  vec3 eO = bi();\n  vec3 eP = vec3(eO);\n#if defined(HAS_TANGENT) && defined(HAS_NORMAL_MAP)\neP = bs(normalMapFactor, eP, eG.xyz, eH, cO);\n#endif\nfloat eQ = bj();\n  float eR = bk();\n  if(specularAAVariance > .0) {\n    eR = du(eR, cO);\n  }\n  vec3 eS = cO;\n#if defined(HAS_TANGENT)\nfloat cu;\n  vec3 cs;\n  vec3 ct;\n  if(anisotropyFactor > .0) {\n    cu = anisotropyFactor;\n    eG.xyz = normalize(eG.xyz - eP * dot(eG.xyz, eP));\n    eH = normalize(cross(eP, eG.xyz)) * eG.w;\n    cs = normalize(mix(eG.xyz, eH, anisotropyDirection));\n    ct = normalize(mix(eH, -eG.xyz, anisotropyDirection));\n  }\n#endif\nvec3 cb = vec3(.0);\n  vec3 bV = vec3(.0);\n  vec3 eT;\n#if defined(HAS_TANGENT)\nif(anisotropyFactor > .0) {\n    eT = dg(eP, by, eM, cs, ct, cu);\n  } else {\n    eT = eP;\n  }\n#else\neT = eP;\n#endif\n#if defined(HAS_IBL_LIGHTING)\ncb = eJ * cx(eP) * .5;\n#else\ncb = eJ * ambientColor;\n#endif\nbV = cS(eT, by, eM, eK, cO, eL);\n  float cY;\n  if(clearCoatFactor > .0) {\n    cY = clamp(dot(eS, -refract(by, eS, 1. / clearCoatIor)), 0., 1.);\n    float eU = eQ * bL(c, 1., cY);\n    vec3 eV = cV(cY, cY, eQ);\n    bV = mix(bV * eV, cN(eS, by, eR, cO), eU);\n    cb *= eV * (1. - eU);\n  }\n  float eW = 1.;\n  float eX = bl();\n  cb *= environmentExposure * eX;\n#ifdef HAS_IBL_LIGHTING\neW = dd(1, eX, eP, by);\n#endif\n#ifdef HAS_SSR\nvec3 eY = normalize(gl_FrontFacing ? vViewNormal : -vViewNormal);\n  vec3 eZ = eY;\n#if defined(HAS_TANGENT) && defined(HAS_NORMAL_MAP)\nvec4 fa;\n  fa = vViewTangent;\n  fa = gl_FrontFacing ? fa : -fa;\n  fa.xyz = normalize(fa.xyz);\n  vec3 fb = normalize(cross(eY, fa.xyz)) * fa.w;\n  eZ = bs(normalMapFactor, eO, fa.xyz, fb, eY);\n#endif\nbV = ssr(bV, eK * eW, eM, eZ, -normalize(vViewVertex.xyz));\n#endif\nbV *= environmentExposure * eW;\n  float bA, bC;\n  vec3 bB;\n  bool cf;\n  vec3 fc;\n  vec3 fd;\n  vec4 fe = bD(eP, by, max(.045, eM));\n  vec3 ff = vModelNormal;\n  bx(by, eP, light0_viewDirection, bA, bB, bC);\n#if defined(HAS_TANGENT)\nif(anisotropyFactor > .0) {\n    cw(eP, by, bC, fe, eJ, eK, bA, light0_diffuse.rgb, bB, eL, cs, ct, cu, fd, fc, cf);\n  } else {\n    ca(eP, by, bC, fe, eJ, eK, bA, light0_diffuse.rgb, bB, eL, fd, fc, cf);\n  }\n#else\nca(eP, by, bC, fe, eJ, eK, bA, light0_diffuse.rgb, bB, eL, fd, fc, cf);\n#endif\nif(clearCoatFactor > .0) {\n    vec3 fg;\n    vec3 fh;\n    vec4 fi = bD(eS, by, eR);\n    cX(cY, eS, by, dot(eS, bB), fi, bA, light0_diffuse.rgb, bB, eQ, fg, fh);\n    fd *= fh;\n    fc = fg + fc * fh;\n  }\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\nfloat fj = shadow_computeShadow();\n  fd = shadow_blend(fd, fj).rgb;\n  fc = shadow_blend(fc, fj).rgb;\n#endif\nvec3 fk = vec3(bV);\n  vec3 fl = vec3(cb);\n  cb += fd;\n  bV += fc;\n  cb += eN;\n  vec3 fm = bV + cb;\n  if(outputSRGB == 1)\n    fm = X(fm);\n  glFragColor = vec4(fm, bd());\n#ifdef HAS_HEATMAP\nglFragColor = heatmap_getColor(glFragColor);\n#endif\n#ifdef HAS_VIEWSHED\nglFragColor = viewshed_draw(glFragColor);\n#endif\n#ifdef HAS_FLOODANALYSE\nglFragColor = draw_floodAnalyse(glFragColor);\n#endif\n#ifdef HAS_FOG\nglFragColor = draw_fog(glFragColor);\n#endif\nif(contrast != 1.) {\n    glFragColor = contrastMatrix(contrast) * glFragColor;\n  }\n  if(length(hsv) > .0) {\n    glFragColor = hsv_apply(glFragColor, hsv);\n  }\n#if __VERSION__ == 100\ngl_FragColor = glFragColor;\n#endif\n}",
	                uniforms: u,
	                extraCommandProps: t,
	                defines: o
	            }), this.version = 300;
	        }
	        getGeometryDefines(e) {
	            const t = {};
	            return e.data[e.desc.tangentAttribute] ? t.HAS_TANGENT = 1 : e.data[e.desc.normalAttribute] && (t.HAS_NORMAL = 1), 
	            t;
	        }
	    },
	    StandardDepthShader: class extends Wt {
	        constructor(e = {}) {
	            const t = [];
	            super({
	                vert: "#define SHADER_NAME depth_vert\nprecision highp float;\nattribute vec3 aPosition;\n#include <line_extrusion_vert>\nuniform mat4 modelViewMatrix;\nuniform mat4 positionMatrix;\nuniform mat4 projMatrix;\nuniform vec2 outSize;\nuniform vec2 halton;\n#include <get_output>\nvoid main() {\n  mat4 c = getPositionMatrix();\n#ifdef IS_LINE_EXTRUSION\nvec4 d = getPosition(getLineExtrudePosition(aPosition));\n#else\nvec4 d = getPosition(aPosition);\n#endif\nvec4 e = modelViewMatrix * c * d;\n  mat4 f = projMatrix;\n  f[2].xy += halton.xy / outSize.xy;\n  gl_Position = f * e;\n}",
	                frag: "#define SHADER_NAME depth_frag\nprecision highp float;\nvoid main() {\n  gl_FragColor = vec4(1., .0, .0, 1.);\n}",
	                uniforms: [ {
	                    name: "modelViewMatrix",
	                    type: "function",
	                    fn: (e, n) => multiply$5(t, n.viewMatrix, n.modelMatrix)
	                } ],
	                extraCommandProps: e.extraCommandProps,
	                defines: e.defines
	            });
	        }
	    },
	    PBRUtils: br
	};

	var reshadergl_es = /*#__PURE__*/Object.freeze({
		__proto__: null,
		AbstractTexture: ve,
		BloomPass: yn,
		BoundingBox: Fe,
		BoxBlurShader: sn,
		Constants: me,
		CopyShader: Dn,
		DeferredRenderer: ye,
		FBORayPicking: Dr,
		FxaaShader: on,
		GLTFHelper: Kn,
		GLTFManager: Yn,
		Geometry: ke,
		HDR: Vr,
		HeatmapDisplayShader: Pn,
		HeatmapShader: En,
		InstancedMesh: it$1,
		Jitter: pn,
		KHRTechniquesWebglManager: zr,
		Material: je,
		Mesh: et$1,
		MeshShader: Wt,
		OutlinePass: Sn,
		PhongMaterial: qe,
		PhongShader: Zt,
		PhongSpecularGlossinessMaterial: Ze,
		Plane: Bt,
		PointLineShader: Qt,
		PostProcessShader: hn,
		QuadShader: rn,
		REGLHelper: Nt,
		Renderer: xe,
		ResourceLoader: st$1,
		Scene: ft$1,
		Shader: Xt,
		ShadowDisplayShader: Sr,
		ShadowMapShader: pr,
		ShadowPass: Ar,
		SkyboxShader: Cn,
		SsaoPass: un,
		SsrPass: An,
		TaaPass: vn,
		Texture2D: Ft,
		TextureCube: Rt,
		ToonMaterial: Ke,
		ToonShader: $t,
		Util: ue,
		ViewshedPass: Mn,
		WaterShader: In,
		WireFrameMaterial: Ge,
		WireframeShader: Kt,
		pbr: jr
	});

	var isArray = Array.isArray;
	var keyList = Object.keys;
	var hasProp = Object.prototype.hasOwnProperty;

	var fastDeepEqual = function equal(a, b) {
	  if (a === b) return true;

	  if (a && b && typeof a == 'object' && typeof b == 'object') {
	    var arrA = isArray(a)
	      , arrB = isArray(b)
	      , i
	      , length
	      , key;

	    if (arrA && arrB) {
	      length = a.length;
	      if (length != b.length) return false;
	      for (i = length; i-- !== 0;)
	        if (!equal(a[i], b[i])) return false;
	      return true;
	    }

	    if (arrA != arrB) return false;

	    var dateA = a instanceof Date
	      , dateB = b instanceof Date;
	    if (dateA != dateB) return false;
	    if (dateA && dateB) return a.getTime() == b.getTime();

	    var regexpA = a instanceof RegExp
	      , regexpB = b instanceof RegExp;
	    if (regexpA != regexpB) return false;
	    if (regexpA && regexpB) return a.toString() == b.toString();

	    var keys = keyList(a);
	    length = keys.length;

	    if (length !== keyList(b).length)
	      return false;

	    for (i = length; i-- !== 0;)
	      if (!hasProp.call(b, keys[i])) return false;

	    for (i = length; i-- !== 0;) {
	      key = keys[i];
	      if (!equal(a[key], b[key])) return false;
	    }

	    return true;
	  }

	  return a!==a && b!==b;
	};

	/*!
	 * @maptalks/fusiongl v0.4.3
	 * LICENSE : UNLICENSED
	 * (c) 2016-2021 maptalks.com
	 */
	function _$1(E){for(let _=1;_<arguments.length;_++){const t=arguments[_];for(const _ in t)E[_]=t[_];}return E}function t(E,...t){for(let R=0;R<t.length;R++)_$1(E,t[R]);}class R$1{constructor(E){this.context=E,this.COLOR_ATTACHMENT0_WEBGL=36064,this.COLOR_ATTACHMENT1_WEBGL=36065,this.COLOR_ATTACHMENT2_WEBGL=36066,this.COLOR_ATTACHMENT3_WEBGL=36067,this.COLOR_ATTACHMENT4_WEBGL=36068,this.COLOR_ATTACHMENT5_WEBGL=36069,this.COLOR_ATTACHMENT6_WEBGL=36070,this.COLOR_ATTACHMENT7_WEBGL=36071,this.COLOR_ATTACHMENT8_WEBGL=36072,this.COLOR_ATTACHMENT9_WEBGL=36073,this.COLOR_ATTACHMENT10_WEBGL=577040,this.COLOR_ATTACHMENT11_WEBGL=577041,this.COLOR_ATTACHMENT12_WEBGL=577042,this.COLOR_ATTACHMENT13_WEBGL=577043,this.COLOR_ATTACHMENT14_WEBGL=577044,this.COLOR_ATTACHMENT15_WEBGL=577045,this.DRAW_BUFFER0_WEBGL=34853,this.DRAW_BUFFER1_WEBGL=34854,this.DRAW_BUFFER2_WEBGL=34855,this.DRAW_BUFFER3_WEBGL=34856,this.DRAW_BUFFER4_WEBGL=34857,this.DRAW_BUFFER5_WEBGL=34858,this.DRAW_BUFFER6_WEBGL=34859,this.DRAW_BUFFER7_WEBGL=34860,this.DRAW_BUFFER8_WEBGL=34861,this.DRAW_BUFFER9_WEBGL=34862,this.DRAW_BUFFER10_WEBGL=34863,this.DRAW_BUFFER11_WEBGL=34864,this.DRAW_BUFFER12_WEBGL=34865,this.DRAW_BUFFER13_WEBGL=34866,this.DRAW_BUFFER14_WEBGL=34867,this.DRAW_BUFFER15_WEBGL=34868,this.MAX_COLOR_ATTACHMENTS_WEBGL=36063,this.MAX_DRAW_BUFFERS_WEBGL=2178;}drawBuffersWEBGL(){return this.context.drawBuffers.apply(this.context,arguments)}}class T$1{constructor(E){this.context=E,this.VERTEX_ARRAY_BINDING_OES=34229;}createVertexArrayOES(){return this.context.createVertexArray()}deleteVertexArrayOES(){return this.context.deleteVertexArray.apply(this.context,arguments)}isVertexArrayOES(){return this.context.isVertexArray.apply(this.context,arguments)}bindVertexArrayOES(){return this.context.bindVertexArray.apply(this.context,arguments)}}class A$1{constructor(E){this.context=E,this.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE=35070;}drawArraysInstancedANGLE(){return this.context.drawArraysInstanced.apply(this.context,arguments)}drawElementsInstancedANGLE(){return this.context.drawElementsInstanced.apply(this.context,arguments)}vertexAttribDivisorANGLE(){return this.context.vertexAttribDivisor.apply(this.context,arguments)}}const s={webgl_depth_texture:{UNSIGNED_INT_24_8_WEBGL:34042},oes_element_index_uint:{},oes_texture_float:{},oes_texture_half_float:{HALF_FLOAT_OES:36193},ext_color_buffer_float:{},oes_standard_derivatives:{},ext_frag_depth:{},ext_blend_minmax:{MIN_EXT:32775,MAX_EXT:32776},ext_shader_texture_lod:{}},r={has(E,_){const t=E._,R=E.t;return !(!t&&!R.getExtension(_))&&(_=_.toLowerCase(),t&&s[_]||"webgl_draw_buffers"===_||"oes_vertex_array_object"===_||"angle_instanced_arrays"===_)},mock(E,_){return _=_.toLowerCase(),s[_]?E._?("oes_texture_float"!==_&&"oes_texture_half_float"!==_||E.t.getExtension("EXT_color_buffer_float"),s[_]):this.t.getExtension(_):"webgl_draw_buffers"===_?new R$1(E):"oes_vertex_array_object"===_?new T$1(E):"angle_instanced_arrays"===_?new A$1(E):null},getInternalFormat:(E,_,t)=>6402===_?33190:34041===_?35056:36193===t&&_===E.RGBA?34842:36193===t&&_===E.RGB?34843:t===E.FLOAT&&_===E.RGBA?34836:t===E.FLOAT&&_===E.RGB?34837:_,getTextureType:(E,_)=>36193===_?E.HALF_FLOAT:_};let e=1;class i{constructor(E){this.uid=e++,this.states=function(E){return {scissor:[0,0,E.canvas.width,E.canvas.height],viewport:[0,0,E.canvas.width,E.canvas.height],blendColor:[0,0,0,0],blendEquationSeparate:[E.FUNC_ADD,E.FUNC_ADD],blendFuncSeparate:[E.ONE,E.ZERO,E.ONE,E.ZERO],clearColor:[0,0,0,0],clearDepth:[1],clearStencil:[0],colorMask:[!0,!0,!0,!0],cullFace:[E.BACK],depthFunc:[E.LESS],depthMask:[!0],depthRange:[0,1],capabilities:{3042:!1,2884:!1,2929:!1,3024:!1,32823:!1,32926:!1,32928:!1,3089:!1,2960:!1},frontFace:[E.CCW],hint:{33170:[E.DONT_CARE],35723:[E.DONT_CARE]},lineWidth:[1],pixelStorei:{3333:[4],3317:[4],37440:[!1],37441:[!1],37443:[E.BROWSER_DEFAULT_WEBGL]},polygonOffset:[0,0],sampleCoverage:[1,!1],stencilFuncSeparate:{1028:[E.ALWAYS,0,4294967295],1029:[E.ALWAYS,0,4294967295]},stencilMaskSeparate:{1028:[4294967295],1029:[4294967295]},stencilOpSeparate:{1028:[E.KEEP,E.KEEP,E.KEEP],1029:[E.KEEP,E.KEEP,E.KEEP]},program:null,framebuffer:{36160:null,36008:null,36009:null},renderbuffer:{36161:null},textures:{active:-1,units:function(){const _=[],t=E.getParameter(E.MAX_COMBINED_TEXTURE_IMAGE_UNITS);for(let E=0;E<t;E++)_.push({3553:null,34067:null});return _[-1]={3553:null,34067:null},_}()},attributes:{},arrayBuffer:null,elementArrayBuffer:null}}(E),this.t=E,this.t._fusiongl_drawCalls=0,this._=typeof WebGL2RenderingContext&&this.t instanceof WebGL2RenderingContext;}get canvas(){return this.t.canvas}get drawingBufferWidth(){return this.t.drawingBufferWidth}get drawingBufferHeight(){return this.t.drawingBufferHeight}get gl(){return this.t}get buffersOES(){return this.R||(this.R=this.t.getExtension("WEBGL_draw_buffers")),this.R}get vaoOES(){return this.T||(this.T=this.t.getExtension("OES_vertex_array_object")),this.T}get angleOES(){return this.A||(this.A=this.t.getExtension("ANGLE_instanced_arrays")),this.A}attachShader(E,_){return this.t.attachShader(E,_)}shaderSource(E,_){return this.t.shaderSource(E,_)}compileShader(E){return this.t.compileShader(E)}createShader(E){return this.t.createShader(E)}createProgram(){return this.t.createProgram()}deleteProgram(E){return this.states.program===E&&(this.states.program=null),this.t.deleteProgram(E)}deleteShader(E){return this.t.deleteShader(E)}detachShader(E,_){return this.t.detachShader(E,_)}getAttachedShaders(E){return this.t.getAttachedShaders(E)}linkProgram(E){return this.t.linkProgram(E)}getShaderParameter(E,_){return this.t.getShaderParameter(E,_)}getShaderPrecisionFormat(E,_){return this.t.getShaderPrecisionFormat(E,_)}getShaderInfoLog(E){return this.t.getShaderInfoLog(E)}getShaderSource(E){return this.t.getShaderSource(E)}getProgramInfoLog(E){return this.t.getProgramInfoLog(E)}getProgramParameter(E,_){return this.t.getProgramParameter(E,_)}getError(){return this.t.getError()}getContextAttributes(){return this.t.getContextAttributes()}getExtension(E){return r.has(this,E)?r.mock(this,E):this.t.getExtension(E)}getSupportedExtensions(){return this.t.getSupportedExtensions()}getParameter(E){return this.t.getParameter(E)}isEnabled(E){return this.t.isEnabled(E)}isProgram(E){return this.t.isProgram(E)}isShader(E){return this.t.isShader(E)}validateProgram(E){return this.t.validateProgram(E)}clear(E){return this.s(),this.t.clear(E)}drawArrays(E,_,t){return this.s(),this.i(),this.t.drawArrays(E,_,t)}drawElements(E,_,t,R){return this.s(),this.i(),this.t.drawElements(E,_,t,R)}drawBuffers(E){return this.s(),this.i(),this._?this.t.drawBuffers(E):this.buffersOES.drawBuffersWEBGL(E)}i(){this.t._fusiongl_drawCalls++;}resetDrawCalls(){this.t._fusiongl_drawCalls=0;}getDrawCalls(){return this.t._fusiongl_drawCalls}N(){const E=this.t,_=E.getParameter(E.CURRENT_PROGRAM),t=E.getProgramParameter(_,E.ACTIVE_ATTRIBUTES),R=[];for(let _=0;_<t;_++)R.push(E.getVertexAttrib(_,E.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING));this.I={buffers:R,elements:E.getParameter(E.ELEMENT_ARRAY_BUFFER_BINDING),framebuffer:E.getParameter(E.FRAMEBUFFER_BINDING)},window.DEBUGGING&&(console.log(this.uid,this.I),console.log(this.uid,this.states.attributes),console.log(this.states.attributes[0].buffer===this.I.buffers[0]),console.log(this.states.attributes[1].buffer===this.I.buffers[1]),console.log(this.states.attributes[2].buffer===this.I.buffers[2]));}finish(){return this.t.finish()}flush(){return this.s(),this.t.flush()}commit(){return this.s(),this.t.commit()}isContextLost(){return this.t.isContextLost()}}t(i.prototype,{DEPTH_BUFFER_BIT:256,STENCIL_BUFFER_BIT:1024,COLOR_BUFFER_BIT:16384,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,ZERO:0,ONE:1,SRC_COLOR:768,ONE_MINUS_SRC_COLOR:769,SRC_ALPHA:770,ONE_MINUS_SRC_ALPHA:771,DST_ALPHA:772,ONE_MINUS_DST_ALPHA:773,DST_COLOR:774,ONE_MINUS_DST_COLOR:775,SRC_ALPHA_SATURATE:776,CONSTANT_COLOR:32769,ONE_MINUS_CONSTANT_COLOR:32770,CONSTANT_ALPHA:32771,ONE_MINUS_CONSTANT_ALPHA:32772,FUNC_ADD:32774,FUNC_SUBSTRACT:32778,FUNC_REVERSE_SUBTRACT:32779,BLEND_EQUATION:32777,BLEND_EQUATION_RGB:32777,BLEND_EQUATION_ALPHA:34877,BLEND_DST_RGB:32968,BLEND_SRC_RGB:32969,BLEND_DST_ALPHA:32970,BLEND_SRC_ALPHA:32971,BLEND_COLOR:32773,ARRAY_BUFFER_BINDING:34964,ELEMENT_ARRAY_BUFFER_BINDING:34965,LINE_WIDTH:2849,ALIASED_POINT_SIZE_RANGE:33901,ALIASED_LINE_WIDTH_RANGE:33902,CULL_FACE_MODE:2885,FRONT_FACE:2886,DEPTH_RANGE:2928,DEPTH_WRITEMASK:2930,DEPTH_CLEAR_VALUE:2931,DEPTH_FUNC:2932,STENCIL_CLEAR_VALUE:2961,STENCIL_FUNC:2962,STENCIL_FAIL:2964,STENCIL_PASS_DEPTH_FAIL:2965,STENCIL_PASS_DEPTH_PASS:2966,STENCIL_REF:2967,STENCIL_VALUE_MASK:2963,STENCIL_WRITEMASK:2968,STENCIL_BACK_FUNC:34816,STENCIL_BACK_FAIL:34817,STENCIL_BACK_PASS_DEPTH_FAIL:34818,STENCIL_BACK_PASS_DEPTH_PASS:34819,STENCIL_BACK_REF:36003,STENCIL_BACK_VALUE_MASK:36004,STENCIL_BACK_WRITEMASK:36005,VIEWPORT:2978,SCISSOR_BOX:3088,COLOR_CLEAR_VALUE:3106,COLOR_WRITEMASK:3107,UNPACK_ALIGNMENT:3317,PACK_ALIGNMENT:3333,MAX_TEXTURE_SIZE:3379,MAX_VIEWPORT_DIMS:3386,SUBPIXEL_BITS:3408,RED_BITS:3410,GREEN_BITS:3411,BLUE_BITS:3412,ALPHA_BITS:3413,DEPTH_BITS:3414,STENCIL_BITS:3415,POLYGON_OFFSET_UNITS:10752,POLYGON_OFFSET_FACTOR:32824,TEXTURE_BINDING_2D:32873,SAMPLE_BUFFERS:32936,SAMPLES:32937,SAMPLE_COVERAGE_VALUE:32938,SAMPLE_COVERAGE_INVERT:32939,COMPRESSED_TEXTURE_FORMATS:34467,VENDOR:7936,RENDERER:7937,VERSION:7938,IMPLEMENTATION_COLOR_READ_TYPE:35738,IMPLEMENTATION_COLOR_READ_FORMAT:35739,BROWSER_DEFAULT_WEBGL:37444,STATIC_DRAW:35044,STREAM_DRAW:35040,DYNAMIC_DRAW:35048,ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,BUFFER_SIZE:34660,BUFFER_USAGE:34661,CURRENT_VERTEX_ATTRIB:34342,VERTEX_ATTRIB_ARRAY_ENABLED:34338,VERTEX_ATTRIB_ARRAY_SIZE:34339,VERTEX_ATTRIB_ARRAY_STRIDE:34340,VERTEX_ATTRIB_ARRAY_TYPE:34341,VERTEX_ATTRIB_ARRAY_NORMALIZED:34922,VERTEX_ATTRIB_ARRAY_POINTER:34373,VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:34975,CULL_FACE:2884,FRONT:1028,BACK:1029,FRONT_AND_BACK:1032,BLEND:3042,DEPTH_TEST:2929,DITHER:3024,POLYGON_OFFSET_FILL:32823,SAMPLE_ALPHA_TO_COVERAGE:32926,SAMPLE_COVERAGE:32928,SCISSOR_TEST:3089,STENCIL_TEST:2960,NO_ERROR:0,INVALID_ENUM:1280,INVALID_VALUE:1281,INVALID_OPERATION:1282,OUT_OF_MEMORY:1285,CONTEXT_LOST_WEBGL:37442,CW:2304,CCW:2305,DONT_CARE:4352,FASTEST:4353,NICEST:4354,GENERATE_MIPMAP_HINT:33170,BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,DEPTH_COMPONENT:6402,ALPHA:6406,RGB:6407,RGBA:6408,LUMINANCE:6409,LUMINANCE_ALPHA:6410,UNSIGNED_SHORT_4_4_4_4:32819,UNSIGNED_SHORT_5_5_5_1:32820,UNSIGNED_SHORT_5_6_5:33635,FRAGMENT_SHADER:35632,VERTEX_SHADER:35633,COMPILE_STATUS:35713,DELETE_STATUS:35712,LINK_STATUS:35714,VALIDATE_STATUS:35715,ATTACHED_SHADERS:35717,ACTIVE_ATTRIBUTES:35721,ACTIVE_UNIFORMS:35718,MAX_VERTEX_ATTRIBS:34921,MAX_VERTEX_UNIFORM_VECTORS:36347,MAX_VARYING_VECTORS:36348,MAX_COMBINED_TEXTURE_IMAGE_UNITS:35661,MAX_VERTEX_TEXTURE_IMAGE_UNITS:35660,MAX_TEXTURE_IMAGE_UNITS:34930,MAX_FRAGMENT_UNIFORM_VECTORS:36349,SHADER_TYPE:35663,SHADING_LANGUAGE_VERSION:35724,CURRENT_PROGRAM:35725,NEVER:512,ALWAYS:519,LESS:513,EQUAL:514,LEQUAL:515,GREATER:516,GEQUAL:518,NOTEQUAL:517,KEEP:7680,REPLACE:7681,INCR:7682,DECR:7683,INVERT:5386,INCR_WRAP:34055,DECR_WRAP:34056,NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987,TEXTURE_MAG_FILTER:10240,TEXTURE_MIN_FILTER:10241,TEXTURE_WRAP_S:10242,TEXTURE_WRAP_T:10243,TEXTURE_2D:3553,TEXTURE:5890,TEXTURE_CUBE_MAP:34067,TEXTURE_BINDING_CUBE_MAP:34068,TEXTURE_CUBE_MAP_POSITIVE_X:34069,TEXTURE_CUBE_MAP_NEGATIVE_X:34070,TEXTURE_CUBE_MAP_POSITIVE_Y:34071,TEXTURE_CUBE_MAP_NEGATIVE_Y:34072,TEXTURE_CUBE_MAP_POSITIVE_Z:34073,TEXTURE_CUBE_MAP_NEGATIVE_Z:34074,MAX_CUBE_MAP_TEXTURE_SIZE:34076,TEXTURE0:33984,TEXTURE1:33985,TEXTURE2:33986,TEXTURE3:33987,TEXTURE4:33988,TEXTURE5:33989,TEXTURE6:33990,TEXTURE7:33991,TEXTURE8:33992,TEXTURE9:33993,TEXTURE10:33994,TEXTURE11:33995,TEXTURE12:33996,TEXTURE13:33997,TEXTURE14:33998,TEXTURE15:33999,TEXTURE16:34e3,ACTIVE_TEXTURE:34016,REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648,TEXTURE_WIDTH:4096,TEXTURE_HEIGHT:4097,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,INT_VEC2:35667,INT_VEC3:35668,INT_VEC4:35669,BOOL:35670,BOOL_VEC2:35671,BOOL_VEC3:35672,BOOL_VEC4:35673,FLOAT_MAT2:35674,FLOAT_MAT3:35675,FLOAT_MAT4:35676,SAMPLER_2D:35678,SAMPLER_CUBE:35680,LOW_FLOAT:36336,MEDIUM_FLOAT:36337,HIGH_FLOAT:36338,LOW_INT:36339,MEDIUM_INT:36340,HIGH_INT:36341,FRAMEBUFFER:36160,RENDERBUFFER:36161,RGBA4:32854,RGB5_A1:32855,RGB565:36194,DEPTH_COMPONENT16:33189,STENCIL_INDEX:6401,STENCIL_INDEX8:36168,DEPTH_STENCIL:34041,RENDERBUFFER_WIDTH:36162,RENDERBUFFER_HEIGHT:36163,RENDERBUFFER_INTERNAL_FORMAT:36164,RENDERBUFFER_RED_SIZE:36176,RENDERBUFFER_GREEN_SIZE:36177,RENDERBUFFER_BLUE_SIZE:36178,RENDERBUFFER_ALPHA_SIZE:36179,RENDERBUFFER_DEPTH_SIZE:36180,RENDERBUFFER_STENCIL_SIZE:36181,FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:36048,FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:36049,FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:36050,FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:36051,COLOR_ATTACHMENT0:36064,DEPTH_ATTACHMENT:36096,STENCIL_ATTACHMENT:36128,DEPTH_STENCIL_ATTACHMENT:33306,NONE:0,FRAMEBUFFER_COMPLETE:36053,FRAMEBUFFER_INCOMPLETE_ATTACHMENT:36054,FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:36055,FRAMEBUFFER_INCOMPLETE_DIMENSIONS:36057,FRAMEBUFFER_UNSUPPORTED:36061,FRAMEBUFFER_BINDING:36006,RENDERBUFFER_BINDING:36007,MAX_RENDERBUFFER_SIZE:34024,INVALID_FRAMEBUFFER_OPERATION:1286,UNPACK_FLIP_Y_WEBGL:37440,UNPACK_PREMULTIPLY_ALPHA_WEBGL:37441,UNPACK_COLORSPACE_CONVERSION_WEBGL:37443,READ_BUFFER:3074,UNPACK_ROW_LENGTH:3314,UNPACK_SKIP_ROWS:3315,UNPACK_SKIP_PIXELS:3316,PACK_ROW_LENGTH:3330,PACK_SKIP_ROWS:3331,PACK_SKIP_PIXELS:3332,UNPACK_SKIP_IMAGES:32877,UNPACK_IMAGE_HEIGHT:32878,MAX_3D_TEXTURE_SIZE:32883,MAX_ELEMENTS_VERTICES:33e3,MAX_ELEMENTS_INDICES:33001,MAX_TEXTURE_LOD_BIAS:34045,MAX_FRAGMENT_UNIFORM_COMPONENTS:35657,MAX_VERTEX_UNIFORM_COMPONENTS:35658,MAX_ARRAY_TEXTURE_LAYERS:35071,MIN_PROGRAM_TEXEL_OFFSET:35076,MAX_PROGRAM_TEXEL_OFFSET:35077,MAX_VARYING_COMPONENTS:35659,FRAGMENT_SHADER_DERIVATIVE_HINT:35723,RASTERIZER_DISCARD:35977,VERTEX_ARRAY_BINDING:34229,MAX_VERTEX_OUTPUT_COMPONENTS:37154,MAX_FRAGMENT_INPUT_COMPONENTS:37157,MAX_SERVER_WAIT_TIMEOUT:37137,MAX_ELEMENT_INDEX:36203,RED:6403,RGB8:32849,RGBA8:32856,RGB10_A2:32857,TEXTURE_3D:32879,TEXTURE_WRAP_R:32882,TEXTURE_MIN_LOD:33082,TEXTURE_MAX_LOD:33083,TEXTURE_BASE_LEVEL:33084,TEXTURE_MAX_LEVEL:33085,TEXTURE_COMPARE_MODE:34892,TEXTURE_COMPARE_FUNC:34893,SRGB:35904,SRGB8:35905,SRGB8_ALPHA8:35907,COMPARE_REF_TO_TEXTURE:34894,RGBA32F:34836,RGB32F:34837,RGBA16F:34842,RGB16F:34843,TEXTURE_2D_ARRAY:35866,TEXTURE_BINDING_2D_ARRAY:35869,R11F_G11F_B10F:35898,RGB9_E5:35901,RGBA32UI:36208,RGB32UI:36209,RGBA16UI:36214,RGB16UI:36215,RGBA8UI:36220,RGB8UI:36221,RGBA32I:36226,RGB32I:36227,RGBA16I:36232,RGB16I:36233,RGBA8I:36238,RGB8I:36239,RED_INTEGER:36244,RGB_INTEGER:36248,RGBA_INTEGER:36249,R8:33321,RG8:33323,R16F:33325,R32F:33326,RG16F:33327,RG32F:33328,R8I:33329,R8UI:33330,R16I:33331,R16UI:33332,R32I:33333,R32UI:33334,RG8I:33335,RG8UI:33336,RG16I:33337,RG16UI:33338,RG32I:33339,RG32UI:33340,R8_SNORM:36756,RG8_SNORM:36757,RGB8_SNORM:36758,RGBA8_SNORM:36759,RGB10_A2UI:36975,TEXTURE_IMMUTABLE_FORMAT:37167,TEXTURE_IMMUTABLE_LEVELS:33503,UNSIGNED_INT_2_10_10_10_REV:33640,UNSIGNED_INT_10F_11F_11F_REV:35899,UNSIGNED_INT_5_9_9_9_REV:35902,FLOAT_32_UNSIGNED_INT_24_8_REV:36269,UNSIGNED_INT_24_8:34042,HALF_FLOAT:5131,RG:33319,RG_INTEGER:33320,INT_2_10_10_10_REV:36255,CURRENT_QUERY:34917,QUERY_RESULT:34918,QUERY_RESULT_AVAILABLE:34919,ANY_SAMPLES_PASSED:35887,ANY_SAMPLES_PASSED_CONSERVATIVE:36202,MAX_DRAW_BUFFERS:34852,DRAW_BUFFER0:34853,DRAW_BUFFER1:34854,DRAW_BUFFER2:34855,DRAW_BUFFER3:34856,DRAW_BUFFER4:34857,DRAW_BUFFER5:34858,DRAW_BUFFER6:34859,DRAW_BUFFER7:34860,DRAW_BUFFER8:34861,DRAW_BUFFER9:34862,DRAW_BUFFER10:34863,DRAW_BUFFER11:34864,DRAW_BUFFER12:34865,DRAW_BUFFER13:34866,DRAW_BUFFER14:34867,DRAW_BUFFER15:34868,MAX_COLOR_ATTACHMENTS:36063,COLOR_ATTACHMENT1:36065,COLOR_ATTACHMENT2:36066,COLOR_ATTACHMENT3:36067,COLOR_ATTACHMENT4:36068,COLOR_ATTACHMENT5:36069,COLOR_ATTACHMENT6:36070,COLOR_ATTACHMENT7:36071,COLOR_ATTACHMENT8:36072,COLOR_ATTACHMENT9:36073,COLOR_ATTACHMENT10:36074,COLOR_ATTACHMENT11:36075,COLOR_ATTACHMENT12:36076,COLOR_ATTACHMENT13:36077,COLOR_ATTACHMENT14:36078,COLOR_ATTACHMENT15:36079,SAMPLER_3D:35679,SAMPLER_2D_SHADOW:35682,SAMPLER_2D_ARRAY:36289,SAMPLER_2D_ARRAY_SHADOW:36292,SAMPLER_CUBE_SHADOW:36293,INT_SAMPLER_2D:36298,INT_SAMPLER_3D:36299,INT_SAMPLER_CUBE:36300,INT_SAMPLER_2D_ARRAY:36303,UNSIGNED_INT_SAMPLER_2D:36306,UNSIGNED_INT_SAMPLER_3D:36307,UNSIGNED_INT_SAMPLER_CUBE:36308,UNSIGNED_INT_SAMPLER_2D_ARRAY:36311,MAX_SAMPLES:36183,SAMPLER_BINDING:35097,PIXEL_PACK_BUFFER:35051,PIXEL_UNPACK_BUFFER:35052,PIXEL_PACK_BUFFER_BINDING:35053,PIXEL_UNPACK_BUFFER_BINDING:35055,COPY_READ_BUFFER:36662,COPY_WRITE_BUFFER:36663,COPY_READ_BUFFER_BINDING:36662,COPY_WRITE_BUFFER_BINDING:36663,FLOAT_MAT2x3:35685,FLOAT_MAT2x4:35686,FLOAT_MAT3x2:35687,FLOAT_MAT3x4:35688,FLOAT_MAT4x2:35689,FLOAT_MAT4x3:35690,UNSIGNED_INT_VEC2:36294,UNSIGNED_INT_VEC3:36295,UNSIGNED_INT_VEC4:36296,UNSIGNED_NORMALIZED:35863,SIGNED_NORMALIZED:36764,VERTEX_ATTRIB_ARRAY_INTEGER:35069,VERTEX_ATTRIB_ARRAY_DIVISOR:35070,TRANSFORM_FEEDBACK_BUFFER_MODE:35967,MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS:35968,TRANSFORM_FEEDBACK_VARYINGS:35971,TRANSFORM_FEEDBACK_BUFFER_START:35972,TRANSFORM_FEEDBACK_BUFFER_SIZE:35973,TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN:35976,MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS:35978,MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS:35979,INTERLEAVED_ATTRIBS:35980,SEPARATE_ATTRIBS:35981,TRANSFORM_FEEDBACK_BUFFER:35982,TRANSFORM_FEEDBACK_BUFFER_BINDING:35983,TRANSFORM_FEEDBACK:36386,TRANSFORM_FEEDBACK_PAUSED:36387,TRANSFORM_FEEDBACK_ACTIVE:36388,TRANSFORM_FEEDBACK_BINDING:36389,FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:33296,FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE:33297,FRAMEBUFFER_ATTACHMENT_RED_SIZE:33298,FRAMEBUFFER_ATTACHMENT_GREEN_SIZE:33299,FRAMEBUFFER_ATTACHMENT_BLUE_SIZE:33300,FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE:33301,FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE:33302,FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE:33303,FRAMEBUFFER_DEFAULT:33304,DEPTH24_STENCIL8:35056,DRAW_FRAMEBUFFER_BINDING:36006,READ_FRAMEBUFFER_BINDING:36010,RENDERBUFFER_SAMPLES:36011,FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER:36052,FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:36182,UNIFORM_BUFFER:35345,UNIFORM_BUFFER_BINDING:35368,UNIFORM_BUFFER_START:35369,UNIFORM_BUFFER_SIZE:35370,MAX_VERTEX_UNIFORM_BLOCKS:35371,MAX_FRAGMENT_UNIFORM_BLOCKS:35373,MAX_COMBINED_UNIFORM_BLOCKS:35374,MAX_UNIFORM_BUFFER_BINDINGS:35375,MAX_UNIFORM_BLOCK_SIZE:35376,MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS:35377,MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS:35379,UNIFORM_BUFFER_OFFSET_ALIGNMENT:35380,ACTIVE_UNIFORM_BLOCKS:35382,UNIFORM_TYPE:35383,UNIFORM_SIZE:35384,UNIFORM_BLOCK_INDEX:35386,UNIFORM_OFFSET:35387,UNIFORM_ARRAY_STRIDE:35388,UNIFORM_MATRIX_STRIDE:35389,UNIFORM_IS_ROW_MAJOR:35390,UNIFORM_BLOCK_BINDING:35391,UNIFORM_BLOCK_DATA_SIZE:35392,UNIFORM_BLOCK_ACTIVE_UNIFORMS:35394,UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES:35395,UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER:35396,UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER:35398,OBJECT_TYPE:37138,SYNC_CONDITION:37139,SYNC_STATUS:37140,SYNC_FLAGS:37141,SYNC_FENCE:37142,SYNC_GPU_COMMANDS_COMPLETE:37143,UNSIGNALED:37144,SIGNALED:37145,ALREADY_SIGNALED:37146,TIMEOUT_EXPIRED:37147,CONDITION_SATISFIED:37148,WAIT_FAILED:37149,SYNC_FLUSH_COMMANDS_BIT:1,COLOR:6144,DEPTH:6145,STENCIL:6146,MIN:32775,MAX:32776,DEPTH_COMPONENT24:33190,STREAM_READ:35041,STREAM_COPY:35042,STATIC_READ:35045,STATIC_COPY:35046,DYNAMIC_READ:35049,DYNAMIC_COPY:35050,DEPTH_COMPONENT32F:36012,DEPTH32F_STENCIL8:36013,INVALID_INDEX:4294967295,TIMEOUT_IGNORED:-1,MAX_CLIENT_WAIT_TIMEOUT_WEBGL:37447,VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE:35070,UNMASKED_VENDOR_WEBGL:37445,UNMASKED_RENDERER_WEBGL:37446,MAX_TEXTURE_MAX_ANISOTROPY_EXT:34047,TEXTURE_MAX_ANISOTROPY_EXT:34046,COMPRESSED_RGB_S3TC_DXT1_EXT:33776,COMPRESSED_RGBA_S3TC_DXT1_EXT:33777,COMPRESSED_RGBA_S3TC_DXT3_EXT:33778,COMPRESSED_RGBA_S3TC_DXT5_EXT:33779,COMPRESSED_R11_EAC:37488,COMPRESSED_SIGNED_R11_EAC:37489,COMPRESSED_RG11_EAC:37490,COMPRESSED_SIGNED_RG11_EAC:37491,COMPRESSED_RGB8_ETC2:37492,COMPRESSED_RGBA8_ETC2_EAC:37493,COMPRESSED_SRGB8_ETC2:37494,COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:37495,COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:37496,COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:37497,COMPRESSED_RGB_PVRTC_4BPPV1_IMG:35840,COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:35842,COMPRESSED_RGB_PVRTC_2BPPV1_IMG:35841,COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:35843,COMPRESSED_RGB_ETC1_WEBGL:36196,COMPRESSED_RGB_ATC_WEBGL:35986,COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL:35986,COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL:34798,UNSIGNED_INT_24_8_WEBGL:34042,HALF_FLOAT_OES:36193,RGBA32F_EXT:34836,RGB32F_EXT:34837,FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT:33297,UNSIGNED_NORMALIZED_EXT:35863,MIN_EXT:32775,MAX_EXT:32776,SRGB_EXT:35904,SRGB_ALPHA_EXT:35906,SRGB8_ALPHA8_EXT:35907,FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT:33296,FRAGMENT_SHADER_DERIVATIVE_HINT_OES:35723,COLOR_ATTACHMENT0_WEBGL:36064,COLOR_ATTACHMENT1_WEBGL:36065,COLOR_ATTACHMENT2_WEBGL:36066,COLOR_ATTACHMENT3_WEBGL:36067,COLOR_ATTACHMENT4_WEBGL:36068,COLOR_ATTACHMENT5_WEBGL:36069,COLOR_ATTACHMENT6_WEBGL:36070,COLOR_ATTACHMENT7_WEBGL:36071,COLOR_ATTACHMENT8_WEBGL:36072,COLOR_ATTACHMENT9_WEBGL:36073,COLOR_ATTACHMENT10_WEBGL:36074,COLOR_ATTACHMENT11_WEBGL:36075,COLOR_ATTACHMENT12_WEBGL:36076,COLOR_ATTACHMENT13_WEBGL:36077,COLOR_ATTACHMENT14_WEBGL:36078,COLOR_ATTACHMENT15_WEBGL:36079,DRAW_BUFFER0_WEBGL:34853,DRAW_BUFFER1_WEBGL:34854,DRAW_BUFFER2_WEBGL:34855,DRAW_BUFFER3_WEBGL:34856,DRAW_BUFFER4_WEBGL:34857,DRAW_BUFFER5_WEBGL:34858,DRAW_BUFFER6_WEBGL:34859,DRAW_BUFFER7_WEBGL:34860,DRAW_BUFFER8_WEBGL:34861,DRAW_BUFFER9_WEBGL:34862,DRAW_BUFFER10_WEBGL:34863,DRAW_BUFFER11_WEBGL:34864,DRAW_BUFFER12_WEBGL:34865,DRAW_BUFFER13_WEBGL:34866,DRAW_BUFFER14_WEBGL:34867,DRAW_BUFFER15_WEBGL:34868,MAX_COLOR_ATTACHMENTS_WEBGL:36063,MAX_DRAW_BUFFERS_WEBGL:34852,VERTEX_ARRAY_BINDING_OES:34229,QUERY_COUNTER_BITS_EXT:34916,CURRENT_QUERY_EXT:34917,QUERY_RESULT_EXT:34918,QUERY_RESULT_AVAILABLE_EXT:34919,TIME_ELAPSED_EXT:35007,TIMESTAMP_EXT:36392,GPU_DISJOINT_EXT:36795}),t(i.prototype,{bufferData(...E){return this.s(),this.t.bufferData(...E)},bufferSubData(...E){return this.s(),this.t.bufferSubData(...E)},createBuffer(){return this.t.createBuffer()},deleteBuffer(E){const _=this.states;_.arrayBuffer===E?_.arrayBuffer=null:_.elementArrayBuffer===E&&(_.elementArrayBuffer=null);const t=_.attributes;for(const _ in t)t[_].buffer===E&&(t[_].buffer=null);return this.t.deleteBuffer(E)},getBufferParameter(E,_){return this.s(),this.t.getBufferParameter(E,_)},isBuffer(E){return this.t.isBuffer(E)}}),t(i.prototype,{checkFramebufferStatus(E){return this.t.checkFramebufferStatus(E)},createFramebuffer(){return this.t.createFramebuffer()},deleteFramebuffer(E){const _=this.states.framebuffer;for(const t in _)_[t]===E&&(_[t]=null);return this.t.deleteFramebuffer(E)},framebufferRenderbuffer(E,_,t,R){return this.s(),this.t.framebufferRenderbuffer(E,_,t,R)},framebufferTexture2D(E,_,t,R,T){return this.s(),this.t.framebufferTexture2D(E,_,t,R,T)},getFramebufferAttachmentParameter(E,_,t){return this.s(),this.t.getFramebufferAttachmentParameter(E,_,t)},isFramebuffer(E){return this.t.isFramebuffer(E)},readPixels(E,_,t,R,T,A,s){return this.s(),this.t.readPixels(E,_,t,R,T,A,s)}}),t(i.prototype,{createRenderbuffer(){return this.t.createRenderbuffer()},deleteRenderbuffer(E){const _=this.states.renderbuffer;for(const t in _)_[t]===E&&(_[t]=null);return this.t.deleteRenderbuffer(E)},getRenderbufferParameter(E,_){return this.s(),this.t.getRenderbufferParameter(E,_)},isRenderbuffer(E){return this.t.isRenderbuffer(E)},renderbufferStorage(E,_,t,R){return this.s(),this.t.renderbufferStorage(E,_,t,R)}});t(i.prototype,{scissor(E,_,t,R){this.s();const T=this.states.scissor;T[0]===E&&T[1]===_&&T[2]===t&&T[3]===R||(T[0]=E,T[1]=_,T[2]=t,T[3]=R,this.t.scissor(E,_,t,R));},viewport(E,_,t,R){this.s();const T=this.states.viewport;T[0]===E&&T[1]===_&&T[2]===t&&T[3]===R||(T[0]=E,T[1]=_,T[2]=t,T[3]=R,this.t.viewport(E,_,t,R));},blendColor(E,_,t,R){this.s();const T=this.states.blendColor;T[0]===E&&T[1]===_&&T[2]===t&&T[3]===R||(T[0]=E,T[1]=_,T[2]=t,T[3]=R,this.t.blendColor(E,_,t,R));},blendEquation(E){this.s();const _=this.states.blendEquationSeparate;_[0]===E&&_[1]===E||(_[0]=E,_[1]=E,this.t.blendEquation(E));},blendEquationSeparate(E,_){this.s();const t=this.states.blendEquationSeparate;t[0]===E&&t[1]===_||(t[0]=E,t[1]=_,this.t.blendEquationSeparate(E,_));},blendFunc(E,_){this.s();const t=this.states.blendFuncSeparate;t[0]===E&&t[2]===E&&t[1]===_&&t[3]===_||(t[0]=E,t[1]=_,t[2]=E,t[3]=_,this.t.blendFunc(E,_));},blendFuncSeparate(E,_,t,R){this.s();const T=this.states.blendFuncSeparate;T[0]===E&&T[1]===_&&T[2]===t&&T[3]===R||(T[0]=E,T[1]=_,T[2]=t,T[3]=R,this.t.blendFuncSeparate(E,_,t,R));},clearColor(E,_,t,R){this.s();const T=this.states.clearColor;T[0]===E&&T[1]===_&&T[2]===t&&T[3]===R||(T[0]=E,T[1]=_,T[2]=t,T[3]=R,this.t.clearColor(E,_,t,R));},clearDepth(E){this.s();const _=this.states.clearDepth;_[0]!==E&&(_[0]=E,this.t.clearDepth(E));},clearStencil(E){this.s();const _=this.states.clearStencil;_[0]!==E&&(_[0]=E,this.t.clearStencil(E));},colorMask(E,_,t,R){this.s();const T=this.states.colorMask;T[0]===E&&T[1]===_&&T[2]===t&&T[3]===R||(T[0]=E,T[1]=_,T[2]=t,T[3]=R,this.t.colorMask(E,_,t,R));},cullFace(E){this.s();const _=this.states.cullFace;_[0]!==E&&(_[0]=E,this.t.cullFace(E));},depthFunc(E){this.s();const _=this.states.depthFunc;_[0]!==E&&(_[0]=E,this.t.depthFunc(E));},depthMask(E){this.s();const _=this.states.depthMask;_[0]!==E&&(_[0]=E,this.t.depthMask(E));},depthRange(E,_){this.s();const t=this.states.depthRange;t[0]===E&&t[1]===_||(t[0]=E,t[1]=_,this.t.depthRange(E,_));},disable(E){this.s();const _=this.states.capabilities;_[E]&&(_[E]=!1,this.t.disable(E));},enable(E){this.s();const _=this.states.capabilities;_[E]||(_[E]=!0,this.t.enable(E));},frontFace(E){this.s();const _=this.states.frontFace;_[0]!==E&&(_[0]=E,this.t.frontFace(E));},hint(E,_){this.s();const t=this.states.hint;t[E][0]!==_&&(t[E][0]=_,this.t.hint(E,_));},lineWidth(E){this.s();const _=this.states.lineWidth;_[0]!==E&&(_[0]=E,this.t.lineWidth(E));},pixelStorei(E,_){this.s();const t=this.states.pixelStorei;t[E]!==_&&(t[E]&&(t[E][0]=_),this.t.pixelStorei(E,_));},polygonOffset(E,_){this.s();const t=this.states.polygonOffset;t[0]===E&&t[1]===_||(t[0]=E,t[1]=_,this.t.polygonOffset(E,_));},sampleCoverage(E,_){this.s();const t=this.states.sampleCoverage;t[0]===E&&t[1]===_||(t[0]=E,t[1]=_,this.t.sampleCoverage(E,_));},stencilFunc(E,_,t){this.s();const R=this.states.stencilFuncSeparate,T=this.t;R[T.FRONT][0]===E&&R[T.FRONT][1]===_&&R[T.FRONT][2]===t&&R[T.BACK][0]===E&&R[T.BACK][1]===_&&R[T.BACK][2]===t||(R[T.FRONT][0]=R[T.BACK][0]=E,R[T.FRONT][1]=R[T.BACK][1]=_,R[T.FRONT][2]=R[T.BACK][2]=t,this.t.stencilFunc(E,_,t));},stencilFuncSeparate(E,_,t,R){if(this.s(),E===this.t.FRONT_AND_BACK)return void this.stencilFunc(_,t,R);const T=this.states.stencilFuncSeparate;T[E][0]===_&&T[E][1]===t&&T[E][2]===R||(T[E][0]=_,T[E][1]=t,T[E][2]=R,this.t.stencilFuncSeparate(E,_,t,R));},stencilMask(E){this.s();const _=this.t,t=this.states.stencilMaskSeparate;t[_.FRONT][0]===E&&t[_.BACK][0]===E||(t[_.FRONT][0]=E,t[_.BACK][0]=E,this.t.stencilMask(E));},stencilMaskSeparate(E,_){if(this.s(),E===this.t.FRONT_AND_BACK)return void this.stencilMask(_);const t=this.states.stencilMaskSeparate;t[E][0]!==_&&(t[E][0]=_,this.t.stencilMaskSeparate(E,_));},stencilOp(E,_,t){this.s();const R=this.states.stencilOpSeparate,T=this.t;R[T.FRONT][0]===E&&R[T.FRONT][1]===_&&R[T.FRONT][2]===t&&R[T.BACK][0]===E&&R[T.BACK][1]===_&&R[T.BACK][2]===t||(R[T.FRONT][0]=R[T.BACK][0]=E,R[T.FRONT][1]=R[T.BACK][1]=_,R[T.FRONT][2]=R[T.BACK][2]=t,this.t.stencilOp(E,_,t));},stencilOpSeparate(E,_,t,R){if(this.s(),E===this.t.FRONT_AND_BACK)return void this.stencilOp(_,t,R);const T=this.states.stencilOpSeparate;T[E][0]===_&&T[E][1]===t&&T[E][2]===R||(T[E][0]=_,T[E][1]=t,T[E][2]=R,this.t.stencilOpSeparate(E,_,t,R));},bindFramebuffer(E,_){this.s();const t=this.states.framebuffer;t[E]!==_&&(t[E]=_,this.t.bindFramebuffer(E,_));},bindRenderbuffer(E,_){this.s();const t=this.states.renderbuffer;t[E]!==_&&(t[E]=_,this.t.bindRenderbuffer(E,_));},bindTexture(E,_){this.s();const t=this.states.textures,R=-1!==t.active?t.active-33984:-1;t.units[R][E]=_,this.t.bindTexture(E,_);},activeTexture(E){this.s();const _=this.t,t=this.states.textures,R=t.active;t.active=E,this.activeUnit!==E&&(_.activeTexture(E),this.activeUnit=E),-1===R&&(t.units[E-33984][_.TEXTURE_2D]=t.units[-1][_.TEXTURE_2D],t.units[E-33984][_.TEXTURE_CUBE_MAP]=t.units[-1][_.TEXTURE_CUBE_MAP],t.units[-1][_.TEXTURE_2D]=null,t.units[-1][_.TEXTURE_CUBE_MAP]=null);},useProgram(E){this.s();const _=this.states;_.program!==E&&(_.program=E,this.t.useProgram(E));},bindBuffer(E,_){this.s();const t=this.t,R=this.states;E===t.ELEMENT_ARRAY_BUFFER?R.elementArrayBuffer=_:R.arrayBuffer=_,t.bindBuffer(E,_);},bindVertexArray(E){this.s();const _=this.t,t=this.states;t.vao!==E&&(t.vao=E,this._?_.bindVertexArray(E):this.vaoOES.bindVertexArrayOES(E));},vertexAttribPointer(E,_,t,R,T,A){this.s();const s=[E,_,t,R,T,A];this.states.attributes[E]||(this.states.attributes[E]={enable:!0});const r=this.states.attributes[E];return r.buffer=this.states.arrayBuffer,r.args=s,this.t.vertexAttribPointer(E,_,t,R,T,A)},vertexAttribDivisor(E,_){return this.s(),this.states.attributes[E].divisor=_,this._?this.t.vertexAttribDivisor(E,_):this.angleOES.vertexAttribDivisorANGLE(E,_)}},{s(){const E=this.t;if(E.h&&E.h!==this){const _=E.h;this.S(_.states),E.h=this;}E.h=this;},S(_){if(!_)return;delete this.activeUnit;const t=this.states,R=this.t;for(const T in t)if("capabilities"!==T&&"textures"!==T&&"attributes"!==T&&"arrayBuffer"!==T&&"elementArrayBuffer"!==T)if("program"===T)t.program!==_.program&&R.useProgram(t.program);else if("framebuffer"===T)for(const E in t[T])t[T][E]!==_[T][E]&&R.bindFramebuffer(+E,t[T][E]);else if("renderbuffer"===T)for(const E in t[T])t[T][E]!==_[T][E]&&R.bindRenderbuffer(+E,t[T][E]);else if(!fastDeepEqual(t[T],_[T]))if(Array.isArray(_[T]))R[T](...t[T]);else if(_[T])for(const A in t[T])fastDeepEqual(t[T][A],_[T][A])||R[T](+A,...t[T][A]);for(const E in t.capabilities)t.capabilities[E]!==_.capabilities[E]&&R[t.capabilities[E]?"enable":"disable"](+E);const T=t.textures,A=_.textures,s=T.units,r=A.units,e=T.active-R.TEXTURE0;for(let E=0;E<s.length;E++)E===e||s[E][R.TEXTURE_2D]===r[E][R.TEXTURE_2D]&&s[E][R.TEXTURE_CUBE_MAP]===r[E][R.TEXTURE_CUBE_MAP]||(R.activeTexture(R.TEXTURE0+E),R.bindTexture(R.TEXTURE_2D,s[E][R.TEXTURE_2D]),R.bindTexture(R.TEXTURE_CUBE_MAP,s[E][R.TEXTURE_CUBE_MAP]));if(T.active>-1){const E=s[e];E[R.TEXTURE_2D]===r[e][R.TEXTURE_2D]&&E[R.TEXTURE_CUBE_MAP]===r[e][R.TEXTURE_CUBE_MAP]||(R.activeTexture(T.active),R.bindTexture(R.TEXTURE_2D,E[R.TEXTURE_2D]),R.bindTexture(R.TEXTURE_CUBE_MAP,E[R.TEXTURE_CUBE_MAP]));}const i=t.attributes,N=_.attributes;for(const _ in i)N[_]&&i[_].buffer===N[_].buffer&&fastDeepEqual(i[_].args,N[_].args)||i[_].buffer&&(R.bindBuffer(R.ARRAY_BUFFER,i[_].buffer),R.vertexAttribPointer(...i[_].args),void 0!==i[_].divisor&&(this._?R.vertexAttribDivisor(+_,i[_].divisor):this.angleOES.vertexAttribDivisorANGLE(+_,i[_].divisor)),i[_].enable?R.enableVertexAttribArray(i[_].args[0]):R.disableVertexAttribArray(i[_].args[0]));R.bindBuffer(R.ARRAY_BUFFER,t.arrayBuffer),R.bindBuffer(R.ELEMENT_ARRAY_BUFFER,t.elementArrayBuffer);const I=t.vao;I!==_.vao&&(this._?R.bindVertexArray(I||null):this.vaoOES.bindVertexArrayOES(I||null));}}),t(i.prototype,{compressedTexImage2D(E,_,t,R,T,A,s){return this.s(),this.t.compressedTexImage2D(E,_,t,R,T,A,s)},copyTexImage2D(E,_,t,R,T,A,s,r){return this.s(),this.t.copyTexImage2D(E,_,t,R,T,A,s,r)},copyTexSubImage2D(E,_,t,R,T,A,s,r){return this.s(),this.t.copyTexSubImage2D(E,_,t,R,T,A,s,r)},createTexture(){return this.t.createTexture()},deleteTexture(E){const _=this.states.textures.units;for(let t=0;t<_.length;t++)for(const R in _[t])_[t][R]===E&&(_[t][R]=null);return this.t.deleteTexture(E)},generateMipmap(E){return this.s(),this.t.generateMipmap(E)},getTexParameter(E,_){return this.s(),this.t.getTexParameter(E,_)},isTexture(E){return this.t.isTexture(E)},texImage2D(...E){if(this.s(),this._){const _=E[E.length-2],t=r.getInternalFormat(this.t,E[2],_);t!==E[2]&&(E[2]=t);const R=r.getTextureType(this.t,_);R!==_&&(E[E.length-2]=R);}return this.t.texImage2D(...E)},texSubImage2D(E){if(this.s(),this._){const _=E[E.length-2],t=r.getTextureType(this.t,_);t!==_&&(E[E.length-2]=t);}return this.t.texSubImage2D(...E)},texParameterf(E,_,t){return this.s(),this.t.texParameterf(E,_,t)},texParameteri(E,_,t){return this.s(),this.t.texParameteri(E,_,t)}}),t(i.prototype,{bindAttribLocation(E,_,t){return this.t.bindAttribLocation(E,_,t)},enableVertexAttribArray(E){return this.s(),this.states.attributes[E]||(this.states.attributes[E]={}),this.states.attributes[E].enable=!0,this.t.enableVertexAttribArray(E)},disableVertexAttribArray(E){return this.s(),this.states.attributes[E]||(this.states.attributes[E]={}),this.states.attributes[E].enable=!1,this.t.disableVertexAttribArray(E)},getActiveAttrib(E,_){return this.t.getActiveAttrib(E,_)},getActiveUniform(E,_){return this.t.getActiveUniform(E,_)},getAttribLocation(E,_){return this.t.getAttribLocation(E,_)},getUniformLocation(E,_){return this.t.getUniformLocation(E,_)},getVertexAttrib(E,_){return this.s(),this.t.getVertexAttrib(E,_)},getVertexAttribOffset(E,_){return this.s(),this.t.getVertexAttribOffset(E,_)},uniformMatrix2fv(E,_,t){return this.s(),this.t.uniformMatrix2fv(E,_,t)},uniformMatrix3fv(E,_,t){return this.s(),this.t.uniformMatrix3fv(E,_,t)},uniformMatrix4fv(E,_,t){return this.s(),this.t.uniformMatrix4fv(E,_,t)},uniform1f(E,_){return this.s(),this.t.uniform1f(E,_)},uniform1fv(E,_){return this.s(),this.t.uniform1fv(E,_)},uniform1i(E,_){return this.s(),this.t.uniform1i(E,_)},uniform1iv(E,_){return this.s(),this.t.uniform1iv(E,_)},uniform2f(E,_,t){return this.s(),this.t.uniform2f(E,_,t)},uniform2fv(E,_){return this.s(),this.t.uniform2fv(E,_)},uniform2i(E,_,t){return this.s(),this.t.uniform2i(E,_,t)},uniform2iv(E,_){return this.s(),this.t.uniform2iv(E,_)},uniform3f(E,_,t,R){return this.s(),this.t.uniform3f(E,_,t,R)},uniform3fv(E,_){return this.s(),this.t.uniform3fv(E,_)},uniform3i(E,_,t,R){return this.s(),this.t.uniform3i(E,_,t,R)},uniform3iv(E,_){return this.s(),this.t.uniform3iv(E,_)},uniform4f(E,_,t,R,T){return this.s(),this.t.uniform4f(E,_,t,R,T)},uniform4fv(E,_){return this.s(),this.t.uniform4fv(E,_)},uniform4i(E,_,t,R,T){return this.s(),this.t.uniform4i(E,_,t,R,T)},uniform4iv(E,_){return this.s(),this.t.uniform4iv(E,_)},vertexAttrib1f(E,_){return this.s(),this.t.vertexAttrib1f(E,_)},vertexAttrib2f(E,_,t){return this.s(),this.t.vertexAttrib2f(E,_,t)},vertexAttrib3f(E,_,t,R){return this.s(),this.t.vertexAttrib3f(E,_,t,R)},vertexAttrib4f(E,_,t,R,T){return this.s(),this.t.vertexAttrib4f(E,_,t,R,T)},vertexAttrib1fv(E,_){return this.s(),this.t.vertexAttrib1fv(E,_)},vertexAttrib2fv(E,_){return this.s(),this.t.vertexAttrib2fv(E,_)},vertexAttrib3fv(E,_){return this.s(),this.t.vertexAttrib3fv(E,_)},vertexAttrib4fv(E,_){return this.s(),this.t.vertexAttrib4fv(E,_)}}),t(i.prototype,{createVertexArray(){return this._?this.t.createVertexArray():this.vaoOES.createVertexArrayOES()},deleteVertexArray(E){const _=this.states;return _.vao===E&&(_.vao=null),this._?this.t.deleteVertexArray(E):this.vaoOES.deleteVertexArrayOES(E)},isVertexArray(E){return this._?this.t.isVertexArray(E):this.vaoOES.isVertexArrayOES(E)}}),t(i.prototype,{drawArraysInstanced(E,_,t,R){return this.s(),this.i(),this._?this.t.drawArraysInstanced(E,_,t,R):this.angleOES.drawArraysInstancedANGLE(E,_,t,R)},drawElementsInstanced(E,_,t,R,T){return this.s(),this.i(),this._?this.t.drawElementsInstanced(E,_,t,R,T):this.angleOES.drawElementsInstancedANGLE(E,_,t,R,T)}});

	/*!
	 * @maptalks/gl v0.65.3
	 * LICENSE : UNLICENSED
	 * (c) 2016-2022 maptalks.com
	 */

	const f = "function" == typeof Object.assign;

	function p(t) {
	    if (f) Object.assign.apply(Object, arguments); else for (let s = 1; s < arguments.length; s++) {
	        const i = arguments[s];
	        for (const s in i) t[s] = i[s];
	    }
	    return t;
	}

	const g = [];

	function m(t, s) {
	    const i = s._get2DExtentAtRes(s.getGLRes()), e = i.getWidth(), h = i.getHeight(), n = t;
	    return identity$2(n), translate$1(n, n, s.cameraLookAt), scale$5(n, n, set$4(g, e, h, 1)), 
	    n;
	}

	const w = [ 0, 0 ], _ = [ 0, 0, 0 ];

	let x;

	class S {
	    static getUniformDeclares() {
	        const t = [], s = [];
	        return s.push({
	            name: "shadow_lightProjViewModelMatrix",
	            type: "function",
	            fn: function(s, i) {
	                const e = i.shadow_lightProjViewMatrix, h = i.modelMatrix;
	                return multiply$5(t, e, h);
	            }
	        }), s.push("shadow_shadowMap", "shadow_opacity", "esm_shadow_threshold", "shadow_color", "shadow_nearFar"), 
	        s;
	    }
	    constructor(t, s, i) {
	        this.renderer = new xe(t), this.sceneConfig = s, this.t = .3, this.s = i, 
	        this.i();
	    }
	    resize() {
	        const t = this.canvas;
	        t.width = this.s.getRenderer().canvas.width, t.height = this.s.getRenderer().canvas.height;
	    }
	    i() {
	        const t = this.sceneConfig.shadow || {};
	        let s = 512;
	        const i = t.quality;
	        "high" === i ? s = 2048 : "medium" === i && (s = 1024);
	        const e = this.getDefines();
	        this.h = new Ar(this.renderer, {
	            width: s,
	            height: s,
	            blurOffset: t.blurOffset,
	            defines: e
	        }), this.o = new Sr(e), this.l();
	    }
	    getDefines() {
	        return {
	            "HAS_SHADOWING": 1,
	            "PACK_FLOAT": 1,
	            "USE_ESM": 1
	        };
	    }
	    render(t, s, i, e, h, n, a, c, l, u) {
	        this.u();
	        const d = this.s.getMap();
	        let f, p;
	        if (u || this.p(d, a, !!t)) {
	            this.g = this.g || [], this.m = this.m || [];
	            const e = multiply$5(this.g, s, i), h = normalize$4(this.m, n);
	            x || (x = d.getContainerExtent());
	            let c = d.height;
	            d.getPitch() > 62 && (c = d._getVisualHeight(62));
	            const l = x.set(0, d.height - c, d.width, d.height).convertTo(t => d._containerPointToPointAtRes(t, d.getGLRes())).toArray();
	            t && a.addMesh(this._);
	            const u = l.map(t => [ t.x, t.y, 0, 1 ]), {lightProjViewMatrix: g, shadowMap: m, blurFBO: w} = this.h.render(a, {
	                cameraProjViewMatrix: e,
	                lightDir: h,
	                farPlane: u,
	                cameraLookAt: d.cameraLookAt
	            });
	            f = this.S = g, p = this.v = m, this.A = w, this.O = a.getMeshes().reduce((t, s) => (s.castShadow && (t[s.uuid] = {
	                v0: s.version,
	                v1: s.geometry.version
	            }), t), {}), this.C = {
	                count: a.getMeshes().length - +!!t,
	                displayShadow: !!t
	            }, this.M = !0;
	        } else f = this.S, p = this.v, this.M = !1;
	        this.T = s, this.L = i, t && a.getMeshes().length && this.displayShadow(e, h, c, l);
	        return {
	            "shadow_lightProjViewMatrix": f,
	            "shadow_shadowMap": p,
	            "shadow_opacity": h,
	            "shadow_color": e,
	            "esm_shadow_threshold": this.t
	        };
	    }
	    displayShadow(t, s, i, e) {
	        const h = this.S, n = this._, o = this.R || [], a = this.s.getRenderer().canvas, c = this.G = this.G || [];
	        c[0] = a.width, c[1] = a.height, this.renderer.render(this.o, {
	            "halton": i || w,
	            "globalTexSize": c,
	            "projMatrix": this.T,
	            "viewMatrix": this.L,
	            "shadow_lightProjViewModelMatrix": multiply$5(o, h, n.localTransform),
	            "shadow_shadowMap": this.v,
	            "esm_shadow_threshold": this.t,
	            "shadow_opacity": s,
	            "color": t || _
	        }, this.F, e);
	    }
	    dispose() {
	        this.h.dispose(), this.o.dispose(), this._ && (this._.geometry.dispose(), this._.dispose()), 
	        delete this.renderer;
	    }
	    isUpdated() {
	        return !1 !== this.M;
	    }
	    p(t, s, i) {
	        if (!this.O) return !0;
	        const e = this.C;
	        if (s.getMeshes().length !== e.count || i !== e.displayShadow) return !0;
	        const h = s.getMeshes();
	        for (let t = 0; t < h.length; t++) {
	            const s = this.O[h[t].uuid];
	            if (h[t].castShadow && (h[t].hasSkinAnimation() || !s || s.v0 !== h[t].version || s.v1 !== h[t].geometry.version)) return !0;
	        }
	        return !1;
	    }
	    l() {
	        const t = new Bt;
	        t.generateBuffers(this.renderer.regl), this._ = new et$1(t), this.F = new ft$1([ this._ ]);
	    }
	    u() {
	        const t = this.s.getMap(), s = m(this._.localTransform, t);
	        this._.setLocalTransform(s);
	    }
	}

	const {createIBLTextures: v, disposeIBLTextures: b, getPBRUniforms: y} = jr.PBRUtils, A = [ 0, 0 ], O = [ 1, 1 ];

	class C {
	    static getGroundTransform(t, s) {
	        return m(t, s);
	    }
	    constructor(t, s) {
	        this.P = t, this.renderer = new xe(t), this.s = s, this.I = new st$1, 
	        this.H = this.B.bind(this), this.i();
	    }
	    needToRedraw() {
	        const t = this.D();
	        return t && (t[0] || t[1]);
	    }
	    getMap() {
	        return this.s && this.s.getMap();
	    }
	    getSymbol() {
	        const t = this.s.getGroundConfig();
	        return t && t.symbol;
	    }
	    isEnable() {
	        const t = this.s.getGroundConfig();
	        return t && t.enable;
	    }
	    paint(t) {
	        if (!this.isEnable()) return !1;
	        const s = this.N();
	        if (this.j(t) && s === this.V) return !1;
	        const i = this.W(t);
	        i && this._.setDefines(i), this._.material !== this.material && this._.setMaterial(this.material);
	        const e = this.s.getGroundConfig();
	        (e && e.symbol).ssr ? this._.ssr = 1 : this._.ssr = 0, this.u();
	        const h = this.U(t);
	        h.offsetFactor = t.offsetFactor, h.offsetUnits = t.offsetUnits;
	        const n = t && t.renderTarget && t.renderTarget.fbo;
	        return s === this.V ? (this.renderer.render(s, h, this.F, n), this.s.getRenderer().setCanvasUpdated(), 
	        !0) : (s.filter = t.sceneFilter, this.renderer.render(s, h, this.F, n), this.s.getRenderer().setCanvasUpdated(), 
	        !0);
	    }
	    j(t) {
	        return !(!this.s.getRenderer().isEnableSSR || !this.s.getRenderer().isEnableSSR()) && !(!t || !t.ssr);
	    }
	    update() {
	        const t = this.s.getGroundConfig();
	        if (!t) return;
	        const s = t && t.symbol;
	        if (s) {
	            this.k = this.J(s.polygonFill || [ 1, 1, 1, 1 ]), this.Y = void 0 === s.polygonOpacity ? 1 : s.polygonOpacity;
	            const t = s.polygonPatternFile;
	            if (t) {
	                if (!this.$ || this.$._pattern_src !== t) {
	                    const s = new Image;
	                    s.onload = () => {
	                        this.$ && this.$.destroy(), this.$ = this.q(s), this.$._pattern_src = t;
	                    }, s.src = t;
	                }
	            } else this.$ && (this.$.destroy(), delete this.$);
	        } else this.k = [ 1, 1, 1, 1 ], this.Y = 1, this.$ && (this.$.destroy(), delete this.$);
	        this.X();
	    }
	    setToRedraw() {
	        const t = this.s.getRenderer();
	        t && t.setToRedraw();
	    }
	    dispose() {
	        this.material && (this.material.dispose(), delete this.material), this._ && (this._.geometry.dispose(), 
	        this._.material && this._.material.dispose(), this._.dispose(), delete this._), 
	        this.$ && (this.$.destroy(), delete this.$), this.V && (this.V.dispose(), delete this.V), 
	        this.Z && (this.Z.dispose(), delete this.Z), this.K(), this.tt && (this.tt.destroy(), 
	        delete this.tt);
	        const t = this.getMap();
	        t && t.off("updatelights", this.st, this);
	    }
	    N() {
	        const t = this.s.getGroundConfig();
	        if (!t || !t.renderPlugin) return this.V;
	        const s = t.renderPlugin.type;
	        if ("lit" === s) return this.Z;
	        if ("fill" === s) return this.V;
	        throw new Error("unsupported render plugin of " + s + " for layer ground");
	    }
	    U(t) {
	        const s = this.it(t);
	        s.polygonFill = this.k, s.polygonOpacity = this.Y;
	        return this.N() === this.V && this.$ && (s.polygonPatternFile = this.$), s;
	    }
	    it(t) {
	        let s;
	        if ("lit" === this.s.getGroundConfig().renderPlugin.type) this.et || (this.et = v(this.P, this.getMap())), 
	        s = y(this.getMap(), this.et, this.tt, t && t.ssr, t && t.jitter); else {
	            s = {
	                projViewMatrix: this.getMap().projViewMatrix
	            };
	        }
	        return this.ht(s, t), s;
	    }
	    ht(t, s) {
	        const i = s && s.includes;
	        if (i) for (const e in i) i[e] && s[e].renderUniforms && p(t, s[e].renderUniforms);
	    }
	    K() {
	        this.et && (b(this.et), delete this.et);
	    }
	    i() {
	        this.getMap().on("updatelights", this.st, this);
	        const t = this.nt(), s = S.getUniformDeclares(), i = [];
	        s.push({
	            name: "projViewModelMatrix",
	            type: "function",
	            fn: function(t, s) {
	                return multiply$5(i, s.projViewMatrix, s.modelMatrix);
	            }
	        }), this.V = new Wt({
	            vert: "attribute vec3 aPosition;\nuniform mat4 projViewModelMatrix;\n#ifdef HAS_PATTERN\n    attribute vec2 aTexCoord;\n    uniform vec2 uvScale;\n    uniform vec2 uvOffset;\n    varying vec2 vTexCoord;\n#endif\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n    #include <vsm_shadow_vert>\n#endif\nvoid main () {\n    #ifdef HAS_PATTERN\n        vTexCoord = aTexCoord * uvScale + uvOffset;\n    #endif\n    vec3 position = vec3(aPosition);\n    gl_Position = projViewModelMatrix * vec4(position, 1.0);\n    #if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n        shadow_computeShadowPars(vec4(position, 1.0));\n    #endif\n}",
	            frag: "precision mediump float;\n#if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n    #include <vsm_shadow_frag>\n#endif\n#ifdef HAS_PATTERN\n    uniform sampler2D polygonPatternFile;\n    varying vec2 vTexCoord;\n#endif\nuniform vec4 polygonFill;\nuniform float polygonOpacity;\nvoid main() {\n    #ifdef HAS_PATTERN\n        vec4 color = texture2D(polygonPatternFile, vTexCoord);\n    #else\n        vec4 color = polygonFill;\n    #endif\n    gl_FragColor = color * polygonOpacity;\n    #if defined(HAS_SHADOWING) && !defined(HAS_BLOOM)\n        float shadowCoeff = shadow_computeShadow();\n        gl_FragColor.rgb = shadow_blend(gl_FragColor.rgb, shadowCoeff);\n    #endif\n}",
	            uniforms: s,
	            extraCommandProps: t
	        });
	        const e = S.getUniformDeclares();
	        e.push(...An.getUniformDeclares()), this.Z = new jr.StandardShader({
	            uniforms: e,
	            extraCommandProps: t
	        }), this.l(), this.tt = jr.PBRHelper.generateDFGLUT(this.P), this.update();
	    }
	    nt() {
	        const t = [ 0, 1 ], s = this.s.getRenderer().canvas;
	        return {
	            viewport: {
	                x: 0,
	                y: 0,
	                width: () => s.width,
	                height: () => s.height
	            },
	            depth: {
	                enable: !0,
	                mask: () => {
	                    const t = this.s.getGroundConfig();
	                    return t.depth || void 0 === t.depth;
	                },
	                range: () => {
	                    const s = this.s.getGroundConfig(), i = s && s.renderPlugin.sceneConfig;
	                    return i && i.depthRange || t;
	                },
	                func: "<="
	            },
	            blend: {
	                enable: !0,
	                func: {
	                    src: "src alpha",
	                    dst: "one minus src alpha"
	                },
	                equation: "add"
	            },
	            polygonOffset: {
	                enable: !0,
	                offset: {
	                    factor: (t, s) => s.offsetFactor,
	                    units: (t, s) => s.offsetUnits
	                }
	            }
	        };
	    }
	    rt() {
	        const t = this.getMap().getLightManager();
	        return !!(t && t.getAmbientResource());
	    }
	    l() {
	        const t = new Bt;
	        t.data.aTexCoord = new Uint8Array([ 0, 1, 1, 1, 0, 0, 1, 0 ]), t.createTangent(), 
	        t.generateBuffers(this.renderer.regl), this._ = new et$1(t, null, {
	            castShadow: !1
	        });
	        const s = this.Z.getGeometryDefines(t);
	        this._.setDefines(s), this.F = new ft$1([ this._ ]);
	    }
	    u() {
	        const t = this.getMap(), s = C.getGroundTransform(this._.localTransform, t);
	        this._.setLocalTransform(s);
	        const i = t._get2DExtentAtRes(t.getGLRes()), e = i.getWidth(), h = i.getHeight(), n = t.cameraLookAt, r = n[0] - e, o = n[1] + h;
	        let a = this.material && this.material.get("uvOffset") || A;
	        a[0] = a[0] || 0, a[1] = a[1] || 0;
	        const c = this.D(), l = this.material && this.material.get("noiseTexture"), u = c && (c[0] || c[1]);
	        if (u) {
	            a = [ a[0], a[1] ];
	            const t = performance.now(), s = l ? 5e4 : 1e3, i = l ? 256 : 1;
	            c[0] && (a[0] = t * c[0] % s / s * i), c[1] && (a[1] = t * c[1] % s / s * i);
	        }
	        const d = this.material && this.material.get("uvScale") || O, f = .5 / d[0], p = .5 / d[1], g = i.getWidth() / f * 2, m = i.getHeight() / p * 2;
	        if (this._.setUniform("uvScale", [ g, -m ]), u && l) {
	            const t = [ r - (c[0] ? a[0] : 0), o + (c[1] ? a[1] : 0) ], s = t[0] / f % 1, i = t[1] / p % 1, e = [ t[0] / f - s, t[1] / p - i ];
	            this._.setUniform("uvOffset", [ s + (c[0] ? 0 : a[0]), i + (c[1] ? 0 : a[1]) ]), 
	            this._.setUniform("uvOrigin", e);
	        } else {
	            const t = r / f % 1, s = o / p % 1, i = [ r / f - t, o / p - s ];
	            this._.setUniform("uvOffset", [ t + a[0], s + a[1] ]), this._.setUniform("uvOrigin", i);
	        }
	    }
	    W(t) {
	        let s = !1;
	        const i = this._.defines, e = this.s.ot && this.s.ot(), h = this.s.getGroundConfig();
	        function n(t, e) {
	            t ? i[e] || (i[e] = 1, s = !0) : i[e] && (delete i[e], s = !0);
	        }
	        n(this.rt(), "HAS_IBL_LIGHTING");
	        n(t && t.ssr && h && h.symbol && h.symbol.ssr, "HAS_SSR");
	        const r = t && e && e.shadow && e.shadow.enable;
	        n(r, "HAS_SHADOWING"), n(r, "USE_ESM");
	        n(!!this.$, "HAS_PATTERN");
	        return n(t && t.ssao, "HAS_SSAO"), s ? i : null;
	    }
	    X() {
	        const t = this.getSymbol() && this.getSymbol().material;
	        if (!t) return;
	        const s = {};
	        let i = !1;
	        for (const n in t) if (e = t, h = n, Object.prototype.hasOwnProperty.call(e, h)) if (n.indexOf("Texture") > 0) {
	            let e = t[n];
	            if (!e) continue;
	            e = "string" == typeof e ? {
	                url: e,
	                wrap: "repeat"
	            } : e, e.flipY = !0, e.min = "linear", e.mag = "linear", e.flipY = !0, s[n] = new Ft(e, this.I), 
	            i = !0;
	        } else s[n] = t[n];
	        var e, h;
	        this.material ? (this.at = new jr.StandardMaterial(s), this.at.isReady() ? this.B() : this.at.once("complete", this.H)) : (this.material = new jr.StandardMaterial(s), 
	        this.material.once("complete", this.H, this)), i || this.B();
	    }
	    B() {
	        this.at && (this.material.dispose(), this.material = this.at, delete this.at), this.setToRedraw(!0);
	    }
	    q(t) {
	        const s = this.P, i = {
	            width: t.width,
	            height: t.height,
	            data: t,
	            mag: "linear",
	            min: "linear",
	            flipY: !1,
	            wrap: "repeat"
	        };
	        return s.texture(i);
	    }
	    st(t) {
	        if (t.ambientUpdate) {
	            this.K();
	            const t = this.getMap();
	            t && (this.et = v(this.P, t));
	        }
	        this.setToRedraw();
	    }
	    J(t) {
	        return Array.isArray(t) ? (3 === t.length && t.push(1), t) : t;
	    }
	    D() {
	        return this.material && this.material.get("uvOffsetAnim");
	    }
	}

	const {createIBLTextures: M, disposeIBLTextures: T} = jr.PBRUtils, L = [ 0, 0, 0 ], E = [], R = [];

	class G {
	    constructor(t, s) {
	        this.ct = 4, this.P = t, this.renderer = new xe(t), this.s = s, this.i(), 
	        this.lt();
	    }
	    paint(t) {
	        if (!this.isEnable() || !this.ut) return;
	        const s = this.U(t), i = t && t.renderTarget && t.renderTarget.fbo;
	        this.renderer.render(this.dt, s, null, i);
	    }
	    update() {
	        const t = this.getMap();
	        if (!t || !this.isEnable()) return;
	        const s = t.getLightManager(), i = s && s.getAmbientResource();
	        i !== this.ut && this.et && (T(this.et), delete this.et), this.ut = i, this.lt();
	    }
	    dispose() {
	        this.dt.dispose(), T(this.et), delete this.dt, delete this.et, delete this.ut;
	    }
	    getMap() {
	        return this.s.getMap();
	    }
	    lt() {
	        if (!this.ut) return;
	        const t = this.s.ot();
	        this.dt.setMode(1, 0, t.environment && t.environment.mode ? 1 : 0);
	    }
	    isEnable() {
	        const t = this.s.ot();
	        return this.rt() && t && t.environment && t.environment.enable;
	    }
	    rt() {
	        const t = this.getMap().getLightManager();
	        return !!(t && t.getAmbientResource());
	    }
	    U() {
	        const t = this.getMap(), s = this.getMap().getLightManager().getAmbientLight();
	        let i = this.et;
	        i || (i = this.et = M(this.P, t));
	        const e = this.s.getRenderer().canvas, h = this.s.ot().environment || {}, n = h.level || 0, r = i.prefilterMap.width, c = this.ft = this.ft || [], l = s && s.hsv || L, u = h.brightness || 0;
	        return copy$4(E, l), u && (E[2] += u), R[0] = e.width, R[1] = e.height, {
	            "rgbmRange": i.rgbmRange,
	            "cubeMap": i.prefilterMap,
	            "bias": n,
	            "size": r / Math.pow(2, Math.max(0, n - 1)),
	            "environmentExposure": (d = s.exposure, "number" != typeof d || isNaN(d) ? 1 : s.exposure),
	            "diffuseSPH": i.sh,
	            "viewMatrix": t.viewMatrix,
	            "projMatrix": t.projMatrix,
	            "resolution": R,
	            "hsv": E,
	            "transformMatrix": fromRotation$2(c, Math.PI / 180 * -s.orientation || 0)
	        };
	        var d;
	    }
	    i() {
	        const t = this.getMap();
	        if (t.on("updatelights", this.update, this), this.dt = new Cn, t.options.lights) {
	            const t = this.getMap().getLightManager().getAmbientResource();
	            this.ut = t;
	        }
	    }
	}

	const F = [], P = t => !!t.bloom, I = t => !!t.ssr;

	class H {
	    constructor(t, s, i) {
	        this.P = t, this.s = s, this.pt = new xe(t), this.gt = new on, 
	        this.wt = new vn(this.pt, i), this._t = new Dn, this.xt = new An(this.P);
	    }
	    setContextIncludes() {}
	    bloom(t, s, i, e, h, n, r) {
	        this.St || (this.St = new yn(this.P));
	        const o = this.vt.color[0];
	        return this.St.render(t, o, e, h, n, s, i, r);
	    }
	    drawBloom(t) {
	        const s = this.s.getRenderer(), i = this.P, e = this.vt;
	        if (e) {
	            const {width: t, height: h} = s.canvas;
	            e.width === t && e.height === h || e.resize(t, h), i.clear({
	                color: [ 0, 0, 0, 0 ],
	                framebuffer: e
	            });
	        } else {
	            const s = this.bt(t);
	            this.vt = i.framebuffer(s);
	        }
	        const h = s.getFrameTime(), n = s.getFrameEvent(), r = s.getFrameContext(), o = r.renderMode, a = r.sceneFilter, c = r.renderTarget;
	        r.renderMode = "default", r.sceneFilter = P, r.renderTarget = {
	            fbo: this.vt,
	            getFramebuffer: B,
	            getDepthTexture: D
	        };
	        const l = s.glCtx;
	        return l.resetDrawCalls(), n ? s.forEachRenderer(t => {
	            s.clearStencil(t, e), t.drawOnInteracting(n, h, r);
	        }) : s.forEachRenderer(t => {
	            s.clearStencil(t, e), t.draw(h, r);
	        }), r.renderMode = o, r.sceneFilter = a, r.renderTarget = c, l.getDrawCalls();
	    }
	    genSsrMipmap(t, s) {
	        const i = this.s.getMap().projViewMatrix;
	        this.xt.genMipMap(t, s, i);
	    }
	    getPrevSsrProjViewMatrix() {
	        return this.xt && this.xt.getPrevProjViewMatrix();
	    }
	    drawSSR(t, s, i) {
	        i && this.xt.copyDepthTex(t);
	        const e = this.s.getRenderer(), h = e.getFrameTime(), n = e.getFrameEvent(), r = e.getFrameContext();
	        r.ssr = this.getSSRContext();
	        const o = r.renderMode, a = r.sceneFilter;
	        r.renderMode = "default", r.sceneFilter = I, r.renderTarget.fbo = s;
	        const c = e.glCtx;
	        let l = !1;
	        n ? e.forEachRenderer(t => {
	            e.clearStencil(t, s), l || (c.resetDrawCalls(), l = !0), t.drawOnInteracting(n, h, r);
	        }) : e.forEachRenderer(t => {
	            e.clearStencil(t, s), l || (c.resetDrawCalls(), l = !0), t.draw(h, r);
	        });
	        const u = e.drawGround();
	        return delete r.ssr, r.renderMode = o, r.sceneFilter = a, this.yt = c.getDrawCalls() > 0, 
	        u;
	    }
	    getSSRUniforms() {
	        const t = this.s.ot(), s = t && t.postProcess, i = this.s.getMap();
	        return this.xt.getSSRUniforms(i, s.ssr.factor, s.ssr.quality);
	    }
	    getSSRContext() {
	        const t = this.s.ot(), s = t && t.postProcess, i = this.s.getMap(), e = this.xt.getSSRUniforms(i, s.ssr.factor, s.ssr.quality);
	        if (!e) return null;
	        return {
	            renderUniforms: e,
	            defines: {
	                "HAS_SSR": 1
	            }
	        };
	    }
	    taa(t, s, {projMatrix: i, needClear: e}) {
	        const h = this.wt;
	        return {
	            outputTex: h.render(t, s, i, e),
	            redraw: h.needToRedraw()
	        };
	    }
	    isTaaNeedRedraw() {
	        return this.wt.needToRedraw();
	    }
	    ssao(t, s, i) {
	        return this.At || (this.At = new un(this.pt), this.s.getRenderer().setToRedraw()), 
	        this.At.render({
	            projMatrix: i.projMatrix,
	            cameraNear: i.cameraNear,
	            cameraFar: i.cameraFar,
	            bias: i.ssaoBias,
	            radius: i.ssaoRadius,
	            intensity: i.ssaoIntensity,
	            quality: .6
	        }, t, s);
	    }
	    fxaa(t, s, i, e, h, n, r, o, a, l, u, d, f, p, g, m) {
	        !t || t.width === s.fbo && t.height === s.height || t.resize(s.width, s.height);
	        const w = {};
	        h ? w.HAS_TAA_TEX = 1 : delete w.HAS_TAA_TEX, n ? w.HAS_FXAA_TEX = 1 : delete w.HAS_FXAA_TEX, 
	        d ? w.HAS_OUTLINE_TEX = 1 : delete w.HAS_OUTLINE_TEX, i ? w.HAS_NOAA_TEX = 1 : delete w.HAS_NOAA_TEX, 
	        e ? w.HAS_POINT_TEX = 1 : delete w.HAS_POINT_TEX, this.gt.setDefines(w), this.pt.render(this.gt, {
	            textureSource: s,
	            noAaTextureSource: i,
	            pointTextureSource: e,
	            taaTextureSource: h,
	            fxaaTextureSource: n,
	            resolution: set(F, s.width, s.height),
	            enableFXAA: r,
	            enableToneMapping: o,
	            enableSharpen: a,
	            pixelRatio: l,
	            sharpFactor: u,
	            textureOutline: d,
	            highlightFactor: f,
	            outlineFactor: p,
	            outlineWidth: g,
	            outlineColor: m
	        }, null, t);
	    }
	    renderFBOToScreen(t, s, i, e) {
	        this.Ot || (this.Ot = []), this.Ot[0] = t.width, this.Ot[1] = t.height, this.pt.render(this._t, {
	            texture: t.color && t.color[0] || t,
	            size: this.Ot,
	            enableSharpen: +!!s,
	            sharpFactor: i,
	            pixelRatio: e
	        });
	    }
	    postprocess(t, s, i) {
	        this.Ct || (this.Ct = new hn);
	        const e = i || t.color[0];
	        return s.resolution = set(F, e.width, e.height), s.textureSource = e, s.timeGrain = performance.now(), 
	        this.pt.render(this.Ct, s), this.Mt;
	    }
	    dispose() {
	        this.vt && (this.vt.destroy(), delete this.vt), this.wt && (this.wt.dispose(), delete this.wt), 
	        this.At && (this.At.dispose(), delete this.At), this.St && (this.St.dispose(), delete this.St), 
	        this.Ct && (this.Ct.dispose(), delete this.Ct), this.gt && (this.gt.dispose(), delete this.gt), 
	        this._t && (this._t.dispose(), delete this._t);
	    }
	    bt(t, s) {
	        const {width: i, height: e} = this.s.getRenderer().canvas, h = {
	            width: i,
	            height: e,
	            colors: [ this.P.texture({
	                min: "nearest",
	                mag: "nearest",
	                format: s || "rgba",
	                width: i,
	                height: e
	            }) ]
	        };
	        return t && (h.depthStencil = t), h;
	    }
	}

	function B(t) {
	    return t._framebuffer.framebuffer;
	}

	function D(t) {
	    return t.depthStencil._texture.texture;
	}

	const N = [ 0, 0, 0, 0 ], j = [ 0, 0 ], V = t => !t.bloom && !t.ssr, W = t => !t.bloom, U = t => !t.ssr;

	class k extends t__namespace.renderer.CanvasRenderer {
	    setToRedraw() {
	        this.setRetireFrames(), super.setToRedraw();
	    }
	    onAdd() {
	        super.onAdd(), this.prepareCanvas();
	    }
	    updateSceneConfig() {
	        this.Tt && this.Tt.update(), this.Lt && this.Lt.update(), this.setToRedraw();
	    }
	    render(...t) {
	        this.getMap() && this.layer.isVisible() && (this.forEachRenderer(t => {
	            t._replacedDrawFn || (t.draw = this.Et(t.draw), t.drawOnInteracting = this.Rt(t.drawOnInteracting), 
	            t.setToRedraw = this.Gt(t.setToRedraw), t._replacedDrawFn = !0);
	        }), this.prepareRender(), this.prepareCanvas(), this.layer.Ft(), this._toRedraw = !1, 
	        this.Pt("render", t), this.It(), this.Ht());
	    }
	    prepareCanvas() {
	        super.prepareCanvas(), this.forEachRenderer(t => {
	            t.prepareCanvas();
	        });
	    }
	    drawOnInteracting(...t) {
	        this.getMap() && this.layer.isVisible() && (this.layer.Ft(), this._toRedraw = !1, 
	        this.Pt("drawOnInteracting", t), this.It(), this.Ht());
	    }
	    Pt(t, s) {
	        this.Bt = "default";
	        const i = this.hasRenderTarget(), e = this.Dt(s);
	        if (i && (this.Nt.renderTarget = this.jt()), this.Lt.paint(e), this.drawGround(!0), 
	        !i) return void this.Vt("default", null, t, s, !0);
	        const h = this.glCtx, n = this.layer.ot(), r = n && n.postProcess, o = this.isSSROn(), a = this.isEnableTAA(), c = e.jitter;
	        if (e.jitter = j, h.resetDrawCalls(), this.Vt(a ? "fxaaBeforeTaa" : "fxaa", this.Wt, t, s), 
	        this.Ut = h.getDrawCalls(), o && this.kt.drawSSR(this.zt, this.Wt), a) {
	            const i = this.getMap(), n = this.kt.isTaaNeedRedraw() || this.Jt || i.getRenderer().isViewChanged();
	            e.jitter = n ? c : this.Yt.getAverage(), e.onlyUpdateDepthInTaa = !n;
	            let o = this.$t;
	            if (o) o.width === this.Wt.width && o.height === this.Wt.height || o.resize(this.Wt.width, this.Wt.height); else {
	                const t = this.regl, s = this.bt(r, this.zt);
	                o = this.$t = t.framebuffer(s);
	            }
	            h.resetDrawCalls(), this.Vt("taa", o, t, s), this.qt = h.getDrawCalls(), delete e.onlyUpdateDepthInTaa, 
	            e.jitter = j;
	            let a = this.Xt;
	            if (a) a.width === this.Wt.width && a.height === this.Wt.height || a.resize(this.Wt.width, this.Wt.height); else {
	                const t = this.regl, s = this.bt(r, this.zt);
	                a = this.Xt = t.framebuffer(s);
	            }
	            h.resetDrawCalls(), this.Vt("fxaaAfterTaa", this.Xt, t, s), this.Zt = h.getDrawCalls();
	        } else this.$t && (this.$t.destroy(), this.Xt.destroy(), delete this.$t, delete this.Xt, 
	        delete this.Zt);
	        r.bloom && r.bloom.enable && (this.Kt = this.kt.drawBloom(this.zt)), 2 === o && this.kt.drawSSR(this.zt, this.Wt, !0), 
	        h.resetDrawCalls(), this.Vt("noAa", this.Qt, t, s, !0), this.ts = h.getDrawCalls(), 
	        h.resetDrawCalls(), this.Vt("point", this.ss, t, s, !0), this.es = h.getDrawCalls();
	    }
	    Vt(t, s, i, e, h) {
	        this.Bt = t;
	        const n = this.Dt(e);
	        n.renderMode = this.Bt, n.renderTarget && (n.renderTarget.fbo = s), h && (n.isFinalRender = !0), 
	        this.forEachRenderer((h, n) => {
	            n.isVisible() && ("default" === t || !h.supportRenderMode && ("fxaa" === t || "fxaaAfterTaa" === t) || h.supportRenderMode && h.supportRenderMode(t)) && (this.clearStencil(h, s), 
	            h[i].apply(h, e));
	        });
	    }
	    Dt(t) {
	        let s = t[0];
	        return z(s) || (s = t[1]), s !== this.hs && (this.forEachRenderer((t, s) => {
	            s.isVisible() && t.needRetireFrames && t.needRetireFrames() && this.setRetireFrames();
	        }), this.Nt = this.ns(s), this.hs = s, this.rs = z(t[0]) ? null : t[0]), this.Nt;
	    }
	    It() {
	        if (!this.isEnableOutline()) return;
	        const t = this.os(), s = this.glCtx;
	        s.resetDrawCalls(), this.forEachRenderer((s, i) => {
	            i.isVisible() && s.drawOutline && s.drawOutline(t);
	        }), this.as = s.getDrawCalls();
	    }
	    os() {
	        const {width: t, height: s} = this.canvas;
	        let i = this.cs;
	        if (i) t === i.width && s === i.height || i.resize(t, s); else {
	            const e = this.regl.texture({
	                width: t,
	                height: s,
	                format: "rgba4"
	            });
	            i = this.cs = this.regl.framebuffer({
	                width: t,
	                height: s,
	                colors: [ e ],
	                depth: !1,
	                stencil: !1
	            });
	        }
	        return i;
	    }
	    hasRenderTarget() {
	        const t = this.layer.ot(), s = t && t.postProcess;
	        return !(!s || !s.enable);
	    }
	    testIfNeedRedraw() {
	        if (this._toRedraw) return this._toRedraw = !1, !0;
	        if (this.getMap().isInteracting() && this.Tt && this.Tt.isEnable()) return !0;
	        const t = this.layer.getLayers();
	        for (const s of t) {
	            const t = s.getRenderer();
	            if (t && t.testIfNeedRedraw()) return this.ls = !0, !0;
	        }
	        return !1;
	    }
	    isRenderComplete() {
	        const t = this.layer.getLayers();
	        for (const s of t) {
	            const t = s.getRenderer();
	            if (t && !t.isRenderComplete()) return !1;
	        }
	        return !0;
	    }
	    mustRenderOnInteracting() {
	        const t = this.layer.getLayers();
	        for (const s of t) {
	            const t = s.getRenderer();
	            if (t && t.mustRenderOnInteracting()) return !0;
	        }
	        return !1;
	    }
	    isCanvasUpdated() {
	        if (super.isCanvasUpdated()) return !0;
	        const t = this.layer.getLayers();
	        for (const s of t) {
	            const t = s.getRenderer();
	            if (t && t.isCanvasUpdated()) return !0;
	        }
	        return !1;
	    }
	    isBlank() {
	        if (this.Tt && this.Tt.isEnable()) return !1;
	        const t = this.layer.getLayers();
	        for (const s of t) {
	            const t = s.getRenderer();
	            if (t && !t.isBlank()) return !1;
	        }
	        return !0;
	    }
	    createContext() {
	        const t = this.layer, s = t.options.glOptions || {
	            alpha: !0,
	            depth: !0,
	            stencil: !0
	        };
	        s.preserveDrawingBuffer = !0, s.antialias = t.options.antialias, this.glOptions = s;
	        const i$1 = this.gl = this.us(this.canvas, s);
	        this.ds(i$1), i$1.wrap = () => new i(this.gl), this.glCtx = i$1.wrap(), this.canvas.gl = this.gl, 
	        this.reglGL = i$1.wrap(), this.regl = d$1({
	            gl: this.reglGL,
	            attributes: s,
	            extensions: t.options.extensions,
	            optionalExtensions: t.options.optionalExtensions
	        }), this.gl.regl = this.regl, this.fs = [ 0, 0 ], this.Tt = new C(this.regl, this.layer), 
	        this.Lt = new G(this.regl, this.layer);
	        const e = this.layer.ot() || {}, h = e && e.postProcess, n = h && h.antialias && h.antialias.jitterRatio || .2;
	        this.Yt = new pn(n), this.kt = new H(this.regl, this.layer, this.Yt), this.h = new S(this.regl, e, this.layer);
	    }
	    ds() {
	        const t = this.layer, s = this.gl, i = t.options.extensions;
	        i && i.forEach(t => {
	            s.getExtension(t);
	        });
	        const e = t.options.optionalExtensions;
	        e && e.forEach(t => {
	            s.getExtension(t);
	        }), this.gl.clearColor(0, 0, 0, 0);
	    }
	    clearCanvas() {
	        super.clearCanvas(), this.ps();
	    }
	    ps() {
	        const t = this.regl;
	        this.Wt && (t.clear({
	            color: N,
	            depth: 1,
	            stencil: 255,
	            framebuffer: this.Wt
	        }), t.clear({
	            color: N,
	            framebuffer: this.Qt
	        }), t.clear({
	            color: N,
	            framebuffer: this.ss
	        }), this.$t && this.qt && t.clear({
	            color: N,
	            framebuffer: this.$t
	        }), this.Xt && this.Zt && t.clear({
	            color: N,
	            framebuffer: this.Xt
	        })), this.cs && t.clear({
	            color: N,
	            framebuffer: this.cs
	        }), t.clear({
	            color: N,
	            depth: 1,
	            stencil: 255
	        });
	    }
	    resizeCanvas() {
	        super.resizeCanvas();
	        const t = this.canvas.width, s = this.canvas.height;
	        !this.Wt || this.Wt.width === t && this.Wt.height === s || (this.Wt.resize(t, s), 
	        this.Qt.resize(t, s), this.ss.resize(t, s), this.$t && this.$t.resize(t, s), this.Xt && this.Xt.resize(t, s)), 
	        this.ps(), this.forEachRenderer(t => {
	            t.canvas && t.resizeCanvas();
	        });
	    }
	    getCanvasImage() {
	        return this.forEachRenderer(t => {
	            t.getCanvasImage();
	        }), super.getCanvasImage();
	    }
	    forEachRenderer(t) {
	        const s = this.layer.getLayers();
	        for (const i of s) {
	            if (!i.isVisible()) continue;
	            const s = i.getRenderer();
	            s && t(s, i);
	        }
	    }
	    us(t, s) {
	        const i = this.layer.options.onlyWebGL1 ? [ "webgl", "experimental-webgl" ] : [ "webgl2", "webgl", "experimental-webgl" ];
	        let e = null;
	        for (let h = 0; h < i.length; ++h) {
	            try {
	                e = t.getContext(i[h], s);
	            } catch (t) {}
	            if (e) break;
	        }
	        return e;
	    }
	    clearStencil(t, s) {
	        const i = {
	            stencil: t.getStencilValue ? t.getStencilValue() : 255
	        };
	        s && (i.framebuffer = s), this.regl.clear(i);
	    }
	    onRemove() {
	        this.canvas.pickingFBO && this.canvas.pickingFBO.destroy && this.canvas.pickingFBO.destroy(), 
	        this.gs(), this.Tt && (this.Tt.dispose(), delete this.Tt), this.Lt && (this.Lt.dispose(), 
	        delete this.Lt), this.h && (this.h.dispose(), delete this.h), this.kt && (this.kt.dispose(), 
	        delete this.kt), this.cs && (this.cs.destroy(), delete this.cs), super.onRemove();
	    }
	    gs() {
	        this.Wt && (this.Wt.destroy(), this.Qt.destroy(), this.ss.destroy(), this.$t && (this.$t.destroy(), 
	        delete this.$t), this.Xt && (this.Xt.destroy(), delete this.Xt), delete this.Wt, 
	        delete this.Qt, delete this.ss, this.ms && (this.ms.destroy(), delete this.ms));
	    }
	    setRetireFrames() {
	        this.Jt = !0;
	    }
	    getFrameTime() {
	        return this.hs;
	    }
	    getFrameEvent() {
	        return this.rs;
	    }
	    getFrameContext() {
	        return this.Nt;
	    }
	    drawGround(t) {
	        if (!this.Tt) return !1;
	        const s = this.getFrameContext(), i = s.jitter;
	        let e;
	        s.jitter = j, s.offsetFactor = 2, s.offsetUnits = 2, t && (e = s.sceneFilter, delete s.sceneFilter);
	        const h = this.Tt.paint(s);
	        return this.Tt.needToRedraw() && this.setToRedraw(), e && (s.sceneFilter = e), s.jitter = i, 
	        h;
	    }
	    Et(t) {
	        const s = this;
	        return function(i, e) {
	            return (e = e || s.Nt) && e.renderTarget && (e.renderTarget.getFramebuffer = J, 
	            e.renderTarget.getDepthTexture = Y), t.call(this, i, e);
	        };
	    }
	    Rt(t) {
	        const s = this;
	        return function(i, e, h) {
	            return (h = h || s.Nt) && h.renderTarget && (h.renderTarget.getFramebuffer = J, 
	            h.renderTarget.getDepthTexture = Y), t.call(this, i, e, h);
	        };
	    }
	    Gt(t) {
	        return function(...s) {
	            return t.apply(this, s);
	        };
	    }
	    isEnableSSR() {
	        const t = this.layer.ot(), s = t && t.postProcess;
	        return s && s.enable && s.ssr && s.ssr.enable;
	    }
	    isSSROn() {
	        const t = this.isEnableSSR(), s = this.getMap();
	        if (!t || s.getPitch() <= -.001) return 0;
	        const i = s.projViewMatrix, e = this.kt.getPrevSsrProjViewMatrix();
	        return e && exactEquals$5(e, i) ? 1 : 2;
	    }
	    isEnableTAA() {
	        const t = this.layer.ot(), s = t && t.postProcess;
	        return s && s.antialias && s.antialias.enable && s.antialias.taa;
	    }
	    isEnableSSAO() {
	        const t = this.layer.ot(), s = t && t.postProcess;
	        return s && s.enable && s.ssao && s.ssao.enable;
	    }
	    isEnableOutline() {
	        const t = this.layer.ot(), s = t && t.postProcess;
	        return s && s.enable && s.outline && s.outline.enable;
	    }
	    ws() {
	        const t = this.layer.getMap();
	        if (!this.C) {
	            this.C = {
	                center: t.getCenter(),
	                bearing: t.getBearing(),
	                pitch: t.getPitch(),
	                res: t.getResolution()
	            };
	            let s = !1;
	            if (t.options.lights) {
	                const i = t.getLightManager().getDirectionalLight().direction;
	                this.C.lightDirection = copy$4([], i), s = !0;
	            }
	            return {
	                viewChanged: !0,
	                lightDirectionChanged: s
	            };
	        }
	        const s = t.getResolution() / this.C.res, i = t.coordToContainerPoint(this.C.center), e = this.layer.options.viewMoveThreshold, h = i._sub(t.width / 2, t.height / 2).mag() > e || s < .95 || s > 1.05;
	        let n = !1;
	        if (t.options.lights) {
	            const s = t.getLightManager().getDirectionalLight().direction;
	            n = !equals$4(this.C.lightDirection, s), n && (this.C.lightDirection = copy$4([], s));
	        }
	        return h && (this.C.center = t.getCenter(), this.C.bearing = t.getBearing(), this.C.pitch = t.getPitch(), 
	        this.C.res = t.getResolution()), {
	            viewChanged: h,
	            lightDirectionChanged: n
	        };
	    }
	    ns(t) {
	        const s = this.layer.ot(), i = s && s.postProcess, e = {
	            timestamp: t,
	            renderMode: this.Bt || "default",
	            includes: {},
	            states: this.ws(),
	            testSceneFilter: t => !e.sceneFilter || e.sceneFilter(t),
	            isFinalRender: !1
	        }, h = i && i.antialias && i.antialias.jitterRatio || .2, n = this.Yt;
	        n.setRatio(h);
	        const r = this.isSSROn();
	        let o;
	        if (i && i.enable) {
	            if (this.isEnableTAA()) {
	                (this.getMap().isInteracting() || this.Jt) && n.reset(), n.getJitter(this.fs), n.frame();
	            } else set(this.fs, 0, 0);
	            e.jitter = this.fs;
	            const t = i.bloom && i.bloom.enable;
	            t && r ? (e.bloom = 1, e.sceneFilter = V) : t ? (e.bloom = 1, e.sceneFilter = W) : r && (e.sceneFilter = U), 
	            o = this.jt(), o && (e.renderTarget = o);
	        } else this.gs();
	        return this._s(e, o), "noAa" !== this.Bt && (this.xs = this.Ss(e), this.xs && (e.includes.shadow = 1), 
	        this.vs = this.bs(e)), this.xs && (e.shadow = this.xs, e.includes.shadow = 1), e.states.includesChanged = this.vs, 
	        i && i.enable && this.kt && this.kt.setContextIncludes(e), e;
	    }
	    _s(t, s) {
	        let i = [];
	        this.forEachRenderer(t => {
	            if (!t.getAnalysisMeshes) return;
	            const s = t.getAnalysisMeshes();
	            if (Array.isArray(s)) for (let t = 0; t < s.length; t++) i.push(s[t]);
	        });
	        const e = this.layer.ys;
	        if (e) for (let h = 0; h < e.length; h++) {
	            e[h].renderAnalysis(t, i, s && s.fbo);
	        }
	    }
	    bs(t) {
	        let s = !1;
	        const i = Object.keys(t.includes), e = this.As;
	        if (e) {
	            const t = i.filter(t => -1 === e.indexOf(t)).concat(e.filter(t => -1 === i.indexOf(t)));
	            t.length && (s = t.reduce((t, s) => (t[s] = 1, t), {}));
	        }
	        return this.As = i, s;
	    }
	    Ss(t) {
	        const s = this.layer.ot();
	        if (!s || !s.shadow || !s.shadow.enable) return this.h && (this.h.dispose(), delete this.h), 
	        null;
	        this.h || (this.h = new S(this.regl, this.layer.ot() || {}, this.layer));
	        const i = {
	            config: s.shadow,
	            defines: this.h.getDefines(),
	            uniformDeclares: S.getUniformDeclares()
	        };
	        return i.renderUniforms = this.Os(t), i;
	    }
	    Os(t) {
	        const s = t.renderTarget && t.renderTarget.fbo, i = this.layer.ot(), e = [];
	        let h = t.states.lightDirectionChanged || t.states.viewChanged;
	        this.forEachRenderer((t, s) => {
	            if (!t.getShadowMeshes || !s.isVisible()) return;
	            const i = t.getShadowMeshes();
	            if (Array.isArray(i)) for (let t = 0; t < i.length; t++) i[t].needUpdateShadow && (h = !0), 
	            i[t].needUpdateShadow = !1, e.push(i[t]);
	        }), this.Cs || (this.Cs = new ft$1), this.Cs.setMeshes(e);
	        const n = this.getMap(), r = i.shadow, o = n.getLightManager().getDirectionalLight().direction, a = !i.ground || !i.ground.enable;
	        return this.h.render(a, n.projMatrix, n.viewMatrix, r.color, r.opacity, o, this.Cs, this.fs, s, h);
	    }
	    jt() {
	        const t = this.layer.ot(), s = t && t.postProcess;
	        if (!this.Wt) {
	            const t = this.regl;
	            let i = this.zt;
	            (!i || !i._texture || i._texture.refCount <= 0) && (i = null);
	            const e = this.bt(s, i);
	            this.zt = e.depth || e.depthStencil, this.Wt = t.framebuffer(e);
	            const h = this.bt(s, this.zt);
	            this.Qt = t.framebuffer(h);
	            const n = this.bt(s, this.zt);
	            this.ss = t.framebuffer(n), this.ps();
	        }
	        return {
	            fbo: this.Wt
	        };
	    }
	    Ms() {
	        const t = this.canvas.width, s = this.canvas.height;
	        return {
	            width: t,
	            height: s,
	            colors: [ this.regl.texture({
	                min: "nearest",
	                mag: "nearest",
	                type: "uint8",
	                width: t,
	                height: s
	            }) ],
	            colorFormat: "rgba"
	        };
	    }
	    bt(t, s) {
	        const {width: i, height: e} = this.canvas, h = this.regl, n = this.Ms();
	        if (h.hasExtension("WEBGL_depth_texture")) {
	            const t = s || h.texture({
	                min: "nearest",
	                mag: "nearest",
	                mipmap: !1,
	                type: "depth stencil",
	                width: i,
	                height: e,
	                format: "depth stencil"
	            });
	            n.depthStencil = t;
	        } else {
	            const t = s || h.renderbuffer({
	                width: i,
	                height: e,
	                format: "depth stencil"
	            });
	            n.depthStencil = t;
	        }
	        return n;
	    }
	    Ht() {
	        if (!this.Wt) return void (this.Jt = !1);
	        const t = this.layer.ot(), s = t && t.postProcess;
	        if (!s || !s.enable) return;
	        this.layer.fire("postprocessstart");
	        const i = this.layer.getMap();
	        let e;
	        if (this.isEnableTAA()) {
	            const t = this.Jt || i.getRenderer().isViewChanged();
	            t && this.layer.fire("taastart");
	            const {outputTex: s, redraw: h} = this.kt.taa(this.$t.color[0], this.zt, {
	                projMatrix: i.projMatrix,
	                needClear: t
	            });
	            e = s, h ? this.setToRedraw() : this.layer.fire("taaend"), this.Jt = !1;
	        }
	        let h = s.sharpen && s.sharpen.factor;
	        h || 0 === h || (h = .2);
	        let n = 0, r = .2, o = .3, a = 1, c = [ 1, 1, 0 ];
	        s.outline && (n = +!!s.outline.enable, r = $(s.outline, "highlightFactor", r), o = $(s.outline, "outlineFactor", o), 
	        a = $(s.outline, "outlineWidth", a), c = $(s.outline, "outlineColor", c));
	        const l = this.isEnableSSAO(), u = s.ssr && s.ssr.enable, d = s.bloom && s.bloom.enable, f = d && this.Kt, p = +!(!s.antialias || !s.antialias.enable), g = l || d || u;
	        let m = this.ms;
	        if (g) {
	            if (!m) {
	                const t = this.Ms();
	                m = this.ms = this.regl.framebuffer(t);
	            }
	            const {width: t, height: s} = this.canvas;
	            m.width === t && m.height === s || m.resize(t, s);
	        } else m = null, this.ms && (this.ms.destroy(), delete this.ms);
	        let w = this.Wt.color[0];
	        const _ = this.ts && this.Qt.color[0], x = this.es && this.ss.color[0];
	        if (this.kt.fxaa(m, w, !f && _, !f && x, e, this.Zt && this.Xt && this.Xt.color[0], p, +!(!s.toneMapping || !s.toneMapping.enable), +!(g || !s.sharpen || !s.sharpen.enable), i.getDevicePixelRatio(), h, n && this.as > 0 && this.os(), r, o, a, c), 
	        m && (w = m.color[0]), l && (this.Zt || this.qt || this.Ut) && (w = this.kt.ssao(w, this.zt, {
	            projMatrix: i.projMatrix,
	            cameraNear: i.cameraNear,
	            cameraFar: i.cameraFar,
	            ssaoBias: s.ssao && s.ssao.bias || 10,
	            ssaoRadius: s.ssao && s.ssao.radius || 100,
	            ssaoIntensity: s.ssao && s.ssao.intensity || .5
	        })), d && this.Kt) {
	            const t = s.bloom, i = +t.threshold || 0, e = $(t, "factor", 1), h = $(t, "radius", 1);
	            w = this.kt.bloom(w, _, x, i, e, h, p);
	        }
	        if (u && (this.kt.genSsrMipmap(w, this.zt), this.ls)) {
	            const t = this.Jt;
	            this.setToRedraw(), this.Jt = t, this.ls = !1;
	        }
	        g && this.kt.renderFBOToScreen(w, +!(!s.sharpen || !s.sharpen.enable), h, i.getDevicePixelRatio()), 
	        this.layer.fire("postprocessend");
	    }
	}

	function z(t) {
	    return "number" == typeof t && !isNaN(t);
	}

	function J(t) {
	    return t._framebuffer.framebuffer;
	}

	function Y(t) {
	    return t.depthStencil._texture.texture;
	}

	function $(t, s, i) {
	    return null == t[s] ? i : t[s];
	}

	class q extends t__namespace.Layer {
	    static fromJSON(s) {
	        if (!s || "GroupGLLayer" !== s.type) return null;
	        const i = s.layers.map(s => t__namespace.Layer.fromJSON(s));
	        return new q(s.id, i, s.options);
	    }
	    constructor(t, s, i) {
	        super(t, i), this.layers = s || [], this.layers.forEach(t => {
	            if (t.getMap()) throw new Error(`layer(${t.getId()} is already added on map`);
	        }), this.Ts(), this.sortLayersByZIndex(), this.Ls = {};
	    }
	    sortLayersByZIndex() {
	        if (this.layers && this.layers.length) {
	            for (let t = 0, s = this.layers.length; t < s; t++) this.layers[t].Es = t;
	            this.layers.sort(Z);
	        }
	    }
	    setSceneConfig(t) {
	        this.options.sceneConfig = t;
	        const s = this.getRenderer();
	        return s && s.updateSceneConfig(), this;
	    }
	    getSceneConfig() {
	        return JSON.parse(JSON.stringify(this.options.sceneConfig || {}));
	    }
	    ot() {
	        return this.options.sceneConfig;
	    }
	    getGroundConfig() {
	        const t = this.ot();
	        return t ? t.ground : null;
	    }
	    addLayer(t, s) {
	        if (t.getMap()) throw new Error(`layer(${t.getId()} is already added on map`);
	        void 0 === s ? this.layers.push(t) : this.layers.splice(s, 0, t), this.Ts(), this.sortLayersByZIndex();
	        const i = this.getRenderer();
	        return i ? (this.Rs(t), i.setToRedraw(), this) : this;
	    }
	    removeLayer(s) {
	        t__namespace.Util.isString(s) && (s = this.getChildLayer(s));
	        const i = this.layers.indexOf(s);
	        if (i < 0) return this;
	        s._doRemove(), s.off("show hide", this.Gs, this), s.off("idchange", this.Fs, this), 
	        delete this.Ls[s.getId()], this.layers.splice(i, 1);
	        const e = this.getRenderer();
	        return e ? (e.setToRedraw(), this) : this;
	    }
	    Ft() {
	        let t = 0;
	        for (let s = 0; s < this.layers.length; s++) this.layers[s].setPolygonOffset && this.layers[s].getPolygonOffsetCount && (t += this.layers[s].getPolygonOffsetCount());
	        let s = 0;
	        for (let i = 0; i < this.layers.length; i++) this.layers[i].setPolygonOffset && this.layers[i].getPolygonOffsetCount && (this.layers[i].setPolygonOffset(s, t), 
	        s += this.layers[i].getPolygonOffsetCount());
	    }
	    getLayers() {
	        return this.layers;
	    }
	    toJSON() {
	        const t = [];
	        if (this.layers) for (let s = 0; s < this.layers.length; s++) {
	            const i = this.layers[s];
	            i && (i && i.toJSON && t.push(i.toJSON()));
	        }
	        return {
	            "type": this.getJSONType(),
	            "id": this.getId(),
	            "layers": t,
	            "options": this.config()
	        };
	    }
	    onLoadEnd() {
	        this.layers.forEach(t => {
	            this.Rs(t);
	        }), super.onLoadEnd();
	    }
	    Rs(t) {
	        const s = this.getMap();
	        this.Ls[t.getId()] = t, t._canvas = this.getRenderer().canvas, t._bindMap(s), t.once("renderercreate", this.Ps, this), 
	        t.once("remove", t => {
	            this.removeLayer(t.target);
	        }), t.load(), this.Is(t);
	    }
	    onRemove() {
	        this.layers.forEach(t => {
	            t._doRemove(), t.off("show hide", this.Gs, this), t.off("idchange", this.Fs, this);
	        }), this.Ls = {}, super.onRemove();
	    }
	    getChildLayer(t) {
	        return this.Ls[t] || null;
	    }
	    getLayer(t) {
	        return this.getChildLayer(t);
	    }
	    Is(t) {
	        t.on("show hide", this.Gs, this), t.on("idchange", this.Fs, this);
	    }
	    Gs() {
	        const t = this.getRenderer();
	        t && t.setToRedraw();
	    }
	    Fs(t) {
	        const s = t.new, i = t.old, e = this.getLayer(i);
	        delete this.Ls[i], this.Ls[s] = e;
	    }
	    Ps(t) {
	        t.renderer.clearCanvas = X;
	    }
	    Ts() {
	        const t = {};
	        this.layers.forEach(s => {
	            const i = s.getId();
	            if (t[i]) throw new Error(`Duplicate child layer id (${i}) in the GroupGLLayer (${this.getId()})`);
	            t[i] = 1;
	        });
	    }
	    addAnalysis(t) {
	        this.ys = this.ys || [], this.ys.push(t);
	        const s = this.getRenderer();
	        s && s.setToRedraw();
	    }
	    removeAnalysis(t) {
	        if (this.ys) {
	            const s = this.ys.indexOf(t);
	            s > -1 && this.ys.splice(s, 1);
	        }
	        const s = this.getRenderer();
	        s && s.setToRedraw();
	    }
	    identify(s, i = {}) {
	        const e = this.getMap(), h = this.getRenderer();
	        if (!e || !h) return [];
	        const n = e.coordToContainerPoint(new t__namespace.Coordinate(s));
	        return this.identifyAtPoint(n, i);
	    }
	    identifyAtPoint(t, s = {}) {
	        const i = this.getLayers(), e = s && s.childLayers || i, h = this.getMap();
	        if (!h) return [];
	        const n = null == s.count ? 1 : s.count;
	        let r = [];
	        for (let h = e.length - 1; h >= 0; h--) {
	            const n = e[h];
	            if (i.indexOf(n) < 0 || !n.identifyAtPoint) continue;
	            let o = n.identifyAtPoint(t, s);
	            o && o.length && (s.filter && (o = o.filter(t => s.filter(t))), o.length && r.push(...o));
	        }
	        if (s.orderByCamera) {
	            const t = h.cameraPosition;
	            r.sort((s, i) => i.point ? s.point ? dist$2(s.point, t) - dist$2(i.point, t) : 1 : -1);
	        }
	        return n && (r = r.slice(0, n)), r;
	    }
	}

	function X() {}

	function Z(t, s) {
	    const i = t.getZIndex() - s.getZIndex();
	    return 0 === i ? t.Es - s.Es : i;
	}

	q.mergeOptions({
	    renderer: "gl",
	    antialias: !1,
	    extensions: [],
	    onlyWebGL1: !1,
	    optionalExtensions: [ "ANGLE_instanced_arrays", "OES_element_index_uint", "OES_standard_derivatives", "OES_vertex_array_object", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_texture_float", "OES_texture_float_linear", "WEBGL_depth_texture", "EXT_shader_texture_lod", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_pvrtc", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb" ],
	    forceRenderOnZooming: !0,
	    forceRenderOnMoving: !0,
	    forceRenderOnRotating: !0,
	    viewMoveThreshold: 100,
	    geometryEvents: !0
	}), q.registerJSONType("GroupGLLayer"), q.registerRenderer("gl", k), q.registerRenderer("canvas", null);

	class K extends(t$1.Eventable(t$1.Handlerable(t$1.Class))){
	    addTo(t) {
	        this.layer = t;
	    }
	    renderAnalysis(t) {
	        const s = this.getAnalysisType();
	        t.includes[s] = 1, t[s] = {
	            defines: this.getDefines()
	        };
	    }
	    remove() {
	        this.layer && (this.layer.removeAnalysis(this), delete this.layer);
	    }
	    update(t, s) {
	        this.options[t] = s;
	        const i = this.layer.getRenderer();
	        i && i.setToRedraw();
	    }
	    getAnalysisType() {
	        return this.type;
	    }
	}

	class Q extends K {
	    constructor(t) {
	        super(t), this.type = "viewshed";
	    }
	    addTo(t) {
	        super.addTo(t);
	        const s = this.layer.getRenderer(), i = this.layer.getMap();
	        return this.Hs = {}, this.Hs.eyePos = tt(i, this.options.eyePos), this.Hs.lookPoint = tt(i, this.options.lookPoint), 
	        this.Hs.verticalAngle = this.options.verticalAngle, this.Hs.horizonAngle = this.options.horizonAngle, 
	        s ? this.Bs(s) : this.layer.once("renderercreate", t => {
	            this.Bs(t.renderer);
	        }, this), this;
	    }
	    update(t, s) {
	        if (s.length > 0) {
	            const i = this.layer.getMap();
	            this.Hs[t] = tt(i, s);
	        } else this.Hs[t] = s;
	        super.update(t, s);
	    }
	    Bs(t) {
	        const s = {
	            x: 0,
	            y: 0,
	            width: () => t.canvas ? t.canvas.width : 1,
	            height: () => t.canvas ? t.canvas.height : 1
	        }, i = new xe(t.regl);
	        this.Ds = new Mn(i, s) || this.Ds, this.layer.addAnalysis(this);
	    }
	    renderAnalysis(t, s) {
	        super.renderAnalysis(t);
	        const i = this.getAnalysisType(), e = {}, h = this.Ds.render(s, this.Hs);
	        e.viewshed_depthMapFromViewpoint = h.depthMap, e.viewshed_projViewMatrixFromViewpoint = h.projViewMatrixFromViewpoint, 
	        e.viewshed_visibleColor = this.Hs.visibleColor || [ 0, 1, 0, 1 ], e.viewshed_invisibleColor = this.Hs.invisibleColor || [ 1, 0, 0, 1 ], 
	        t[i].renderUniforms = e;
	    }
	    getDefines() {
	        return {
	            HAS_VIEWSHED: 1
	        };
	    }
	    remove() {
	        super.remove(), this.Ds && this.Ds.dispose();
	    }
	}

	function tt(s, i) {
	    if (!s) return null;
	    const e = s.coordinateToPointAtRes(new t__namespace.Coordinate(i[0], i[1]), s.getGLRes());
	    return [ e.x, e.y, i[2] ];
	}

	class st extends K {
	    constructor(t) {
	        super(t), this.type = "floodAnalysis";
	    }
	    addTo(t) {
	        return super.addTo(t), this.layer.addAnalysis(this), this;
	    }
	    renderAnalysis(t) {
	        super.renderAnalysis(t);
	        t[this.getAnalysisType()].renderUniforms = this.Ns();
	    }
	    Ns() {
	        const t = {};
	        return t.flood_waterHeight = this.options.waterHeight, t.flood_waterColor = this.options.waterColor, 
	        t;
	    }
	    getDefines() {
	        return {
	            HAS_FLOODANALYSE: 1
	        };
	    }
	}

	class it extends K {
	    constructor(t) {
	        super(t), this.type = "skyline";
	    }
	    addTo(t) {
	        super.addTo(t);
	        const s = this.layer.getRenderer();
	        return s ? this.js(s) : this.layer.once("renderercreate", t => {
	            this.js(t.renderer);
	        }, this), this;
	    }
	    js(t) {
	        const s = {
	            width: t.canvas.width,
	            height: t.canvas.height
	        }, i = new xe(t.regl);
	        this.Vs = new Sn(i, s) || this.Vs, this.layer.addAnalysis(this), this._ = this.l(t.regl);
	    }
	    renderAnalysis(t, s, i) {
	        super.renderAnalysis(t), this._ = this._ || this.l();
	        const e = this.layer.getMap();
	        this.u(e);
	        let h = s.concat([ this._ ]);
	        this.Vs.render(h, i, {
	            projViewMatrix: e.projViewMatrix,
	            lineColor: this.options.lineColor,
	            lineWidth: this.options.lineWidth
	        });
	    }
	    l(t) {
	        const s = new Bt;
	        return s.generateBuffers(t), s.data.aTexCoord = new Float32Array(8), new et$1(s);
	    }
	    u(t) {
	        const s = C.getGroundTransform(this._.localTransform, t);
	        this._.setLocalTransform(s);
	    }
	    remove() {
	        super.remove(), this.Vs && this.Vs.dispose(), this._ && (this._.geometry.dispose(), 
	        delete this._);
	    }
	    getDefines() {
	        return null;
	    }
	}

	class et {
	    constructor(t) {
	        this.Ws = t, this.I = new st$1, this.onHDRLoaded = this.Us.bind(this), 
	        this.onHDRError = this.ks.bind(this);
	    }
	    getDirectionalLight() {
	        return this.zs && this.zs.directional || {};
	    }
	    getAmbientLight() {
	        return this.zs && this.zs.ambient || {};
	    }
	    getAmbientResource() {
	        return this.Js;
	    }
	    setConfig(t) {
	        const s = this.zs;
	        this.zs = JSON.parse(JSON.stringify(t));
	        let i = !1;
	        if (t && t.ambient && t.ambient.resource) {
	            if (!(s && s.ambient && function(t, s) {
	                if (!t.resource) return !1;
	                if (t.resource.url !== s.resource.url) return !1;
	                return !0;
	            }(s.ambient, t.ambient))) return void this.Ys();
	            this.Js && (t.ambient.prefilterCubeSize !== s.ambient && s.ambient.prefilterCubeSize && this.Us(), 
	            i = !0, t.ambient.resource.sh && (this.Js.sh = t.ambient.resource.sh));
	        } else this.$s(), i = s && s.ambient && s.ambient.resource;
	        this.Ws.fire("updatelights", {
	            ambientUpdate: i
	        });
	    }
	    qs(t) {
	        const s = t.getLayers();
	        for (let t = 0; t < s.length; t++) {
	            const i = s[t] && s[t].getRenderer();
	            if (i && i.regl) return i.regl;
	        }
	        const i = document.createElement("canvas"), e = d$1({
	            canvas: i,
	            attributes: {
	                depth: !1,
	                stencil: !1,
	                alpha: !1
	            }
	        });
	        return e.Xs = !0, e;
	    }
	    Ys() {
	        const t = {
	            url: this.zs.ambient.resource.url,
	            arrayBuffer: !0,
	            hdr: !0,
	            flipY: !0
	        };
	        this.Zs = new Ft(t, this.I), this.Zs.once("complete", this.onHDRLoaded), 
	        this.Zs.once("error", this.onHDRError);
	    }
	    dispose() {
	        this.$s();
	    }
	    Us() {
	        this.Zs && (this.Js = this.Ks(this.Zs), this.Ws.fire("updatelights", {
	            "ambientUpdate": !0
	        }));
	    }
	    ks() {
	        this.Ws.fire("hdrerror");
	    }
	    Ks(t) {
	        const s = this.zs.ambient.resource, i = this.zs.ambient.prefilterCubeSize || 256, e = this.qs(this.Ws), h = jr.PBRHelper.createIBLMaps(e, {
	            envTexture: t.getREGLTexture(e),
	            rgbmRange: t.rgbmRange,
	            ignoreSH: !!s.sh,
	            envCubeSize: i,
	            prefilterCubeSize: i,
	            format: "array"
	        });
	        if (s.sh && (h.sh = s.sh, Array.isArray(h.sh[0]))) {
	            const t = h.sh, s = [];
	            for (let i = 0; i < t.length; i++) s.push(...t[i]);
	            h.sh = s;
	        }
	        return e.Xs && (delete this.Zs, e.destroy()), h;
	    }
	    $s() {
	        this.Zs && (this.Zs.dispose(), delete this.Zs), delete this.Js;
	    }
	}

	let ht, nt, rt, ot;

	t$1.Map.include({
	    setLightConfig(t) {
	        return this.options.lights = t, this.Qs(), this;
	    },
	    getLightConfig() {
	        return this.options.lights;
	    },
	    Qs() {
	        this.ti || (this.ti = new et(this)), this.ti.setConfig(this.getLightConfig());
	    },
	    getLightManager() {
	        return this.ti ? this.ti : (this.si || (this.si = !0, console.warn("map's light config is not set, use map.setLightConfig(config) to set lights.")), 
	        null);
	    }
	}), t$1.Map.addOnLoadHook((function() {
	    this.options.lights && this.Qs();
	}));

	const at = {
	    color: [ 0, 0, 0, 0 ]
	}, ct = {
	    enable: !0
	};

	t$1.Map.include({
	    setPostProcessConfig(t) {
	        return this.options.postProcessConfig = t, this;
	    },
	    getPostProcessConfig() {
	        return this.options.postProcessConfig;
	    }
	});

	const lt = t$1.renderer.MapCanvasRenderer.prototype.drawLayerCanvas;

	t$1.renderer.MapCanvasRenderer.prototype.drawLayerCanvas = function() {
	    const t = lt.apply(this, arguments);
	    return t && dt(this, this.canvas), t;
	};

	const ut = t$1.renderer.MapCanvasRenderer.prototype.renderFrame;

	function dt(t, s) {
	    var i, e;
	    ht || (i = s.width, e = s.height, ht = document.createElement("canvas", i, e), nt = d$1({
	        canvas: ht,
	        attributes: {
	            depth: !1,
	            stencil: !1,
	            alpha: !0,
	            antialias: !1,
	            premultipliedAlpha: !1
	        }
	    }), rt = nt.texture({
	        mag: "linear",
	        min: "linear",
	        mipmap: !1,
	        flipY: !0,
	        width: i,
	        height: e
	    }), ot = nt.texture());
	    const h = t.map.getPostProcessConfig();
	    if (!h || !h.enable) return;
	    ht.width === s.width && ht.height === s.height || (ht.width = s.width, ht.height = s.height), 
	    nt.clear(at);
	    const n = h.filmicGrain || ct;
	    void 0 === n.enable && (n.enable = !0);
	    const r = h.vignette || ct;
	    void 0 === r.enable && (r.enable = !0);
	    const o = h.colorLUT || ct;
	    void 0 === o.enable && (o.enable = !0), t.ii || (t.ii = {});
	    const a = t.ii;
	    if (o.enable) {
	        const s = o.lut;
	        if (!a.lutTexture || a.lutTexture.url !== s) {
	            const i = new Image;
	            i.onload = function() {
	                const e = {
	                    data: i,
	                    min: "linear",
	                    mag: "linear"
	                }, h = a.lutTexture ? a.lutTexture.texture(e) : nt.texture(e);
	                a.lutTexture = {
	                    url: s,
	                    texture: h
	                }, t.setLayerCanvasUpdated();
	            }, i.src = s;
	        }
	    }
	    const c = {
	        "enableGrain": +!!n.enable,
	        "grainFactor": void 0 === n.factor ? .15 : n.factor,
	        "timeGrain": performance.now(),
	        "enableVignette": +!!r.enable,
	        "lensRadius": r.lensRadius || [ .8, .25 ],
	        "frameMod": 1,
	        "enableLut": +!!o.enable,
	        "lookupTable": a.lutTexture ? a.lutTexture.texture : ot
	    };
	    (void 0).postprocess(c, rt({
	        width: ht.width,
	        height: ht.height,
	        data: s,
	        flipY: !0,
	        mag: "linear",
	        min: "linear",
	        mipmap: !1
	    })), n.enable && t.setLayerCanvasUpdated(), t.context.drawImage(ht, 0, 0, ht.width, ht.height);
	}

	t$1.renderer.MapCanvasRenderer.prototype.renderFrame = function() {
	    const t = ut.apply(this, arguments), s = this.map.getPostProcessConfig(), i = s && s.filmicGrain;
	    return !i || void 0 !== i.enable && !0 !== i.enable || this.setLayerCanvasUpdated(), 
	    t;
	};

	class ft {
	    constructor(t, s, i, e, h, n) {
	        this.renderer = new xe(t), this.sceneConfig = s, this.s = i, this.ei = e, 
	        this.hi = h, this.ni = n || {
	            factor: 0,
	            units: 0
	        }, this.i();
	    }
	    render(t, s, i) {
	        this.ri();
	        const e = this.s.getMap();
	        this.renderer.regl.clear({
	            color: [ 0, 0, 0, 0 ],
	            depth: 1,
	            stencil: 255,
	            framebuffer: this.oi
	        }), this.renderer.render(this.ai, s, t, this.oi);
	        const h = p({
	            colorRamp: this.ci,
	            inputTexture: this.oi,
	            projViewMatrix: e.projViewMatrix
	        }, s);
	        this.u(), this.renderer.render(this.li, h, this.F, i);
	    }
	    dispose() {
	        this.ai && (this.ai.dispose(), delete this.ai), this.li && (this.li.dispose(), delete this.li), 
	        this._ && (this._.geometry.dispose(), this._.dispose(), delete this._, delete this.F), 
	        this.oi && (this.oi.destroy(), delete this.oi);
	    }
	    ui() {
	        const t = this.ei;
	        let s = this.di, i = this.fi;
	        i ? i.clearRect(0, 0, 256, 1) : (s = this.di = document.createElement("canvas"), 
	        s.width = 256, s.height = 1, i = this.fi = s.getContext("2d"));
	        const e = i.createLinearGradient(0, 0, 256, 1);
	        for (let s = 0; s < t.length; s++) e.addColorStop(t[s][0], t[s][1]);
	        i.fillStyle = e, i.fillRect(0, 0, 256, 1), this.ci && this.ci.destroy();
	        const h = this.renderer.regl;
	        this.ci = h.texture({
	            width: 256,
	            height: 1,
	            data: s,
	            min: "linear",
	            mag: "linear",
	            premultiplyAlpha: !0
	        });
	    }
	    ri() {
	        const t = this.s.getRenderer().canvas, s = Math.ceil(t.width / 4), i = Math.ceil(t.height / 4), e = this.oi;
	        e.width === s && e.height === i || e.resize(s, i);
	    }
	    i() {
	        this.ui(), this.pi(), this.gi(), this.l();
	    }
	    l() {
	        const t = new Bt;
	        t.generateBuffers(this.renderer.regl), this._ = new et$1(t), this.F = new ft$1([ this._ ]);
	    }
	    u() {
	        const t = this.s.getMap(), s = C.getGroundTransform(this._.localTransform, t);
	        this._.setLocalTransform(s);
	    }
	    gi() {
	        const t = this.s.getRenderer().canvas, s = this.renderer.regl, i = s.hasExtension("OES_texture_half_float") ? "half float" : "float", e = Math.ceil(t.width / 4), h = Math.ceil(t.height / 4), n = s.texture({
	            width: e,
	            height: h,
	            type: i,
	            min: "linear",
	            mag: "linear",
	            format: "rgba"
	        });
	        this.oi = s.framebuffer({
	            width: e,
	            height: h,
	            color: [ n ]
	        });
	    }
	    pi() {
	        const t = this.s.getRenderer().canvas, s = this.sceneConfig.depthRange, i = {
	            viewport: {
	                x: 0,
	                y: 0,
	                width: () => t ? Math.ceil(t.width / 4) : 1,
	                height: () => t ? Math.ceil(t.height / 4) : 1
	            },
	            depth: {
	                enable: !0,
	                func: "always"
	            }
	        };
	        this.hi && (i.stencil = this.hi), this.ai = new En({
	            extraCommandProps: i
	        }), this.li = new Pn({
	            extraCommandProps: {
	                stencil: {
	                    enable: !1
	                },
	                depth: {
	                    enable: !0,
	                    range: s || [ 0, 1 ],
	                    func: "<="
	                },
	                polygonOffset: {
	                    enable: !0,
	                    offset: this.ni
	                }
	            }
	        });
	    }
	}

	"undefined" != typeof window && window.maptalks && (window.maptalks.GroupGLLayer = q, 
	window.maptalks.ViewshedAnalysis = Q, window.maptalks.FloodAnalysis = st, window.maptalks.SkylineAnalysis = it);

	const getGlobal = function () {
	  if (typeof self !== 'undefined') { return self; }
	  if (typeof window !== 'undefined') { return window; }
	  if (typeof global !== 'undefined') { return global; }
	  throw new Error('unable to locate global object');
	};

	const globals = getGlobal();

	const transcoders = globals['gl_trans__coders'] = globals['gl_trans__coders'] || {};

	function inject(chunk) {
	    // 奇怪的变量名是为了避免与worker源代码中的变量名冲突
	    const fnString = chunk.toString();
	    const prefixIndex = fnString.indexOf('{') + 1;
	    const prefix = fnString.substring(0, prefixIndex);

	    const transcoders = globals['gl_trans__coders'] = globals['gl_trans__coders'] || {};
	    let injected = `${prefix}
    const _____getGlobal = ${getGlobal.toString()};
    const g___lobals = _____getGlobal()
    const tran_____scoders = g___lobals['gl_trans__coders'] = g___lobals['gl_trans__coders'] || {};`;
	    for (const p in transcoders) {
	        if (p === 'inject' || p === 'getTranscoder' || p === 'registerTranscoder') {
	            continue;
	        }
	        injected += 'tran_____scoders["' + p + '"] =' + transcoders[p].toString() + '\n;';
	    }
	    injected += '\n' + fnString.substring(prefix.length);
	    return injected;
	}
	transcoders['inject'] = inject;

	function getTranscoder(name/*, options*/) {
	    return transcoders[name];
	}

	function registerTranscoder(name, fn) {
	    transcoders[name] = fn;
	}

	transcoders.registerTranscoder = registerTranscoder;
	transcoders.getTranscoder = getTranscoder;

	exports.FloodAnalysis = st;
	exports.GLContext = i;
	exports.GroundPainter = C;
	exports.GroupGLLayer = q;
	exports.HeatmapProcess = ft;
	exports.SkylineAnalysis = it;
	exports.ViewshedAnalysis = Q;
	exports.createREGL = d$1;
	exports.glMatrix = common;
	exports.mat2 = mat2;
	exports.mat2d = mat2d;
	exports.mat3 = mat3;
	exports.mat4 = mat4;
	exports.quat = quat;
	exports.quat2 = quat2;
	exports.reshader = reshadergl_es;
	exports.transcoders = transcoders;
	exports.vec2 = vec2;
	exports.vec3 = vec3;
	exports.vec4 = vec4;

	Object.defineProperty(exports, '__esModule', { value: true });

	typeof console !== 'undefined' && console.log('@maptalks/gl v0.65.3');

})));
