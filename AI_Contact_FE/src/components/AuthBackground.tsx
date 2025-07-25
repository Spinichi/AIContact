import Particles from './Particles.tsx';


export default function AuthBackground(){
    return(
        <div style = {{ width : "100vw", height : "100vh"}}>
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={300}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={200}
                moveParticlesOnHover={false}
                alphaParticles={true}
                disableRotation={false}
                cameraDistance={10}
            />
        </div>
    );
}
