/* Shader da fumaça de tinta do hero. Usado ao vivo no desktop e por tools/gerar_video.py
   para renderizar o MP4 do celular. `a` é a fase do loop (0 a 2π) e `k` o raio do
   movimento: o quadro em a = 2π é igual ao de a = 0, então o vídeo fecha sem emenda. */
window.TINTA_FS = `precision mediump float;
uniform vec2 r;uniform float a;uniform float k;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,b=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=b*n(p);p=R*p*2.02;b*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r.y; float asp=r.x/r.y;
  vec2 o1=vec2(cos(a),sin(a))*k, o2=vec2(sin(a),cos(a))*k*.85;
  vec2 lp=vec2(asp*(.5+.24*cos(a)),.58+.12*sin(2.*a));
  float luz=smoothstep(.62,0.,length(uv-lp));
  vec2 w=uv*1.35;
  vec2 q=vec2(fbm(w+o1),fbm(w+vec2(5.2,1.3)-o2));
  vec2 s=vec2(fbm(w+3.*q+vec2(1.7,9.2)+o2*.8),fbm(w+3.*q+vec2(8.3,2.8)-o1*.6));
  float f=fbm(w+3.4*s);
  float v=smoothstep(.18,1.05,f*f*1.7+.22*length(q));
  float veia=smoothstep(.035,0.,abs(fbm(uv*2.6+s*2.2)-.5));
  v=v*(.42+.5*luz)+veia*(.06+.16*luz)+luz*.02;
  vec3 col=mix(vec3(.035,.033,.031),vec3(.74,.71,.66),clamp(v*.44,0.,1.));
  vec2 c=gl_FragCoord.xy/r-.5; col*=1.-.55*dot(c*vec2(1.,.85),c*vec2(1.,.85))*2.;
  gl_FragColor=vec4(col,1.);
}`;

/* Liga o shader num canvas. Devolve {desenhar(fase)} ou null se não houver WebGL. */
window.tintaGL = function (tela, opcoes) {
  const gl = tela.getContext('webgl', Object.assign({ antialias: false, powerPreference: 'low-power' }, opcoes || {}));
  if (!gl) return null;
  const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
  const v = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
  const f = sh(gl.FRAGMENT_SHADER, window.TINTA_FS);
  if (!v || !f) return null;
  const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, 'r'), uA = gl.getUniformLocation(pr, 'a'), uK = gl.getUniformLocation(pr, 'k');
  return {
    desenhar(fase, raio) {
      gl.viewport(0, 0, tela.width, tela.height);
      gl.uniform2f(uR, tela.width, tela.height);
      gl.uniform1f(uA, fase);
      gl.uniform1f(uK, raio);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  };
};
