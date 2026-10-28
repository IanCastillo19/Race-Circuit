import * as THREE from 'three';

function modeloProvisional(diametro) {
  const grupo=new THREE.Group();
  const aro=new THREE.Mesh(new THREE.TorusGeometry(diametro*.44,diametro*.055,12,40),new THREE.MeshBasicMaterial({color:0x00ddec}));
  aro.rotation.x=-Math.PI/2;aro.position.y=.12;grupo.add(aro);
  const centro=new THREE.Mesh(new THREE.CylinderGeometry(diametro*.4,diametro*.4,.08,40),new THREE.MeshBasicMaterial({color:0x123454}));
  centro.position.y=.05;grupo.add(centro);
  grupo.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,.16,diametro*.2),diametro*.5,0xffe336,diametro*.2,diametro*.15));
  return grupo;
}

export async function crearZonasNitro(loader, circuito, detector, escena, config) {
  const avisos=[];
  let modelo=null;
  try {
    const gltf=await loader.loadAsync(config.modelo);
    const contenedor=new THREE.Group();contenedor.add(gltf.scene);
    contenedor.rotation.set(...config.giroModeloGrados.map(g=>g*Math.PI/180));
    contenedor.updateWorldMatrix(true,true);
    let caja=new THREE.Box3().setFromObject(contenedor,true);
    if(caja.isEmpty())throw new Error('El modelo no tiene geometría.');
    const tamaño=caja.getSize(new THREE.Vector3());
    const diametro=Math.max(tamaño.x,tamaño.z);
    if(diametro<.001)throw new Error('Comprueba la orientación del modelo.');
    // Un grupo externo conserva el giro al recentrar las piezas juntas.
    const raiz=new THREE.Group();raiz.add(contenedor);
    raiz.scale.setScalar(config.diametroMetros/diametro);
    raiz.updateWorldMatrix(true,true);
    caja=new THREE.Box3().setFromObject(raiz,true);
    const altura=caja.getSize(new THREE.Vector3()).y;
    if(altura>config.alturaMaximaMetros) {
      raiz.scale.y*=config.alturaMaximaMetros/altura;
      raiz.updateWorldMatrix(true,true);caja.setFromObject(raiz,true);
    }
    const centro=caja.getCenter(new THREE.Vector3());
    const centrado=new THREE.Group();centrado.add(raiz);
    raiz.position.sub(new THREE.Vector3(centro.x,caja.min.y,centro.z));
    modelo=centrado;
  } catch(error) {
    avisos.push(`Nitro: no se pudo cargar ${config.modelo}. Se muestran plataformas provisionales. Revisa la ruta en nitro.js. ${error.message}`);
    modelo=modeloProvisional(config.diametroMetros);
  }
  const zonas=[],grupos=[];
  circuito.updateWorldMatrix(true,true);
  for(const [indice,p] of config.posiciones.entries()) {
    const centro=circuito.localToWorld(new THREE.Vector3(p.x,0,p.z));
    const y=detector.alturaEn(centro.x,centro.z);
    if(y===null || detector.tipoEn(centro.x,centro.z)!=='asfalto') {
      avisos.push(`Nitro ${indice+1}: la posición no está en asfalto; se omite esta zona.`);continue;
    }
    const rad=p.rumboGrados*Math.PI/180;
    const direccion=new THREE.Vector3(-Math.sin(rad),0,-Math.cos(rad)).transformDirection(circuito.matrixWorld);
    const grupo=new THREE.Group();grupo.name=`Nitro_${indice+1}`;
    grupo.position.set(centro.x,y+.025,centro.z);
    grupo.rotation.y=Math.atan2(-direccion.x,-direccion.z);
    grupo.add(modelo.clone(true));escena.add(grupo);
    grupos.push(grupo);zonas.push({x:centro.x,z:centro.z,radio:config.diametroMetros/2});
  }
  return {zonas,avisos,actualizar(nitro){grupos.forEach((g,i)=>{g.visible=nitro.zonas[i].recarga<=0;});}};
}
