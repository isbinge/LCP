# [0.1.0-beta.12](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.11...v0.1.0-beta.12) (2020-05-26)

### Bug Fixes

- **form-design:** lcp-469 ([#227](https://github.com/allsworth/LCP.Web/issues/227)) ([9d58774](https://github.com/allsworth/LCP.Web/commit/9d5877465c70350f6cac450a2f8c04777a5e169f))
- **form-record:** ownerDeptId(object --> arrary) ([91b3c55](https://github.com/allsworth/LCP.Web/commit/91b3c55df7d3197e1c671796226ae6d219e77586))
- **org:** lcp-459 ([#223](https://github.com/allsworth/LCP.Web/issues/223)) ([d04c571](https://github.com/allsworth/LCP.Web/commit/d04c571927ddd6713ba0e793ba8339db24df6270))
- **org:** lcp-487 ([a344389](https://github.com/allsworth/LCP.Web/commit/a344389ea3ca3c94dcc2678c36374a6ebb4c33eb))
- **org:** lcp-488 lcp-494 ([#222](https://github.com/allsworth/LCP.Web/issues/222)) ([96b9c88](https://github.com/allsworth/LCP.Web/commit/96b9c8841b778ed697d9d927f64fd73060031876))
- **register:** lcp-500 ([8b5d2b5](https://github.com/allsworth/LCP.Web/commit/8b5d2b5a703fd27c4eeec119d0d606cb60e09761))
- **util:** lcp-497 ([482f034](https://github.com/allsworth/LCP.Web/commit/482f034cb393f6cc85fa40b8b2638656427271de))

### Features

- **form-record:** owner and ownerDept ([#225](https://github.com/allsworth/LCP.Web/issues/225)) ([453dce7](https://github.com/allsworth/LCP.Web/commit/453dce7558787ae6e1292cab870090e4416b8f1c))

# [0.1.0-beta.11](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.10...v0.1.0-beta.11) (2020-05-22)

### Bug Fixes

- **app:** lcp-464 ([5efb70d](https://github.com/allsworth/LCP.Web/commit/5efb70d9d499edf3ba2653b54083e357af7e5781))
- **form-record:** lcp-323 ([#220](https://github.com/allsworth/LCP.Web/issues/220)) ([4b1c050](https://github.com/allsworth/LCP.Web/commit/4b1c0502d00de630cb55484d62ece58dbb567fac))
- **form-record:** lcp-428 ([5e2778b](https://github.com/allsworth/LCP.Web/commit/5e2778b0843cb1814eb02367e62486c7c3a51617))
- **form-record:** lcp-474 ([a30078b](https://github.com/allsworth/LCP.Web/commit/a30078b45b7daccee269aad796e508957459feb2))
- **form-record:** lcp-477 ([fc57e15](https://github.com/allsworth/LCP.Web/commit/fc57e15cfc952a4f1100bd32696e8d15b01aba70))
- **form-tpl:** empty data title ([#210](https://github.com/allsworth/LCP.Web/issues/210)) ([89771a4](https://github.com/allsworth/LCP.Web/commit/89771a43464b64ba29a3f962009ce75bd4632c70))
- **form-tpl:** lcp-307 ([d1e52f7](https://github.com/allsworth/LCP.Web/commit/d1e52f78bfc5e879f09e6e2c18f23784c913d21f))
- **form-tpl:** lcp-382 ([df9b427](https://github.com/allsworth/LCP.Web/commit/df9b4270f4f10b2e44eaef134aed7b10d18205cd))
- **form-tpl:** lcp-478 ([#217](https://github.com/allsworth/LCP.Web/issues/217)) ([430b572](https://github.com/allsworth/LCP.Web/commit/430b572d15f11fa5bf80c01a1af7efe654ff3d45))
- **login:** lcp-460 reigster rule ([5426341](https://github.com/allsworth/LCP.Web/commit/54263419a20dff90cb32f7775194e63343108b5f))
- **org:** lcp-466 ([363a235](https://github.com/allsworth/LCP.Web/commit/363a2357ded5b17c1df4be6f9b4190e02e559f06))
- **org:** lcp-467 ([3c933b6](https://github.com/allsworth/LCP.Web/commit/3c933b681bdd08a1e91081283450d6f852224cbb))
- **role:** lcp-453 lcp-454 lcp-456 ([#211](https://github.com/allsworth/LCP.Web/issues/211)) ([1d3a96c](https://github.com/allsworth/LCP.Web/commit/1d3a96c3c0cd9dc1ae5adbba70ba5f2445bccff6))

### Code Refactoring

- **form-record:** instanceId ([760a81d](https://github.com/allsworth/LCP.Web/commit/760a81d3364dbea10be9741ead314c077b65f138))

### Features

- **form-record:** query-items ([#215](https://github.com/allsworth/LCP.Web/issues/215)) ([80d00d4](https://github.com/allsworth/LCP.Web/commit/80d00d44fc4fd301c36398d1a639ba25ef02b6c2))
- **org:** update routes when switching orgs ([33d5eb9](https://github.com/allsworth/LCP.Web/commit/33d5eb99b8ae42280dd9fd5631ce6c098d84bde8))

### BREAKING CHANGES

- **form-record:** paths under form instance are now starting with `/app/:appId/form/:templateId/inst/:instanceId`

# [0.1.0-beta.10](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.9...v0.1.0-beta.10) (2020-05-15)

> Known issues:
>
> 1. Previous form templates are incompatible with this version

### Bug Fixes

- **form-record:** data-link effects ([#200](https://github.com/allsworth/LCP.Web/issues/200)) ([6a4c028](https://github.com/allsworth/LCP.Web/commit/6a4c028305e77e974ed64fe04282b255ecc334ec))
- **form-record:** lcp-381 ([#207](https://github.com/allsworth/LCP.Web/issues/207)) ([ac21cf5](https://github.com/allsworth/LCP.Web/commit/ac21cf53e9b1b3c84d414c0cd681296a88975617))
- **form-record:** lcp-408 hide list-design rules ([dde6806](https://github.com/allsworth/LCP.Web/commit/dde68067286b16c913095f84d37331995447ad2c))
- **form-tpl:** lcp-410 ([#193](https://github.com/allsworth/LCP.Web/issues/193)) ([73df07a](https://github.com/allsworth/LCP.Web/commit/73df07ab6a837d013dbfc717429b5fdb24af4ae1))
- **form-tpl:** lcp-434 ([#196](https://github.com/allsworth/LCP.Web/issues/196)) ([b5fac1b](https://github.com/allsworth/LCP.Web/commit/b5fac1be77e4a4e63e52cd9f407ae8ea978af72e))
- **form-tpl:** owner ([5205ded](https://github.com/allsworth/LCP.Web/commit/5205dedc5873ef3755a2a4e117c917d969d904f3))
- **login:** lcp-389 ([5eb52a1](https://github.com/allsworth/LCP.Web/commit/5eb52a16ddf15fb7591cf9114b2d8c510bb0432b))
- **org:** lcp-411 lcp-415 lcp-424 ([#195](https://github.com/allsworth/LCP.Web/issues/195)) ([8da6526](https://github.com/allsworth/LCP.Web/commit/8da652658291104a43ba333812678002c25a3afb))
- **org:** lcp-426 lcp-413 lcp-415 ([#194](https://github.com/allsworth/LCP.Web/issues/194)) ([92517e5](https://github.com/allsworth/LCP.Web/commit/92517e5abd87706ad6cf6f08d7093f5d0e3d3c0d))

### Features

- **account:** reset password ([8e6b37f](https://github.com/allsworth/LCP.Web/commit/8e6b37fa676702e074dbbaa6a6d14176f60aac97))
- **form-record:** support default owner and ownerDept ([94faa8b](https://github.com/allsworth/LCP.Web/commit/94faa8b2466cc320649d2127b72076c071f38ed1))
- **form-tpl:** adapter for owner & ownerDept control ([#208](https://github.com/allsworth/LCP.Web/issues/208)) ([5fb4feb](https://github.com/allsworth/LCP.Web/commit/5fb4feb8b9f80c49f7ebd2b89263a14cd8efcb48))
- **form-tpl:** form-tpl support owner and ownerDept ([#202](https://github.com/allsworth/LCP.Web/issues/202)) ([d74b060](https://github.com/allsworth/LCP.Web/commit/d74b060d734c2e77745f5f7831eba55f4b6eda7a))
- **org:** switch orgs with new token redeemed ([#198](https://github.com/allsworth/LCP.Web/issues/198)) ([9351ebe](https://github.com/allsworth/LCP.Web/commit/9351ebe11e645d78763c40bf9d8b059b85f0a634))
- **role:** lcp-440 full support for role & users ([#206](https://github.com/allsworth/LCP.Web/issues/206)) ([ffb416a](https://github.com/allsworth/LCP.Web/commit/ffb416a101ddf25e729019fa589e1477785345a0))
- email templates for invitation and register ([ee00f85](https://github.com/allsworth/LCP.Web/commit/ee00f859d8b8853fff1a6873d8dbdca62d526d3f))

# [0.1.0-beta.9](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2020-04-30)

### Bug Fixes

- **account:** lcp-340 ([b0cb9a8](https://github.com/allsworth/LCP.Web/commit/b0cb9a88bd608aae74301a62f0bb313dae51ea38))
- **form-record:** lcp-209 ([#167](https://github.com/allsworth/LCP.Web/issues/167)) ([96a3c0d](https://github.com/allsworth/LCP.Web/commit/96a3c0decc8b4a8adb8349b9d0554711d42432ab))
- **form-record:** lcp-302 ([#166](https://github.com/allsworth/LCP.Web/issues/166)) ([bb467de](https://github.com/allsworth/LCP.Web/commit/bb467de67b11cf0c73955f1bd1f5a1a447716153))
- **form-record:** lcp-315 lcp-329 ([#157](https://github.com/allsworth/LCP.Web/issues/157)) ([dc8cc26](https://github.com/allsworth/LCP.Web/commit/dc8cc262f933c37dd593fa70936847cefc37e0ea))
- **form-record:** lcp-317 ([#160](https://github.com/allsworth/LCP.Web/issues/160)) ([f983f98](https://github.com/allsworth/LCP.Web/commit/f983f989242f09942b7573d2ca1e3a5aaffdf846))
- **form-record:** lcp-328 ([#162](https://github.com/allsworth/LCP.Web/issues/162)) ([93fe91e](https://github.com/allsworth/LCP.Web/commit/93fe91e4b124517bce5bb0046c6319996583bb76))
- **form-record:** lcp-338 lcp-285 ([#158](https://github.com/allsworth/LCP.Web/issues/158)) ([d88c0d6](https://github.com/allsworth/LCP.Web/commit/d88c0d659b44d609ca6654118be2b756a2a7ea68))
- **form-record:** lcp-340 ([87362f0](https://github.com/allsworth/LCP.Web/commit/87362f072e9d842380e329db69a9dfc22fae831b))
- **form-record:** lcp-347, submit utc time to service ([#165](https://github.com/allsworth/LCP.Web/issues/165)) ([f50002d](https://github.com/allsworth/LCP.Web/commit/f50002d7c2179d944cbdd77e5150839044cab73d))
- **form-record:** lcp-360 ([#172](https://github.com/allsworth/LCP.Web/issues/172)) ([6c2dd1f](https://github.com/allsworth/LCP.Web/commit/6c2dd1fde50cd6bb966488cf957705ff00e72e6d))
- **form-record:** lcp-376 lcp-387 ([#180](https://github.com/allsworth/LCP.Web/issues/180)) ([93ad228](https://github.com/allsworth/LCP.Web/commit/93ad2283182e2f29c2c2f6cfe42ed59140146d37))
- **form-tpl:** lcp-310 lcp-326 ([#163](https://github.com/allsworth/LCP.Web/issues/163)) ([e0424aa](https://github.com/allsworth/LCP.Web/commit/e0424aa781c9c69a49582dab8ff33ab3c0f5bde9))
- **form-tpl:** lcp-341 lcp-343 ([#171](https://github.com/allsworth/LCP.Web/issues/171)) ([14ca6f8](https://github.com/allsworth/LCP.Web/commit/14ca6f80a4d754659a0a23996f09b545b2b5bcce))
- **form-tpl:** lcp-349 lcp-355 lcp-363 ([#175](https://github.com/allsworth/LCP.Web/issues/175)) ([0e028ee](https://github.com/allsworth/LCP.Web/commit/0e028ee9926eab7673b920f8502e4ac911843aea))
- **form-tpl:** lcp-354 lcp-382 ([#183](https://github.com/allsworth/LCP.Web/issues/183)) ([20a030f](https://github.com/allsworth/LCP.Web/commit/20a030f8107f1ef66d284c79e43683680023db16))
- **org:** lcp-358 ([#164](https://github.com/allsworth/LCP.Web/issues/164)) ([695f332](https://github.com/allsworth/LCP.Web/commit/695f332f25458f4b115349bd5d26059fd9fd6ed8))
- **org:** lcp-394 ([31d2f3d](https://github.com/allsworth/LCP.Web/commit/31d2f3d35218a9dd115132cb25d1955a4bdf9787))
- **role:** lcp-384 ([#182](https://github.com/allsworth/LCP.Web/issues/182)) ([ac78a3f](https://github.com/allsworth/LCP.Web/commit/ac78a3fc7f21c4fcf8a3dd65e24ac7b760e3c3ae))
- lcp-293 lcp-354 ([#161](https://github.com/allsworth/LCP.Web/issues/161)) ([7ea53a5](https://github.com/allsworth/LCP.Web/commit/7ea53a5dfe4842fc7a359b11ca9c80935f91d0fa))
- lcp-350 lcp-357 ([#169](https://github.com/allsworth/LCP.Web/issues/169)) ([db354cd](https://github.com/allsworth/LCP.Web/commit/db354cd3d4b37473b7c39875bf23ac308384b4ab))

### Features

- **form-tpl:** lcp-289 ([#185](https://github.com/allsworth/LCP.Web/issues/185)) ([50966b8](https://github.com/allsworth/LCP.Web/commit/50966b8f1d7668987b448f04223c3e7ee036d9e2))
- **org:** lcp-352 department and member ([8188617](https://github.com/allsworth/LCP.Web/commit/818861751d45ad4f1ce7612470f18756b6cf64fe))
- **org:** lcp-366 invite member again, adjust department ([#179](https://github.com/allsworth/LCP.Web/issues/179)) ([ca1960b](https://github.com/allsworth/LCP.Web/commit/ca1960bc6f35f1148e4e0afc20eabff0803cbd6a))
- **org:** lcp-374 member invitation ([#184](https://github.com/allsworth/LCP.Web/issues/184)) ([205d7d9](https://github.com/allsworth/LCP.Web/commit/205d7d96061ffc4c8bb2f2957adc987e89f70b54))

# [0.1.0-beta.8](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.7...v0.1.0-beta.8) (2020-04-17)

This release contains bugfixes and CRUD operations for organization.

### Bug Fixes

- lcp-270 lcp-297 lcp-298 lcp-301 ([#149](https://github.com/allsworth/LCP.Web/issues/149)) ([8ce719f](https://github.com/allsworth/LCP.Web/commit/8ce719f8ee2385fe7b79c7ac6ab5492458a342ac))
- lcp-318 lcp-320 lcp-332 ([#153](https://github.com/allsworth/LCP.Web/issues/153)) ([ed818e6](https://github.com/allsworth/LCP.Web/commit/ed818e617aa6f085bc9d09d14be6dd0621c941f1))
- lcp-327 lcp-342 ([#148](https://github.com/allsworth/LCP.Web/issues/148)) ([5761ebf](https://github.com/allsworth/LCP.Web/commit/5761ebfd08009c998deb08a84e7e533a52c56d43))
- **form-record:** lcp-331 ([#147](https://github.com/allsworth/LCP.Web/issues/147)) ([238d0a6](https://github.com/allsworth/LCP.Web/commit/238d0a6044de6c66d2a911f7cda89316244ad76b))
- **form-record:** lcp-311 ([#142](https://github.com/allsworth/LCP.Web/issues/142)) ([2dc3a48](https://github.com/allsworth/LCP.Web/commit/2dc3a4879dbf55f8a38726c2a143836a9cddfe3b))
- **form-tpl:** lcp-308 lcp-310 ([#141](https://github.com/allsworth/LCP.Web/issues/141)) ([43a2795](https://github.com/allsworth/LCP.Web/commit/43a2795ab717c4cdb9580043e83c223f8d91d794))
- **form-tpl:** lcp-312 ([#143](https://github.com/allsworth/LCP.Web/issues/143)) ([3020388](https://github.com/allsworth/LCP.Web/commit/3020388ea727dbdb22d910a87e21d350ffd2c58c))

### Features

- **org:** organization CRUD ops ([#140](https://github.com/allsworth/LCP.Web/issues/140)) ([46be568](https://github.com/allsworth/LCP.Web/commit/46be568289d9469159cd184cf3d8eb6ebdf4559f))

# [0.1.0-beta.7](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.6...v0.1.0-beta.7) (2020-04-14)

### Bug Fixes

- LCP-287 LCP-288 LCP-294 LCP-296 ([#136](https://github.com/allsworth/LCP.Web/issues/136)) ([6ccdd0d](https://github.com/allsworth/LCP.Web/commit/6ccdd0dae3ae6ea071f8bcec2ade586eab20d8d7))
- **form-record:** assoc-form exclude draft data ([#138](https://github.com/allsworth/LCP.Web/issues/138)) ([75dcd5e](https://github.com/allsworth/LCP.Web/commit/75dcd5ee2ede08df4741ce30c3dfdce04208c0d5))
- **form-record:** issue LCP-272 ([#130](https://github.com/allsworth/LCP.Web/issues/130)) ([0500731](https://github.com/allsworth/LCP.Web/commit/0500731d6b42a8474d160d78d9dbd9046b7acf94))
- **form-record:** lcp-283 ([#132](https://github.com/allsworth/LCP.Web/issues/132)) ([059c9ac](https://github.com/allsworth/LCP.Web/commit/059c9acc4f05ba0ba15655e1e077e5cc94bf7f7d))
- **form-tpl:** lcp-209 ([#135](https://github.com/allsworth/LCP.Web/issues/135)) ([86d33ef](https://github.com/allsworth/LCP.Web/commit/86d33ef758a89ebc8bd3bf57f255dea37dde1d0c))
- **form-tpl:** LCP-274 ([#129](https://github.com/allsworth/LCP.Web/issues/129)) ([6082571](https://github.com/allsworth/LCP.Web/commit/6082571cc011bd43f1531008b7d84cd2e83f1223))
- **form-tpl:** lcp-280 ([#133](https://github.com/allsworth/LCP.Web/issues/133)) ([11aabbd](https://github.com/allsworth/LCP.Web/commit/11aabbdee732e6c2e7a4d53b037ec40a2a77f7a7))
- **form-tpl:** LCP-282 and rename components ([#131](https://github.com/allsworth/LCP.Web/issues/131)) ([c13d8e3](https://github.com/allsworth/LCP.Web/commit/c13d8e349c26126dddf40b793bb3a225fff3b015))

### Features

- **form-record:** sorting and filtering ([#134](https://github.com/allsworth/LCP.Web/issues/134)) ([8e65a0e](https://github.com/allsworth/LCP.Web/commit/8e65a0e656fe3761b8b47cb94d199c7db07dcaa4))
- **form-tpl:** recordlist settings update ([2e3d904](https://github.com/allsworth/LCP.Web/commit/2e3d904026e9efd5ed2b34a050f6a636f81dd37b))

# [0.1.0-beta.6](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.5...v0.1.0-beta.6) (2020-04-07)

### Bug Fixes

- **org:** LCP-265 ([#124](https://github.com/allsworth/LCP.Web/issues/124)) ([bcfe61e](https://github.com/allsworth/LCP.Web/commit/bcfe61ee345882cd2f24a69fcd896804dc960de4))

### Features

- **form-inst:** filter controls ([365013d](https://github.com/allsworth/LCP.Web/commit/365013d6d7ba3ff3acd341807c6fa43f7228ab2a))
- **form-record:** list design ([fc023df](https://github.com/allsworth/LCP.Web/commit/fc023dfcb18fe64be4a09a8ffd272f71e723c8f9))
- **login:** landing page, login, register ([27cd663](https://github.com/allsworth/LCP.Web/commit/27cd663b984a42fef8f9c539ba1056472495a286))

# [0.1.0-beta.5](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.4...v0.1.0-beta.5) (2020-03-27)

### Bug Fixes

- **app:** LCP-239 ([274a8e1](https://github.com/allsworth/LCP.Web/commit/274a8e19ed4458b759a8d0733e6fabfd7858db61))
- **dept:** failed to fetch departments ([#107](https://github.com/allsworth/LCP.Web/issues/107)) ([c971e37](https://github.com/allsworth/LCP.Web/commit/c971e373b445a636079297ba7741eb535f01958e))
- **form-inst:** stringify assoc-form value ([#116](https://github.com/allsworth/LCP.Web/issues/116)) ([38475a0](https://github.com/allsworth/LCP.Web/commit/38475a025622d6e505fde09d33bbde5bdef9cacc))
- **form-record:** grouptitle toggle ([#120](https://github.com/allsworth/LCP.Web/issues/120)) ([d5d8e88](https://github.com/allsworth/LCP.Web/commit/d5d8e88a07ddcfbed73cbebf251678c63cd1eab6))
- **form-record:** LCP-209 examine switch ([#112](https://github.com/allsworth/LCP.Web/issues/112)) ([6ee4803](https://github.com/allsworth/LCP.Web/commit/6ee4803191ae8829d80879d6e950bb3c326f6e60))
- **form-record:** LCP-237 ([#108](https://github.com/allsworth/LCP.Web/issues/108)) ([fe6762b](https://github.com/allsworth/LCP.Web/commit/fe6762bde7215b769e4c6af31651e31a230760e7))
- **form-tpl:** LCP-221 ([#114](https://github.com/allsworth/LCP.Web/issues/114)) ([7530e2d](https://github.com/allsworth/LCP.Web/commit/7530e2daa5c778e4c5b00a84c14f46497487a698))
- **form-tpl:** LCP-224 ([#109](https://github.com/allsworth/LCP.Web/issues/109)) ([9561f61](https://github.com/allsworth/LCP.Web/commit/9561f618c7414f4397f6afedd818330c03dee7c3))
- **form-tpl:** lCP-234 ([#110](https://github.com/allsworth/LCP.Web/issues/110)) ([44acbc3](https://github.com/allsworth/LCP.Web/commit/44acbc3ade37325944f41e2f3306ca42eb0c8595))
- **org:** issue LCP-231 ([#118](https://github.com/allsworth/LCP.Web/issues/118)) ([a3263ec](https://github.com/allsworth/LCP.Web/commit/a3263ec81597f517c01a428451fb0a95fea26824))
- **org:** issue LCP-251 ([#119](https://github.com/allsworth/LCP.Web/issues/119)) ([381dca6](https://github.com/allsworth/LCP.Web/commit/381dca6b56b666d9f5f93e36294d3f31bd63f0cd))

### Features

- **app:** form instance auto redirect ([0706015](https://github.com/allsworth/LCP.Web/commit/0706015f0dbc84cfb9b216a4e6d0e81852b690fa))
- **form-record:** subform info and update ([#117](https://github.com/allsworth/LCP.Web/issues/117)) ([6c0f319](https://github.com/allsworth/LCP.Web/commit/6c0f319bfe882acd95ed91fa30405343d9005d13))
- **form-tpl:** adapt data ([#106](https://github.com/allsworth/LCP.Web/issues/106)) ([51fb9db](https://github.com/allsworth/LCP.Web/commit/51fb9dba01623d31a763acd585e57ea1048723e9))
- **role:** sub-admin ([#115](https://github.com/allsworth/LCP.Web/issues/115)) ([6a2069b](https://github.com/allsworth/LCP.Web/commit/6a2069b9c71320dba276f116fbe11d06a57784fe))

# [0.1.0-beta.4](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.3...v0.1.0-beta.4) (2020-03-20)

### Bug Fixes

- **form-inst:** lCP-210 ([#94](https://github.com/allsworth/LCP.Web/issues/94)) ([310c060](https://github.com/allsworth/LCP.Web/commit/310c060cd33f04d095bce8bc9b3aa11926098435))
- **form-inst:** using native antd date picker ([637c9b9](https://github.com/allsworth/LCP.Web/commit/637c9b957091158969b6e480c752dae756e82135))
- LCP-194 LCP-222 LCP-223 ([#93](https://github.com/allsworth/LCP.Web/issues/93)) ([95c4b0f](https://github.com/allsworth/LCP.Web/commit/95c4b0f6a10d6e66e618d2159f44f15a00d069f8)), closes [#95](https://github.com/allsworth/LCP.Web/issues/95)
- **form-tpl:** LCP-229 LCP-227 LCP-230 ([#97](https://github.com/allsworth/LCP.Web/issues/97)) ([36be3f6](https://github.com/allsworth/LCP.Web/commit/36be3f66f7468dd406ffc76d1f69ba93353ffa09))
- **form-tpl:** subform title ([#104](https://github.com/allsworth/LCP.Web/issues/104)) ([d4baf3a](https://github.com/allsworth/LCP.Web/commit/d4baf3a81c687a11b3f3911f4f6e60c6b5893d8a))

### Features

- **app:** app-detail UI/UX optimize ([8ce6de3](https://github.com/allsworth/LCP.Web/commit/8ce6de33006ad5117c3403f9bea7f00960f11c55))
- **app:** support blank app guide ([6c20042](https://github.com/allsworth/LCP.Web/commit/6c200428a03665a9c6cb55f96f25b79f1cb1773d))
- **form-record:** create subform ([#99](https://github.com/allsworth/LCP.Web/issues/99)) ([5a03c98](https://github.com/allsworth/LCP.Web/commit/5a03c98a1ddced090738ed2147fcbff67d9209d8))
- **from-tpl:** i18n ([#92](https://github.com/allsworth/LCP.Web/issues/92)) ([a320175](https://github.com/allsworth/LCP.Web/commit/a32017588680f600cdf0981de8ad99f697d5bf1e))
- **role:** add role ([#103](https://github.com/allsworth/LCP.Web/issues/103)) ([6e1336a](https://github.com/allsworth/LCP.Web/commit/6e1336af5e2b9efa18ed7ebf0f5cc3b639a2ad4f))

# [0.1.0-beta.3](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2020-03-13)

### Bug Fixes

- **form-inst:** LCP-193 and drag control bug ([#83](https://github.com/allsworth/LCP.Web/issues/83)) ([9e3a548](https://github.com/allsworth/LCP.Web/commit/9e3a548126ba8fe2a27709472fde678ca9faa492))
- **form-inst:** LCP-211 ([#88](https://github.com/allsworth/LCP.Web/issues/88)) ([e1c74d4](https://github.com/allsworth/LCP.Web/commit/e1c74d4368235774734fe72f5924495f8b60a8f0))
- **form-tpl:** fix subform style ([#84](https://github.com/allsworth/LCP.Web/issues/84)) ([0ba59f9](https://github.com/allsworth/LCP.Web/commit/0ba59f975b117688cfec6b739f892ff6df03adfc))
- **form-tpl:** switch name ([#90](https://github.com/allsworth/LCP.Web/issues/90)) ([f455f2b](https://github.com/allsworth/LCP.Web/commit/f455f2b65d0e78e5a9cc8b8ff2788f15c52ebc30))
- **org:** LCP-197 ([3487274](https://github.com/allsworth/LCP.Web/commit/34872743c7eaf293f9e0108de00c881259a70b75))
- **org:** style ([b9e1d04](https://github.com/allsworth/LCP.Web/commit/b9e1d04e1cec638de5b7f87575375aa59e0a3492))

### Features

- **form-inst:** add search for select and assoc-form ([#77](https://github.com/allsworth/LCP.Web/issues/77)) ([cd9902e](https://github.com/allsworth/LCP.Web/commit/cd9902e6b3286136e9ab49b83a026aeed837eef4))
- **form-tpl:** support subform ([#81](https://github.com/allsworth/LCP.Web/issues/81)) ([08de54b](https://github.com/allsworth/LCP.Web/commit/08de54bc6cd9ca43aa2a4d20e7605305bb06d0a2))
- **org:** add i18n ([#86](https://github.com/allsworth/LCP.Web/issues/86)) ([1e933f7](https://github.com/allsworth/LCP.Web/commit/1e933f7eb7cfdc2c9c9d3a661d6e83e7a059126c))

# [0.1.0-beta.2](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2020-03-06)

### Bug Fixes

- message refactor property id->content ([ab746e7](https://github.com/allsworth/LCP.Web/commit/ab746e7f0426e547e87d9de69f6d4abaf0a22db3))

### Features

- **app:** form list loading, delete confirm ([c98b3c4](https://github.com/allsworth/LCP.Web/commit/c98b3c4b6c02e811f7e545deed4d92fc3dff5d46))
- **form-inst:** form data info ([#75](https://github.com/allsworth/LCP.Web/issues/75)) ([812d5d7](https://github.com/allsworth/LCP.Web/commit/812d5d7dba362f2d3d3b4163c062c626c1b1e81c))
- **i18n:** better 40x warning ([1802b62](https://github.com/allsworth/LCP.Web/commit/1802b62d4523bef4807e38d70b369296681da966))
- **i18n:** support i18n ([97425fa](https://github.com/allsworth/LCP.Web/commit/97425fa4017eaebe04160526ac4921af3f5aff3c))
- **org:** support organization ([#76](https://github.com/allsworth/LCP.Web/issues/76)) ([df40680](https://github.com/allsworth/LCP.Web/commit/df40680d2a2f9b9f4ef7652856ef615b5c6b552d))

# [0.1.0-beta.1](https://github.com/allsworth/LCP.Web/compare/v0.1.0-beta...v0.1.0-beta.1) (2020-03-03)

### Features

- **form-inst:** assoc-form ([#74](https://github.com/allsworth/LCP.Web/issues/74)) ([3002192](https://github.com/allsworth/LCP.Web/commit/30021924c1b2cecc25c247062ba20da5c2d5cbb2))

# [0.1.0-alpha.5](https://github.com/allsworth/LCP.Web/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-01-20)

### Bug Fixes

- **form-inst:** solve style tangles ([d82f7cc](https://github.com/allsworth/LCP.Web/commit/d82f7cc6df149b32ed5bd5fdc86c34f1ea5b73dd))

### Features

- **form-inst:** form data crud ([#70](https://github.com/allsworth/LCP.Web/issues/70)) ([3779346](https://github.com/allsworth/LCP.Web/commit/3779346805e411f37a1033905361e550d9d3a668))

# [0.1.0-alpha.5](https://github.com/allsworth/LCP.Web/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2020-01-20)

### Features

- **form-inst:** form data crud ([#70](https://github.com/allsworth/LCP.Web/issues/70)) ([3779346](https://github.com/allsworth/LCP.Web/commit/3779346805e411f37a1033905361e550d9d3a668))

# [0.1.0-alpha.4](https://github.com/allsworth/LCP.Web/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2020-01-17)

### Bug Fixes

- **form-design:** LCP-141 LCP-132 LCP-149 ([#63](https://github.com/allsworth/LCP.Web/issues/63)) ([75176bc](https://github.com/allsworth/LCP.Web/commit/75176bc442b6539e8f8826b3cfb8b9a374d944b2))
- **form-inst:** issue LCP-158 ([a5d981b](https://github.com/allsworth/LCP.Web/commit/a5d981ba00a38e2cd890f0814bc20b9a3cf8f7ab))
- **form-tpl:** assocForm and textarea specs ([#68](https://github.com/allsworth/LCP.Web/issues/68)) ([88eaed9](https://github.com/allsworth/LCP.Web/commit/88eaed9ff0d6966116f19513980aef60314e0747))
- **form-tpl:** lCP-165 LCP-167 fix adapter default name ([#69](https://github.com/allsworth/LCP.Web/issues/69)) ([0cbf48e](https://github.com/allsworth/LCP.Web/commit/0cbf48ee6d5f45b952f4f37e98d9af9833b0b085))

### Features

- create form data ([#54](https://github.com/allsworth/LCP.Web/issues/54)) ([927de13](https://github.com/allsworth/LCP.Web/commit/927de132e5c9e7c16c611b7252d627acf4a4dd6e))
- **app-detail:** add form data list ([#67](https://github.com/allsworth/LCP.Web/issues/67)) ([edcedc9](https://github.com/allsworth/LCP.Web/commit/edcedc9e12522a6ff801d879683277a763959da6))
- **form-spec:** add data-title ([#65](https://github.com/allsworth/LCP.Web/issues/65)) ([557a17e](https://github.com/allsworth/LCP.Web/commit/557a17eaf24035fffcd9c736666fc0990deaa387))
- **login:** login, private route parsing ([27abf44](https://github.com/allsworth/LCP.Web/commit/27abf449a5b3634cb67c5f8a4635b862c8988596))

# [0.1.0-alpha.3](https://github.com/allsworth/LCP.Web/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2020-01-09)

### Bug Fixes

- issues of app detail & form design ([#59](https://github.com/allsworth/LCP.Web/issues/59)) ([8cf336a](https://github.com/allsworth/LCP.Web/commit/8cf336a4cbfd730c8987dddbbef38a72990538f2))
- LCP-156 LCP-158 ([#60](https://github.com/allsworth/LCP.Web/issues/60)) ([b8b8760](https://github.com/allsworth/LCP.Web/commit/b8b876052e0e07798bfe1c83d06daaf5bcfee09b))
- switch adapter ([#61](https://github.com/allsworth/LCP.Web/issues/61)) ([db0e744](https://github.com/allsworth/LCP.Web/commit/db0e744c7d0c9692f23dbed910b73749a8f74b99))
