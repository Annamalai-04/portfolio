import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { itemRange } from "../data/constructionSkills";

const CutawayContext = createContext(false);
const clamp = (value) => Math.max(0, Math.min(1, value));
const stone = "#d9d8c8";
const wood = "#c39c77";

function Box({ at = [0, 0, 0], size, color = stone, ghost = false, ...props }) {
  return (
    <mesh position={at} {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        key={ghost ? "cutaway" : "solid"}
        color={ghost ? "#90b7c1" : color}
        roughness={0.7}
        transparent={ghost}
        opacity={ghost ? 0.08 : 1}
        depthWrite={!ghost}
      />
    </mesh>
  );
}
function ShellBox(props) {
  const cutaway = useContext(CutawayContext);
  return <Box {...props} ghost={cutaway} />;
}
function Cylinder({
  at = [0, 0, 0],
  radius = 0.2,
  height = 0.6,
  color = "#88b1ad",
  ...props
}) {
  return (
    <mesh position={at} {...props}>
      <cylinderGeometry args={[radius, radius, height, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
    </mesh>
  );
}
function Pipe({ points, color = "#d6a06d", radius = 0.04 }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p)),
        false,
        "catmullrom",
        0.05,
      ),
    [points],
  );
  return (
    <mesh>
      <tubeGeometry args={[curve, 24, radius, 6, false]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.4} />
    </mesh>
  );
}
function Part({ id, progress, reduced, children }) {
  const ref = useRef();
  const { start, end } = itemRange(id);
  useFrame(() => {
    const amount = clamp((progress.current - start) / (end - start));
    const eased = 1 - Math.pow(1 - amount, 3);
    const rest = reduced ? 0 : 1 - eased;
    ref.current.visible = amount > 0;
    ref.current.position.set(rest * 8, rest * 1.5, 0);
    ref.current.rotation.y = rest * -0.25;
  });
  return (
    <group
      ref={ref}
      name={id}
      userData={{ constructionItem: id }}
      visible={false}
    >
      {children}
    </group>
  );
}
function Plaque({
  text,
  detail = "",
  at,
  size = [1, 0.7],
  color = "#e7e2cd",
  rotation = [0, 0, 0],
}) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 320;
    const ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 320);
    ctx.strokeStyle = "#526b69";
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, 480, 288);
    ctx.fillStyle = "#283e41";
    ctx.textAlign = "center";
    ctx.font = "bold 42px Arial";
    ctx.fillText(text, 256, 125, 450);
    ctx.font = "24px Arial";
    ctx.fillText(detail, 256, 180, 440);
    ctx.fillStyle = "#669989";
    ctx.beginPath();
    ctx.arc(256, 245, 29, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4f0d8";
    ctx.font = "bold 30px Arial";
    ctx.fillText("✓", 256, 256);
    return new THREE.CanvasTexture(c);
  }, [text, detail, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={at} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
function Plant({ at, scale = 1, tree = false }) {
  return (
    <group position={at} scale={scale}>
      {tree ? (
        <Cylinder
          at={[0, 0.65, 0]}
          height={1.3}
          radius={0.09}
          color="#87705b"
        />
      ) : (
        <Cylinder at={[0, 0.2, 0]} height={0.4} radius={0.23} color="#b77b62" />
      )}
      <mesh position={[0, tree ? 1.6 : 0.6, 0]}>
        <icosahedronGeometry args={[tree ? 0.75 : 0.4, 1]} />
        <meshStandardMaterial color="#71956c" />
      </mesh>
      <mesh position={[0.2, tree ? 2.12 : 0.89, 0]}>
        <icosahedronGeometry args={[tree ? 0.55 : 0.28, 1]} />
        <meshStandardMaterial color="#a0b97d" />
      </mesh>
    </group>
  );
}
function Window({ at, upper = false }) {
  return (
    <group position={at}>
      <ShellBox size={[1.2, 1.15, 0.06]} color="#83bdb7" />
      {[-0.64, 0.64].map((x) => (
        <ShellBox
          key={x}
          at={[x, 0, 0.05]}
          size={[0.08, 1.3, 0.12]}
          color="#f3e7ce"
        />
      ))}
      {[-0.62, 0.62].map((y) => (
        <ShellBox
          key={y}
          at={[0, y, 0.05]}
          size={[1.35, 0.08, 0.12]}
          color="#f3e7ce"
        />
      ))}
      <ShellBox size={[0.04, 1.2, 0.15]} color="#e7e4cf" />
      <ShellBox size={[1.25, 0.04, 0.15]} color="#e7e4cf" />
      {!upper && (
        <Box at={[0, -0.73, 0]} size={[1.5, 0.14, 0.32]} color="#9baf9d" />
      )}
    </group>
  );
}
function Shelf({ at, width = 1.1, height = 1.8, color = "#8a9c8a", children }) {
  return (
    <group position={at}>
      {[-width / 2, width / 2].map((x) => (
        <Box
          key={x}
          at={[x, height / 2, 0]}
          size={[0.06, height, 0.5]}
          color={color}
        />
      ))}
      {[0, 0.33, 0.66, 1].map((n) => (
        <Box
          key={n}
          at={[0, 0.08 + n * (height - 0.1), 0]}
          size={[width + 0.07, 0.07, 0.55]}
          color={color}
        />
      ))}
      {children}
    </group>
  );
}
function Person({ at, color, scale = 1 }) {
  return (
    <group position={at} scale={scale}>
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.16, 12, 8]} />
        <meshStandardMaterial color="#ba927b" />
      </mesh>
      <Box at={[0, 0.68, 0]} size={[0.32, 0.45, 0.2]} color={color} />
      {[-0.1, 0.1].map((x) => (
        <Box
          key={x}
          at={[x, 0.25, 0]}
          size={[0.11, 0.45, 0.14]}
          color="#354d5a"
        />
      ))}
      {[-0.23, 0.23].map((x) => (
        <Box
          key={x}
          at={[x, 0.68, 0]}
          size={[0.1, 0.4, 0.12]}
          color={color}
          rotation={[0, 0, x]}
        />
      ))}
    </group>
  );
}
function KeyHandover() {
  return (
    <group position={[1.1, 2, 3.6]} rotation={[-0.35, 0.65, -0.18]}>
      <mesh>
        <torusGeometry args={[0.29, 0.065, 10, 32]} />
        <meshStandardMaterial
          color="#f2ce80"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <Box at={[0, -0.61, 0]} size={[0.12, 0.75, 0.12]} color="#f2ce80" />
      {[-0.61, -0.85].map((y) => (
        <Box
          key={y}
          at={[0.13, y, 0]}
          size={[0.3, 0.1, 0.12]}
          color="#f2ce80"
        />
      ))}
      <mesh position={[0, -1.13, 0.04]} scale={[0.5, 0.11, 0.3]}>
        <sphereGeometry args={[1, 16, 8]} />
        <meshStandardMaterial color="#bd977f" />
      </mesh>
      <Box at={[0.15, -1.28, -0.12]} size={[0.4, 0.22, 0.28]} color="#477b70" />
    </group>
  );
}

function House({ progress, reduced }) {
  const props = { progress, reduced };
  return (
    <group position={[0, -0.4, 0]}>
      <Box at={[0, -0.22, 0]} size={[9.8, 0.3, 7.8]} color="#263d3f" />
      <Box at={[0, -0.02, 0]} size={[7.1, 0.22, 4.8]} color="#a0aa9b" />
      <Box at={[0, 0.12, 0]} size={[6.7, 0.1, 4.4]} color="#c8aa83" />
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((z) => (
        <Box
          key={z}
          at={[0, 0.178, z]}
          size={[6.55, 0.008, 0.014]}
          color="#a1896b"
        />
      ))}

      <Part id="walls" {...props}>
        <Box at={[0, 1.5, -2.12]} size={[6.7, 2.7, 0.14]} />
        <Box at={[-3.3, 1.5, 0]} size={[0.14, 2.7, 4.3]} color="#bdcbb5" />
        <Box at={[3.3, 0.5, 0]} size={[0.14, 0.7, 4.3]} color="#bdcbb5" />
        {[-3.3, -0.7, 0.7, 3.3].map((x) => (
          <Box key={x} at={[x, 1.5, 2.13]} size={[0.16, 2.7, 0.16]} />
        ))}
        {[-2, 2].map((x) => (
          <Box
            key={x}
            at={[x, 0.5, 2.13]}
            size={[2.45, 0.7, 0.14]}
            color="#bdcbb5"
          />
        ))}
        <ShellBox
          at={[-1.7, 2.9, -0.15]}
          size={[3.4, 0.14, 4.1]}
          color="#d9cdb3"
        />
        <ShellBox
          at={[-1.7, 4.02, -2.12]}
          size={[3.4, 2.1, 0.14]}
          color="#c7cfbb"
        />
        <ShellBox
          at={[-3.3, 4.02, -0.15]}
          size={[0.14, 2.1, 4.1]}
          color="#b5c4ad"
        />
        <ShellBox at={[-1.7, 4.9, 1.91]} size={[3.5, 0.4, 0.14]} />
        {[-3.3, -0.1].map((x) => (
          <ShellBox key={x} at={[x, 4.02, 1.91]} size={[0.15, 2.1, 0.15]} />
        ))}
      </Part>
      <Part id="doors" {...props}>
        <group position={[-0.6, 0, 2.2]} rotation={[0, -0.65, 0]}>
          <Box at={[0.57, 1.36, 0]} size={[1.14, 2.35, 0.1]} color="#477f72" />
          <Box
            at={[0.57, 1.7, 0.06]}
            size={[0.84, 0.95, 0.02]}
            color="#7fae9d"
          />
          <Cylinder
            at={[1, 1.18, 0.12]}
            radius={0.06}
            height={0.13}
            color="#e5c580"
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
        <Box at={[0, 0.12, 2.55]} size={[1.6, 0.14, 0.75]} color="#bcb7a2" />
      </Part>
      <Part id="windows" {...props}>
        <Window at={[-2, 1.65, 2.16]} />
        <Window at={[2, 1.65, 2.16]} />
        <Window at={[-1.7, 4.0, 1.97]} upper />
      </Part>
      <Part id="garden" {...props}>
        <Box at={[-3.7, -0.03, 2.5]} size={[1.8, 0.08, 2.3]} color="#608264" />
        <Box at={[3.7, -0.03, 2.5]} size={[1.8, 0.08, 2.3]} color="#608264" />
        <Plant at={[-4, 0, 2.4]} tree />
        <Plant at={[4.1, 0, 2.9]} tree scale={0.8} />
        {[-4.1, -3.5, 3.5, 4.1].map((x) => (
          <Plant key={x} at={[x, 0, 1.25]} scale={0.6} />
        ))}
      </Part>
      <Part id="painting" {...props}>
        <Box
          at={[-1.55, 1.5, -2.02]}
          size={[2.9, 2.45, 0.03]}
          color="#d5ad94"
        />
        <ShellBox
          at={[-3.21, 3.9, -0.2]}
          size={[0.025, 1.9, 3.8]}
          color="#a5b9a8"
        />
        <Cylinder
          at={[-4.1, 0.2, -0.4]}
          radius={0.22}
          height={0.4}
          color="#d4bda0"
        />
        <Cylinder
          at={[-4.1, 0.41, -0.4]}
          radius={0.19}
          height={0.02}
          color="#81a99b"
        />
        <Box
          at={[-3.9, 0.65, -0.35]}
          size={[0.035, 0.8, 0.035]}
          color="#a9b3ac"
          rotation={[0, 0, -0.2]}
        />
        <Cylinder
          at={[-3.82, 1.05, -0.35]}
          radius={0.09}
          height={0.38}
          color="#96b7a0"
          rotation={[0, 0, Math.PI / 2]}
        />
      </Part>
      <Part id="furniture" {...props}>
        <Box at={[-2.35, 0.53, 0.3]} size={[1.5, 0.45, 1.45]} color="#5b8d87" />
        <Box at={[-2.95, 0.94, 0.3]} size={[0.25, 0.65, 1.5]} color="#699c94" />
        {[-0.38, 0.98].map((z) => (
          <Box
            key={z}
            at={[-2.35, 0.82, z]}
            size={[1.5, 0.32, 0.16]}
            color="#72a49b"
          />
        ))}
        <Box at={[-1.2, 0.42, 0.4]} size={[0.7, 0.08, 0.95]} color={wood} />
        <Box at={[-1.2, 0.27, 0.4]} size={[0.3, 0.3, 0.45]} color="#708b80" />
        <Box at={[0.3, 0.8, -1.2]} size={[1.6, 0.1, 0.75]} color={wood} />
        {[-0.3, 0.9].map((x) => (
          <Box
            key={x}
            at={[x, 0.48, -1.2]}
            size={[0.1, 0.6, 0.6]}
            color="#8d9c8a"
          />
        ))}
      </Part>
      <Part id="staircase" {...props}>
        {Array.from({ length: 11 }, (_, i) => (
          <Box
            key={i}
            at={[2.5, 0.3 + i * 0.24, 1.65 - i * 0.33]}
            size={[1.15, 0.2, 0.36]}
            color="#c3baa1"
          />
        ))}
        <Pipe
          points={[
            [3.13, 1.1, 1.85],
            [3.13, 3.65, -1.65],
          ]}
          color="#87a29a"
          radius={0.035}
        />
        {[0, 3, 6, 9].map((i) => (
          <Box
            key={i}
            at={[3.12, 0.75 + i * 0.24, 1.65 - i * 0.33]}
            size={[0.04, 0.95, 0.04]}
            color="#87a29a"
          />
        ))}
      </Part>
      <Part id="roof" {...props}>
        <ShellBox
          at={[-2.57, 5.2, -0.15]}
          size={[1.95, 0.16, 4.5]}
          color="#b68167"
          rotation={[0, 0, 0.27]}
        />
        <ShellBox
          at={[-0.84, 5.2, -0.15]}
          size={[1.95, 0.16, 4.5]}
          color="#c39673"
          rotation={[0, 0, -0.27]}
        />
        <ShellBox
          at={[-1.7, 5.46, -0.15]}
          size={[0.12, 0.1, 4.6]}
          color="#dec8a4"
        />
        <ShellBox
          at={[1.68, 2.94, -0.3]}
          size={[3.4, 0.14, 3.8]}
          color="#b28d72"
        />
        {[-1.9, -1.2, -0.5, 0.2, 0.9, 1.6].map((z) => (
          <ShellBox
            key={z}
            at={[-0.82, 5.3, z]}
            size={[1.8, 0.03, 0.03]}
            color="#dfbd99"
            rotation={[0, 0, -0.27]}
          />
        ))}
      </Part>
      <Part id="balcony" {...props}>
        <ShellBox
          at={[-1.65, 2.91, 2.2]}
          size={[3.65, 0.15, 1.1]}
          color="#d7c7aa"
        />
        <Box
          at={[-1.65, 3.86, 2.71]}
          size={[3.65, 0.06, 0.06]}
          color="#83a39b"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <Box
            key={i}
            at={[-3.4 + i * 0.39, 3.4, 2.71]}
            size={[0.04, 0.92, 0.04]}
            color="#83a39b"
          />
        ))}
        <Box at={[-1.65, 4.02, 1.98]} size={[0.8, 1.9, 0.06]} color="#699b8c" />
      </Part>
      <Part id="decorations" {...props}>
        <Plant at={[-3.0, 3, 2.25]} scale={0.65} />
        <Plant at={[-0.35, 3, 2.25]} scale={0.55} />
        <Plaque
          text="HOME"
          detail="Made with care"
          at={[-1.2, 1.8, -1.98]}
          size={[0.8, 0.6]}
        />
        <Box at={[-1.3, 0.2, 1.2]} size={[1.55, 0.03, 0.65]} color="#d6b18b" />
        <Cylinder
          at={[-1.2, 0.56, 0.4]}
          radius={0.1}
          height={0.2}
          color="#c0d3b2"
        />
      </Part>

      <Part id="wiring" {...props}>
        <Pipe
          points={[
            [-2.8, 0.4, -1.94],
            [-2.8, 2.45, -1.94],
            [2.7, 2.45, -1.94],
            [2.7, 1, -1.94],
          ]}
          color="#edb073"
        />
        <Pipe
          points={[
            [-2.8, 2.4, -1.9],
            [-2.8, 4.4, -1.9],
            [-0.5, 4.4, -1.9],
          ]}
          color="#edb073"
        />
        <Pipe
          points={[
            [-2.8, 1.1, -1.9],
            [-3.15, 1.1, -1.9],
            [-3.15, 1.1, 1.1],
          ]}
          color="#e7c88a"
        />
        <Box at={[-3.13, 1.1, 1.1]} size={[0.18, 0.23, 0.14]} color="#f3e6c5" />
      </Part>
      <Part id="water-pipes" {...props}>
        <Pipe
          points={[
            [4, 0.5, -0.2],
            [3.1, 0.5, -0.2],
            [3.1, 0.5, -1.83],
            [-0.2, 0.5, -1.83],
            [-0.2, 1, -1.83],
          ]}
          color="#6eb4ce"
          radius={0.055}
        />
        <Pipe
          points={[
            [3.1, 0.5, -1.83],
            [3.1, 2.7, -1.83],
            [-0.4, 2.7, -1.83],
          ]}
          color="#81c9d5"
          radius={0.045}
        />
      </Part>
      <Part id="drainage" {...props}>
        <Pipe
          points={[
            [0.3, 0.1, -1.6],
            [0.3, -0.04, 0],
            [3.7, -0.04, 0],
            [3.7, -0.04, 2.7],
          ]}
          color="#708a88"
          radius={0.095}
        />
        <Cylinder
          at={[3.7, 0.02, 2.7]}
          radius={0.28}
          height={0.1}
          color="#526c70"
        />
      </Part>
      <Part id="pump" {...props}>
        <Cylinder
          at={[3.95, 0.36, -0.2]}
          radius={0.23}
          height={0.65}
          color="#4c92a5"
          rotation={[0, 0, Math.PI / 2]}
        />
        <Box
          at={[3.95, 0.16, -0.2]}
          size={[0.85, 0.14, 0.55]}
          color="#7f9690"
        />
        <Cylinder
          at={[4.26, 0.36, -0.2]}
          radius={0.26}
          height={0.05}
          color="#87b2b7"
          rotation={[0, 0, Math.PI / 2]}
        />
      </Part>
      <Part id="distribution-board" {...props}>
        <Box
          at={[-2.65, 1.55, -1.94]}
          size={[0.7, 0.9, 0.14]}
          color="#4f6970"
        />
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            at={[-2.65, 1.27 + i * 0.18, -1.83]}
            size={[0.44, 0.08, 0.08]}
            color="#e2cc90"
          />
        ))}
      </Part>
      <Part id="gas-pipes" {...props}>
        <Pipe
          points={[
            [-0.3, 0.45, -1.8],
            [-0.8, 0.45, -1.8],
            [-0.8, 0.95, -1.8],
            [0.4, 0.95, -1.8],
          ]}
          color="#d7b257"
          radius={0.035}
        />
        <Box at={[0.55, 0.95, -1.7]} size={[0.6, 0.09, 0.45]} color="#485861" />
        {[-0.16, 0.16].map((x) => (
          <Cylinder
            key={x}
            at={[0.55 + x, 1.02, -1.7]}
            radius={0.1}
            height={0.04}
            color="#9d9d83"
          />
        ))}
      </Part>
      <Part id="ventilation" {...props}>
        <Box at={[0.6, 2.55, -1.7]} size={[3.8, 0.3, 0.35]} color="#91a8ac" />
        <Box at={[2.3, 2.55, -0.7]} size={[0.35, 0.3, 2]} color="#91a8ac" />
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            at={[0.5 + i * 0.11, 2.38, -1.7]}
            size={[0.035, 0.02, 0.26]}
            color="#405a65"
          />
        ))}
      </Part>
      <Part id="air-conditioning" {...props}>
        <Box at={[3.75, 0.65, 1.3]} size={[0.5, 0.9, 1]} color="#dbe3d6" />
        <Cylinder
          at={[4.02, 0.65, 1.3]}
          radius={0.32}
          height={0.035}
          color="#57777d"
          rotation={[0, 0, Math.PI / 2]}
        />
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((r) => (
          <Box
            key={r}
            at={[4.05, 0.65, 1.3]}
            size={[0.025, 0.08, 0.55]}
            color="#afc3bb"
            rotation={[r, 0, 0]}
          />
        ))}
        <Box at={[1, 2.13, -1.91]} size={[1.25, 0.34, 0.28]} color="#e0e5d8" />
        <Box at={[1, 2.02, -1.75]} size={[1, 0.05, 0.03]} color="#587980" />
      </Part>
      <Part id="elevator" {...props}>
        {[-3.0, -2.2].map((x) => (
          <Box
            key={x}
            at={[x, 2.25, -1.6]}
            size={[0.07, 4.15, 0.08]}
            color="#849b9a"
          />
        ))}
        <Box at={[-2.6, 1.75, -1.5]} size={[0.8, 1.5, 0.65]} color="#8dafb5" />
        <Box
          at={[-2.6, 1.75, -1.13]}
          size={[0.65, 1.25, 0.025]}
          color="#b0d7d3"
        />
        <Cylinder
          at={[-2.6, 4.44, -1.6]}
          radius={0.22}
          height={0.45}
          color="#728b91"
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Pipe
          points={[
            [-2.6, 2.5, -1.3],
            [-2.6, 4.45, -1.3],
          ]}
          color="#e3c183"
          radius={0.02}
        />
      </Part>
      <Part id="alarm" {...props}>
        <Box at={[0.95, 2.34, 2.24]} size={[0.24, 0.3, 0.11]} color="#e8ddd0" />
        <Cylinder
          at={[0.95, 2.38, 2.32]}
          radius={0.07}
          height={0.05}
          color="#c87860"
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Box
          at={[3.2, 2.55, 2.15]}
          size={[0.35, 0.14, 0.2]}
          color="#c5d8cc"
          rotation={[0, -0.4, 0]}
        />
        <Cylinder
          at={[3.2, 2.55, 2.27]}
          radius={0.055}
          height={0.03}
          color="#3d5c68"
          rotation={[Math.PI / 2, 0, 0]}
        />
      </Part>

      <Part id="water-tank" {...props}>
        {[
          [-0.35, -0.35],
          [0.35, -0.35],
          [-0.35, 0.35],
          [0.35, 0.35],
        ].map(([x, z], i) => (
          <Box
            key={i}
            at={[3.9 + x, 1.95, -2.65 + z]}
            size={[0.08, 3.9, 0.08]}
            color="#6e9296"
          />
        ))}
        <Cylinder
          at={[3.9, 4.3, -2.65]}
          radius={0.58}
          height={1.05}
          color="#81b9bf"
        />
        {[3.88, 4.28, 4.69].map((y) => (
          <mesh
            key={y}
            position={[3.9, y, -2.65]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.59, 0.025, 5, 24]} />
            <meshStandardMaterial color="#b5d8cb" />
          </mesh>
        ))}
        <Cylinder
          at={[3.9, 4.87, -2.65]}
          radius={0.6}
          height={0.08}
          color="#c0d7cb"
        />
        <Pipe
          points={[
            [3.9, 3.8, -2.65],
            [4.12, 3.8, -2.65],
            [4.12, 0.5, -2.65],
            [4.12, 0.5, -0.2],
          ]}
          color="#83c7d4"
          radius={0.055}
        />
      </Part>
      <Part id="gas-cylinder" {...props}>
        <Cylinder
          at={[-0.45, 0.58, -1.65]}
          radius={0.23}
          height={0.8}
          color="#b86b55"
        />
        <Cylinder
          at={[-0.45, 1.02, -1.65]}
          radius={0.09}
          height={0.12}
          color="#d7b473"
        />
        <Box
          at={[-0.45, 1.12, -1.65]}
          size={[0.23, 0.04, 0.04]}
          color="#d8c9a4"
        />
      </Part>
      <Part id="storage-room" {...props}>
        <group position={[0, 2.8, 0.2]}>
          <Box at={[-2.8, 0.65, 0.9]} size={[0.1, 0.95, 1.5]} color="#b9bca0" />
          <Shelf at={[-2.65, 0.2, 0.3]} width={0.9} height={1.7}>
            {[0.5, 1.05, 1.6].map((y, i) => (
              <Box
                key={i}
                at={[0, y, 0]}
                size={[0.66, 0.4, 0.43]}
                color={i % 2 ? "#c49b71" : "#8bad9d"}
              />
            ))}
          </Shelf>
          <Plaque text="STORE" at={[-2.74, 1.22, 1.66]} size={[0.6, 0.3]} />
        </group>
      </Part>
      <Part id="wardrobe" {...props}>
        <Box at={[-2.6, 3.86, -0.5]} size={[1.05, 1.7, 0.6]} color="#aa9479" />
        {[-0.26, 0.26].map((x) => (
          <Box
            key={x}
            at={[-2.6 + x, 3.86, -0.18]}
            size={[0.49, 1.6, 0.03]}
            color="#c1b49a"
          />
        ))}
        {[-0.06, 0.06].map((x) => (
          <Box
            key={x}
            at={[-2.6 + x, 3.82, -0.14]}
            size={[0.03, 0.22, 0.03]}
            color="#627d76"
          />
        ))}
      </Part>
      <Part id="kitchen-containers" {...props}>
        <Box at={[0.4, 0.63, -1.4]} size={[1.55, 0.9, 0.65]} color="#8da89b" />
        <Box at={[0.4, 1.12, -1.4]} size={[1.7, 0.1, 0.8]} color="#d7c9a6" />
        {[-0.15, 0.25, 0.65].map((x, i) => (
          <group key={x}>
            <Cylinder
              at={[x, 1.38, -1.36]}
              radius={0.14}
              height={0.4}
              color={["#d0c299", "#bca480", "#c7d5b1"][i]}
            />
            <Cylinder
              at={[x, 1.6, -1.36]}
              radius={0.15}
              height={0.04}
              color="#657d73"
            />
          </group>
        ))}
      </Part>
      <Part id="refrigerator" {...props}>
        <Box at={[1.6, 1.12, -1.53]} size={[0.8, 1.9, 0.7]} color="#bdccc1" />
        <Box
          at={[1.6, 1.46, -1.15]}
          size={[0.72, 1.1, 0.035]}
          color="#dce2d4"
        />
        <Box
          at={[1.6, 0.54, -1.15]}
          size={[0.72, 0.65, 0.035]}
          color="#dce2d4"
        />
        {[0.58, 1.42].map((y) => (
          <Box
            key={y}
            at={[1.3, y, -1.11]}
            size={[0.04, 0.3, 0.05]}
            color="#718e89"
          />
        ))}
      </Part>
      <Part id="document-cupboard" {...props}>
        <Shelf
          at={[-1.15, 2.99, -1.75]}
          width={0.95}
          height={1.6}
          color="#b0b79c"
        >
          {[0.4, 0.95, 1.4].map((y) => (
            <group key={y}>
              {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
                <Box
                  key={x}
                  at={[x, y, 0]}
                  size={[0.12, 0.3, 0.38]}
                  color={["#d0b88a", "#89afa7", "#b88c79", "#b2c399"][i]}
                />
              ))}
            </group>
          ))}
        </Shelf>
      </Part>
      <Part id="tool-cabinet" {...props}>
        <Box at={[3.83, 0.65, 0.3]} size={[0.65, 0.95, 0.65]} color="#a66d56" />
        {[0.35, 0.65, 0.95].map((y) => (
          <group key={y}>
            <Box
              at={[3.83, y, 0.65]}
              size={[0.58, 0.24, 0.04]}
              color="#bd8a6a"
            />
            <Box
              at={[3.83, y, 0.68]}
              size={[0.28, 0.03, 0.03]}
              color="#d4c399"
            />
          </group>
        ))}
        <Box at={[3.83, 1.48, 0.3]} size={[0.65, 0.65, 0.06]} color="#8ba091" />
        <Box
          at={[3.65, 1.5, 0.36]}
          size={[0.035, 0.4, 0.035]}
          color="#c9af7f"
          rotation={[0, 0, -0.3]}
        />
        <Box at={[3.59, 1.7, 0.36]} size={[0.22, 0.09, 0.08]} color="#d1d3bd" />
        <Box
          at={[3.98, 1.51, 0.36]}
          size={[0.055, 0.4, 0.04]}
          color="#c1c6b4"
          rotation={[0, 0, 0.2]}
        />
      </Part>
      <Part id="bookshelf" {...props}>
        <Shelf at={[-1.6, 0.2, -1.8]} width={1.2} height={1.8}>
          {[0.45, 1.05, 1.6].map((y) => (
            <group key={y}>
              {[-0.46, -0.27, -0.08, 0.11, 0.3, 0.48].map((x, i) => (
                <Box
                  key={x}
                  at={[x, y, 0.04]}
                  size={[0.12, 0.35 + (i % 2) * 0.06, 0.35]}
                  color={
                    [
                      "#a87863",
                      "#d1bd88",
                      "#739d99",
                      "#acb481",
                      "#8a9db3",
                      "#c29b77",
                    ][i]
                  }
                  rotation={[0, 0, i === 4 ? -0.12 : 0]}
                />
              ))}
            </group>
          ))}
        </Shelf>
      </Part>
      <Part id="digital-storage" {...props}>
        <Box at={[-1.15, 3.67, 0.45]} size={[1.25, 0.08, 0.7]} color={wood} />
        <Box
          at={[-1.15, 3.33, 0.45]}
          size={[0.12, 0.65, 0.55]}
          color="#749388"
        />
        <Box
          at={[-1.15, 4.08, 0.35]}
          size={[0.82, 0.55, 0.05]}
          color="#355c69"
        />
        <Box
          at={[-1.15, 4.08, 0.39]}
          size={[0.72, 0.44, 0.015]}
          color="#8bc4c9"
        />
        <Box
          at={[-1.15, 3.8, 0.35]}
          size={[0.07, 0.22, 0.07]}
          color="#657f7e"
        />
        <Box at={[-0.45, 3.3, 0.2]} size={[0.3, 0.6, 0.5]} color="#486c75" />
        {[3.12, 3.28, 3.44].map((y) => (
          <Box
            key={y}
            at={[-0.45, y, 0.47]}
            size={[0.23, 0.08, 0.025]}
            color="#9bd7c0"
          />
        ))}
      </Part>

      <Part id="ownership" {...props}>
        <Box at={[-2.65, 0.55, 3.2]} size={[2.7, 0.1, 0.8]} color={wood} />
        <Box at={[-2.65, 0.27, 3.2]} size={[0.2, 0.5, 0.55]} color="#82978a" />
        <Plaque
          text="DEED"
          detail="Ownership"
          at={[-3.45, 1, 3.35]}
          size={[0.75, 0.75]}
          rotation={[-0.2, 0.4, 0]}
        />
      </Part>
      <Part id="plan-approval" {...props}>
        <Plaque
          text="PLAN"
          detail="Approved"
          at={[-2.6, 1, 3.35]}
          size={[0.75, 0.75]}
          color="#acd0d0"
          rotation={[-0.2, 0.4, 0]}
        />
      </Part>
      <Part id="completion" {...props}>
        <Plaque
          text="COMPLETE"
          detail="Certified"
          at={[-1.7, 1, 3.35]}
          size={[0.8, 0.75]}
          rotation={[-0.2, 0.4, 0]}
        />
      </Part>
      <Part id="keys" {...props}>
        <KeyHandover />
      </Part>
      <Part id="electricity" {...props}>
        <Box at={[-4.25, 1.9, -1.6]} size={[0.11, 3.8, 0.11]} color="#9d9a7f" />
        <Box at={[-4.25, 3.75, -1.6]} size={[0.7, 0.1, 0.12]} color="#aeb29b" />
        <Pipe
          points={[
            [-4.25, 3.8, -1.6],
            [-3.7, 3.2, -0.5],
            [-3.3, 3.8, 0.5],
          ]}
          color="#5d7476"
          radius={0.018}
        />
        <Box at={[-3.4, 1.55, 1.6]} size={[0.1, 0.45, 0.3]} color="#c9d1bc" />
        <Box at={[0.8, 2.62, 2.27]} size={[0.18, 0.18, 0.18]} color="#f5da91" />
        <mesh position={[0.8, 2.62, 2.3]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial
            color="#fff0a8"
            emissive="#ffe496"
            emissiveIntensity={1}
          />
        </mesh>
      </Part>
      <Part id="water-connection" {...props}>
        <Pipe
          points={[
            [4.65, 0.12, -3.6],
            [4.65, 0.12, -0.2],
            [4.1, 0.35, -0.2],
          ]}
          color="#61b8d2"
          radius={0.075}
        />
        <Cylinder
          at={[4.65, 0.18, -2.9]}
          radius={0.13}
          height={0.24}
          color="#8ad5dd"
        />
        <Box
          at={[4.65, 0.33, -2.9]}
          size={[0.35, 0.05, 0.05]}
          color="#d1c68d"
        />
      </Part>
      <Part id="sewage" {...props}>
        <Pipe
          points={[
            [3.7, 0.02, 2.7],
            [3.7, 0.02, 3.45],
            [1.4, 0.02, 3.45],
          ]}
          color="#6f9792"
          radius={0.1}
        />
        <Cylinder
          at={[1.4, 0.04, 3.45]}
          radius={0.32}
          height={0.08}
          color="#809e91"
        />
        <Box at={[1.4, 0.1, 3.45]} size={[0.35, 0.02, 0.04]} color="#c0d0ad" />
      </Part>
      <Part id="house-number" {...props}>
        <Plaque
          text="04"
          detail="FULL STACK HOME"
          at={[0.93, 1.65, 2.24]}
          size={[0.42, 0.5]}
          color="#cbd6bf"
        />
      </Part>
      <Part id="family" {...props}>
        <Person at={[-0.4, 0.15, 2.95]} color="#7b9bba" />
        <Person at={[0.2, 0.15, 3.15]} color="#c49b75" scale={0.95} />
        <Person at={[0.72, 0.15, 2.9]} color="#93b88d" scale={0.65} />
        <Box at={[-0.9, 0.34, 3.02]} size={[0.3, 0.4, 0.25]} color="#b49871" />
      </Part>
      <Part id="occupation" {...props}>
        <Plaque
          text="WELCOME"
          detail="Officially ready for living"
          at={[0, 0.21, 2.68]}
          size={[1.2, 0.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          color="#b8c6a0"
        />
        <Box at={[-4.6, 0.55, 3.3]} size={[0.06, 1.1, 0.06]} color="#8a9e8b" />
        <Box at={[-4.6, 1.14, 3.3]} size={[0.4, 0.25, 0.3]} color="#7c9e8f" />
        <Box at={[0, 0.04, 3.48]} size={[1.1, 0.07, 0.6]} color="#cfc7ac" />
        <Plant at={[3.1, 3.04, 1.1]} scale={0.7} />
      </Part>
    </group>
  );
}

function RenderBridge({ invalidateRef }) {
  const { invalidate, camera, size } = useThree();
  useEffect(() => {
    camera.lookAt(0, 2.25, 0);
    camera.zoom = Math.min(size.width / 12.8, size.height / 9);
    camera.updateProjectionMatrix();
    invalidateRef.current = invalidate;
    invalidate();
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidateRef, invalidate, camera, size.width, size.height]);
  return null;
}
function HouseConstruction({ progress, invalidateRef, reduced, cutaway }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [10, 9, 12], zoom: 55, near: 0.1, far: 80 }}
      dpr={[1, 1.25]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ camera }) => camera.lookAt(0, 2.25, 0)}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 9, 7]} intensity={2.8} color="#fff0d5" />
      <directionalLight
        position={[-5, 4, -2]}
        intensity={1.4}
        color="#b4dedc"
      />
      <CutawayContext.Provider value={cutaway}>
        <House progress={progress} reduced={reduced} />
      </CutawayContext.Provider>
      <RenderBridge invalidateRef={invalidateRef} />
    </Canvas>
  );
}

export default memo(HouseConstruction);
