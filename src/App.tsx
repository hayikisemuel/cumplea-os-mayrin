import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

type Action = 'food' | 'water' | 'play'

function KittyModel({ action }: { action: Action | null }) {
  const model = useLoader(FBXLoader, `${import.meta.env.BASE_URL}models/kitty.fbx`)
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    model.scale.setScalar(0.009)
    model.position.set(0, -1.28, 0)
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [model])

  useFrame((state) => {
    if (!group.current) return
    const time = state.clock.elapsedTime
    const targetTilt = action ? Math.sin(time * 8) * 0.07 : Math.sin(time * 1.5) * 0.018
    const targetTurn = action === 'play' ? Math.sin(time * 7) * 0.18 : Math.sin(time * 0.8) * 0.035
    const bounce = action ? Math.abs(Math.sin(time * 5)) * (action === 'play' ? 0.13 : 0.07) : Math.sin(time * 1.5) * 0.018
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetTilt, 0.1)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetTurn, 0.1)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, action ? Math.sin(time * 5) * 0.025 : Math.sin(time * 1.2) * 0.01, 0.1)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, bounce, 0.1)
  })

  return <group ref={group}><primitive object={model} /></group>
}

function Bowl({ type, active }: { type: Action; active: boolean }) {
  const color = type === 'food' ? '#f27a67' : '#63b9d8'
  return (
    <group position={type === 'food' ? [-1.55, -1.45, 0.4] : [1.55, -1.45, 0.4]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[0.62, 0.48, 0.25, 32]} /><meshStandardMaterial color={color} roughness={0.3} /></mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.46, 0.46, 0.025, 32]} /><meshStandardMaterial color={type === 'food' ? '#f7b15c' : '#b7edf7'} roughness={0.2} /></mesh>
      {active && <pointLight color={color} intensity={2} distance={2.5} />}
    </group>
  )
}

function Scene({ action }: { action: Action | null }) {
  return (
    <Canvas shadows camera={{ position: [0, 0.4, 6.5], fov: 32 }}>
      <color attach="background" args={['#f8efe8']} />
      <ambientLight intensity={1.05} /><directionalLight castShadow position={[3, 5, 4]} intensity={1.55} shadow-mapSize={[1024, 1024]} /><Environment preset="studio" environmentIntensity={0.45} />
      <KittyModel action={action} /><Bowl type="food" active={action === 'food'} /><Bowl type="water" active={action === 'water'} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} receiveShadow><circleGeometry args={[4.4, 64]} /><meshStandardMaterial color="#f4d8c7" roughness={0.9} /></mesh>
      <ContactShadows position={[0, -1.7, 0]} opacity={0.25} scale={5} blur={2.5} /><OrbitControls enablePan={false} minDistance={4.5} maxDistance={8} target={[0, -0.6, 0]} />
    </Canvas>
  )
}

function App() {
  const [hunger, setHunger] = useState(72)
  const [thirst, setThirst] = useState(64)
  const [happiness, setHappiness] = useState(82)
  const [action, setAction] = useState<Action | null>(null)
  const [message, setMessage] = useState('Kitty está esperando un mimo')
  const [birthdayOpen, setBirthdayOpen] = useState(false)
  const music = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHunger((value) => Math.max(0, value - 1))
      setThirst((value) => Math.max(0, value - 1))
      setHappiness((value) => Math.max(0, value - 1))
    }, 12000)
    return () => window.clearInterval(timer)
  }, [])

  const feed = (type: Action) => {
    if (action) return
    setAction(type)
    if (type === 'food') { setHunger((value) => Math.min(100, value + 18)); setHappiness((value) => Math.min(100, value + 4)); setMessage('Ñam ñam... ¡qué rico!') }
    else { setThirst((value) => Math.min(100, value + 20)); setHappiness((value) => Math.min(100, value + 4)); setMessage('Glup glup... ¡fresquita!') }
    window.setTimeout(() => setAction(null), 1200)
  }

  const play = () => {
    if (action) return
    setAction('play')
    setHappiness((value) => Math.min(100, value + 12))
    setMessage('¡Qué divertido jugar contigo!')
    window.setTimeout(() => setAction(null), 1200)
  }

  const mood = happiness > 70 ? 'Feliz' : happiness > 35 ? 'Tranquila' : 'Necesita cariño'

  const openBirthdayCard = () => {
    setBirthdayOpen(true)
    setMessage('¡Feliz cumpleaños, Mayrin!')
    music.current?.play().catch(() => undefined)
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">♡</span><span>My Little Kitty</span></div><div className="top-actions"><button className="letter-button" type="button" onClick={openBirthdayCard} aria-label="Abrir carta de cumpleaños"><span>✉</span><small>Carta</small></button></div></header>
      <section className="content-grid">
        <div className="intro"><p className="eyebrow">HOGAR DE KITTY</p><h1>Poukitty</h1><p className="welcome">Cuida de tu compañera, mantén sus medidores llenos y descubre cómo cambia su ánimo.</p><div className="status-note"><span className="spark">✦</span><span>{message}</span></div></div>
        <div className="scene-wrap"><Scene action={action} /><span className="drag-hint">↔ Arrastra para mirar</span></div>
        <aside className="care-panel"><div className="panel-heading"><div><p className="eyebrow">CUIDADOS DE HOY</p><h2>¿Qué necesita?</h2></div><span className="mood">♡</span></div><div className="mood-line"><span>Estado de ánimo</span><strong>{mood}</strong></div><Status label="Hambre" value={hunger} tone="coral" icon="◒" /><Status label="Sed" value={thirst} tone="blue" icon="◌" /><Status label="Diversión" value={happiness} tone="gold" icon="✦" /><div className="actions"><button className="care-button food" type="button" onClick={() => feed('food')} disabled={action !== null}><span className="button-icon">🍓</span><span><strong>Dar comida</strong><small>Un bocado rico</small></span><span className="arrow">→</span></button><button className="care-button water" type="button" onClick={() => feed('water')} disabled={action !== null}><span className="button-icon">💧</span><span><strong>Dar agua</strong><small>Un sorbito fresco</small></span><span className="arrow">→</span></button><button className="care-button play" type="button" onClick={play} disabled={action !== null}><span className="button-icon">✦</span><span><strong>Jugar</strong><small>Un ratito juntos</small></span><span className="arrow">→</span></button></div></aside>
      </section>
      <footer><span>♡</span> Kitty se siente querida <span className="footer-right">Cuidar es compartir</span></footer>
      <audio ref={music} src={`${import.meta.env.BASE_URL}music/feliz-cumpleanos.mp3`} loop preload="auto" />
      {birthdayOpen && <div className="birthday-backdrop" role="presentation" onClick={() => setBirthdayOpen(false)}><section className="birthday-card" role="dialog" aria-modal="true" aria-labelledby="birthday-title" onClick={(event) => event.stopPropagation()}><button className="close-card" type="button" onClick={() => setBirthdayOpen(false)} aria-label="Cerrar carta">×</button><div className="card-seal">♡</div><p className="eyebrow">UNA CARTITA PARA TI</p><img className="birthday-photo" src={`${import.meta.env.BASE_URL}images/cumpleanos-mayrin.jpeg`} alt="Recuerdo de cumpleaños en el salón de clases" /><h2 id="birthday-title">¡Feliz cumpleaños<br /><em>Mayrin!</em></h2><p>Que tu día esté lleno de alegría, abrazos y momentos bonitos.</p><div className="cake">🎂</div><small>Con cariño, Rafa Era</small></section></div>}
    </main>
  )
}

function Status({ label, value, tone, icon }: { label: string; value: number; tone: string; icon: string }) { return <div className="status-row"><div className="status-label"><span className={`status-icon ${tone}`}>{icon}</span><strong>{label}</strong><span className="status-value">{value}%</span></div><div className="meter"><span className={tone} style={{ width: `${value}%` }} /></div></div> }

export default App
