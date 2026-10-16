"""Sculpt the vessel surface itself using connected, hand-drawn anatomical masses."""
from figures import p, crease, ell


def glow(d, width=1.35, opacity=.55):
    return p(d, stroke='#fffdf0', width=width*.72,
             extra=f'opacity="{opacity*.78}" filter="url(#fondu)"')


def wash(d, opacity=.5):
    return p(d, 'url(#creux)', extra=f'opacity="{opacity}" filter="url(#fondu-large)"')


def light(d, opacity=.45):
    return p(d, 'url(#clair-sculpte)', extra=f'opacity="{opacity}" filter="url(#fondu-large)"')


def head(x, y, scale=1, angle=0, mirror=False):
    sx = -scale if mirror else scale
    return f'<use href="#tete-sculptee" transform="translate({x} {y}) rotate({angle}) scale({sx} {scale})"/>'


def torso(x, y, sx=1, sy=1, angle=0):
    return f'<use href="#buste-elan" transform="translate({x} {y}) rotate({angle}) scale({sx} {sy})" opacity=".93"/>'


def mass(d):
    return p(d, 'url(#surface)', extra='opacity=".86" filter="url(#fondu-large)"')


def aurore():
    result = '<g id="sculpture-continue">'
    # The two hips open directly into the tapered lower wall, without isolated feet.
    result += mass('M101 175 C112 160 138 165 153 188 C167 210 178 214 193 198 C209 180 224 177 229 194 L226 260 C225 293 210 317 205 339 Q160 354 115 339 C104 304 100 271 101 244Z')
    result += light('M112 170 C121 172 137 185 136 203 C131 228 110 247 116 277 C124 310 129 327 135 342 L116 338 C108 311 101 278 106 250 C109 225 114 211 112 170Z', .72)
    result += wash('M144 178 C166 190 169 212 157 231 C142 251 131 268 136 292 C139 312 151 326 145 343 C157 326 150 309 150 291 C148 267 165 254 170 236 C177 216 165 190 144 178Z', .57)
    result += light('M182 211 C204 222 205 240 191 260 C177 281 180 309 196 336 L177 342 C163 317 162 290 174 264 C190 240 193 230 182 211Z', .72)
    result += wash('M209 215 C223 230 220 253 211 267 C201 286 202 312 207 334 C217 306 219 279 223 264 Q235 238 209 215Z', .54)
    # Arms share the rim-side wall; the gesture travels from one body into the other.
    result += mass('M104 145 C89 136 85 124 90 110 L99 93 Q101 90 102 94 L98 110 C96 118 101 127 113 132 L120 140Z')
    result += wash('M91 113 C89 129 96 137 111 143 L107 147 C93 140 84 127 91 113Z', .55)
    result += p('M94 104 C90 116 91 130 102 137 L107 134 C98 125 97 114 99 104Z', 'url(#membre)', extra='opacity=".58" filter="url(#fondu)"')
    result += glow('M92 112 C89 122 95 132 100 135', 1.8, .48)
    result += mass('M135 149 C146 152 151 165 157 179 C160 183 164 181 170 173 L189 155 L196 146 Q198 145 198 149 L194 154 Q202 150 202 154 C201 160 192 163 187 165 L172 189 C165 199 151 198 145 188 L129 162Z')
    result += wash('M142 157 C154 173 150 192 160 191 C170 190 178 172 186 166 C178 182 170 200 158 195 C149 193 147 171 142 157Z', .65)
    result += glow('M142 157 C148 164 149 172 154 181 Q158 190 165 183 M183 160 L193 153', 1.25, .65)
    result += crease('M194 154 L198 151 M190 159 L196 156', .42, .37)
    result += mass('M210 152 C225 155 234 171 232 187 C231 198 220 202 214 195 L192 180 L181 176 Q177 172 181 171 L190 174 L186 166 Q187 163 190 165 L197 173 L220 186 Q224 171 209 164Z')
    result += wash('M219 161 C234 177 232 193 220 196 L201 182 C215 189 222 193 224 183 C226 174 222 165 219 161Z', .57)
    result += glow('M216 159 C226 169 229 179 225 187 M184 173 L196 178 L214 188', 1.4, .6)
    result += torso(127, 117, 1.05, 1.12, -7)
    result += torso(189, 128, -.97, 1.05, 12)
    result += p('M151 178 C154 185 159 187 165 183 L186 161 C190 158 195 156 197 152 Q200 150 200 153 L195 159 Q203 155 203 158 Q201 162 195 164 L171 189 C165 197 155 197 149 190Z', 'url(#membre)', extra='opacity=".93" filter="url(#fondu)"')
    result += wash('M153 186 C158 195 165 193 172 184 L185 167 C182 179 174 191 166 195 Q157 199 153 186Z', .40)
    result += glow('M157 187 Q162 191 167 186 L182 167', 1.05, .52)
    # The folded drapery is the lower vessel, not a separate ribbon or skirt.
    result += mass('M117 209 C129 213 140 220 151 219 C168 218 180 211 197 207 C194 224 185 245 171 260 C155 279 159 307 176 340 Q157 347 144 343 C131 322 125 303 132 280 C137 258 134 242 117 236Z')
    result += wash('M142 222 C149 235 143 252 136 273 C128 299 137 320 145 340 C132 326 123 304 128 283 C133 259 139 244 134 225Z', .7)
    result += wash('M186 216 C190 235 170 249 163 270 C156 294 168 323 172 339 C155 317 146 287 155 267 C167 243 179 234 186 216Z', .60)
    result += glow('M121 213 Q137 227 155 223 C167 221 177 216 188 214 M145 229 C151 247 132 267 136 291 C137 310 145 327 151 338 M183 224 C180 245 164 254 166 282 Q167 311 181 334', 1.6, .48)
    result += crease('M113 247 C112 277 126 298 125 322 M198 244 C207 270 190 287 196 316', .8, .28)
    result += head(127, 117, 1.05, -7)
    result += head(189, 128, 1.03, 12, True)
    return result + '</g>'


def onde():
    result = '<g id="sculpture-continue">'
    result += mass('M68 164 C87 142 115 146 132 162 C151 176 159 178 175 159 C198 136 233 144 259 162 C273 188 281 223 263 254 C241 301 200 323 161 327 C117 325 73 301 54 259 C44 221 46 190 68 164Z')
    # Convex hips and drapery sweep across the whole bowl and meet its contact ring.
    result += light('M70 178 C82 168 108 183 104 204 C101 227 77 233 76 259 C78 286 107 313 139 323 C103 316 73 302 58 270 C46 242 62 227 66 210 C70 197 65 186 70 178Z', .76)
    result += wash('M111 173 C146 188 137 216 116 236 C92 259 105 287 130 312 C104 299 84 278 86 258 C86 236 113 222 114 203 C114 190 109 178 111 173Z', .62)
    result += light('M208 181 C237 184 250 210 235 233 C214 262 214 292 184 319 C217 310 247 289 258 262 C269 237 263 197 236 179Z', .6)
    result += wash('M234 184 C269 207 264 237 247 252 C228 269 230 293 207 312 C219 290 219 268 239 246 C253 224 248 201 234 184Z', .66)
    result += mass('M76 171 C58 160 45 144 49 126 L63 109 Q68 101 71 104 C72 106 65 112 63 116 L59 130 C57 140 68 151 83 156 Q90 168 76 171Z')
    result += wash('M51 127 C49 142 55 151 62 154 L58 160 C45 149 43 135 51 127Z', .6)
    result += p('M52 123 C47 136 54 149 73 159 L78 159 C60 149 53 140 56 127Z', 'url(#membre)', extra='opacity=".59" filter="url(#fondu)"')
    result += glow('M53 128 Q49 143 60 149', 1.4, .55)
    result += mass('M105 160 C117 166 128 187 133 197 C137 204 143 203 149 195 L168 172 L177 165 Q182 163 183 166 L176 172 Q184 173 180 175 L174 176 L157 207 C148 221 133 221 126 211 L96 175Z')
    result += wash('M111 169 C126 185 131 211 142 213 C151 211 156 197 161 191 C154 210 151 220 140 218 C127 215 122 183 111 169Z', .6)
    result += glow('M114 170 C124 180 128 195 133 202 Q138 214 146 204 M159 182 L174 169', 1.65, .57)
    result += mass('M177 146 C190 146 206 133 207 120 L204 103 L201 94 Q202 90 205 93 L211 101 C216 103 213 109 216 118 C220 138 207 155 190 162 L176 159Z')
    result += wash('M210 107 C219 131 210 146 193 156 L186 158 C205 149 212 134 210 118Z', .61)
    result += p('M206 106 C213 129 205 144 191 151 L194 156 C213 142 219 122 211 106Z', 'url(#membre)', extra='opacity=".62" filter="url(#fondu)"')
    result += glow('M208 106 Q213 125 207 136 C203 144 197 149 190 152', 1.7, .5)
    result += mass('M247 163 C263 174 277 190 275 207 C273 221 257 224 246 217 L219 201 L207 199 Q202 196 206 193 L215 195 L211 188 Q212 184 216 188 L221 194 L258 207 Q263 194 242 177Z')
    result += wash('M255 178 C279 195 271 218 261 218 C247 216 237 207 228 203 C250 213 261 214 265 205 C268 197 262 186 255 178Z', .66)
    result += glow('M252 178 C264 185 271 199 265 207 M208 195 L221 199 L246 212', 1.5, .55)
    result += torso(89, 132, .96, 1.1, -18)
    result += torso(158, 116, 1.24, 1.16, -4)
    result += torso(222, 139, -.96, 1.05, 18)
    result += p('M129 196 Q135 211 144 205 L167 176 L177 165 Q182 163 183 166 L176 172 Q184 173 180 175 L174 178 L154 212 C145 224 131 220 126 211Z', 'url(#membre)', extra='opacity=".93" filter="url(#fondu)"')
    result += wash('M129 207 Q139 223 148 211 L161 194 C158 207 150 220 141 220 Q131 220 129 207Z', .36)
    result += glow('M134 208 Q140 216 146 207 L165 183', 1.1, .5)
    result += p('M256 210 C248 210 232 201 225 198 L213 191 Q206 187 206 190 L211 197 Q202 192 204 197 Q208 201 218 201 L246 217 Q253 220 260 215Z', 'url(#membre)', extra='opacity=".89" filter="url(#fondu)"')
    result += wash('M211 198 C226 206 245 216 255 214 L247 219 C234 214 221 207 211 198Z', .4)
    # Joined leg masses establish one lower bowl, with only a few deep folds.
    result += mass('M97 219 C124 222 145 236 160 241 C181 231 205 220 229 219 C222 240 205 248 194 260 C179 280 187 308 201 317 C179 326 149 330 128 322 C117 312 117 299 123 282 C131 258 118 247 97 242Z')
    result += wash('M145 234 C165 253 140 270 136 285 C132 300 144 314 153 326 C129 318 122 303 129 283 C134 265 143 250 137 239Z', .7)
    result += wash('M212 224 C211 248 184 255 179 274 C172 293 183 307 187 321 C173 311 160 289 168 273 C175 252 199 244 202 228Z', .63)
    result += light('M147 242 C160 257 155 267 150 280 C145 294 151 313 161 326 C174 313 169 293 177 277 C180 264 173 245 166 238Z', .5)
    result += glow('M108 229 C129 232 140 244 141 253 C144 270 125 284 134 301 Q142 315 149 319 M204 233 C199 252 179 260 181 278 C181 292 190 305 195 314', 1.7, .48)
    result += crease('M70 260 C81 288 103 303 115 313 M246 253 C239 278 225 295 208 303 M155 278 Q150 301 165 316', .8, .27)
    result += head(89, 132, .98, -18)
    result += head(158, 116, 1.14, -4)
    result += head(222, 139, 1, 18, True)
    return result + '</g>'


def brise():
    result = '<g id="sculpture-continue">'
    # The neck, shoulders and lower drapery form the hourglass profile together.
    result += mass('M112 128 C127 115 146 125 164 144 C184 122 204 127 209 145 C214 166 226 191 231 217 C238 256 218 299 198 337 Q162 352 122 337 C101 306 84 263 89 224 C93 189 120 158 112 128Z')
    result += light('M117 146 C130 154 135 170 127 192 C117 216 103 242 112 273 C121 300 131 321 135 343 L122 337 C101 304 89 274 93 245 C95 215 123 177 117 146Z', .68)
    result += wash('M183 144 C203 163 201 183 191 206 C182 229 210 243 207 268 C208 293 192 319 190 341 C208 321 224 293 224 268 C224 244 200 220 204 202 C215 177 209 162 183 144Z', .62)
    result += mass('M132 147 C114 141 107 123 105 108 L94 88 Q90 80 94 78 C97 80 99 86 102 89 L112 105 C118 116 119 126 138 131Z')
    result += wash('M106 100 C110 118 114 135 131 140 L131 149 C112 143 104 124 102 109Z', .64)
    result += p('M104 100 C109 114 111 127 123 137 L130 135 C118 124 116 111 109 102Z', 'url(#membre)', extra='opacity=".61" filter="url(#fondu)"')
    result += glow('M105 99 C109 111 109 123 117 130', 1.7, .55)
    result += mass('M181 147 C199 150 213 171 214 192 C215 204 207 209 196 202 L172 186 L163 183 Q158 180 162 178 L171 180 L168 173 Q169 170 172 173 L178 180 L201 191 C203 177 194 168 180 162Z')
    result += wash('M198 161 C211 174 217 197 205 205 L179 188 C197 196 204 201 205 188 C204 177 201 168 198 161Z', .68)
    result += glow('M195 161 C205 173 209 185 206 193 M161 180 L174 184 L195 197', 1.6, .58)
    result += torso(160, 114, 1.3, 1.18, -4)
    result += p('M201 195 C190 193 180 185 173 182 L164 174 Q161 170 161 174 L163 180 Q154 177 157 181 Q159 185 168 187 L194 203 Q202 207 206 198Z', 'url(#membre)', extra='opacity=".93" filter="url(#fondu)"')
    result += wash('M163 184 C175 190 195 205 201 201 Q194 209 184 201 L163 188Z', .4)
    result += glow('M168 183 C178 187 188 195 197 196', 1.1, .5)
    result += mass('M131 207 C143 215 157 217 175 208 C192 211 209 226 212 245 C214 269 193 280 190 297 C187 316 194 328 197 336 C173 350 145 351 124 337 C114 314 108 302 116 278 C129 252 136 231 131 207Z')
    result += wash('M139 219 C146 240 125 260 124 282 C121 306 138 324 142 344 C123 330 113 308 119 285 C126 257 138 241 132 221Z', .7)
    result += wash('M190 220 C213 240 200 256 184 272 C172 293 180 322 190 337 C174 321 161 295 171 274 C181 254 196 244 190 230Z', .7)
    result += light('M158 226 C176 239 174 255 161 272 C148 291 152 318 166 347 C146 329 140 306 147 285 C154 264 161 248 158 226Z', .68)
    result += glow('M135 213 Q155 224 175 215 M140 232 C147 249 126 266 129 293 Q132 319 144 337 M191 232 C194 250 178 262 179 281 Q177 308 192 331', 1.6, .50)
    result += crease('M104 237 C102 266 120 287 118 312 M219 244 C220 273 200 284 202 311', .9, .27)
    result += head(160, 114, 1.13, -4)
    return result + '</g>'


def composition(cid):
    return {'013-aurore': aurore, '013-onde': onde, '013-brise': brise}[cid]()


def gradients():
    return '''<linearGradient id="surface" gradientUnits="userSpaceOnUse" x1="85" y1="120" x2="238" y2="145"><stop stop-color="#c3cbbf"/><stop offset=".26" stop-color="#f2efdf"/><stop offset=".52" stop-color="#e4e7d8"/><stop offset=".77" stop-color="#cfd8c8"/><stop offset="1" stop-color="#adbeac"/></linearGradient>
<linearGradient id="clair-sculpte" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="#fffbe9" stop-opacity="0"/><stop offset=".24" stop-color="#fffbe9" stop-opacity=".68"/><stop offset=".57" stop-color="#f4f3de" stop-opacity=".55"/><stop offset="1" stop-color="#f4f3de" stop-opacity="0"/></linearGradient>
<filter id="fondu-large" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.55"/></filter>'''
