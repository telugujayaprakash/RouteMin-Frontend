import { motion, useScroll, useTransform } from 'framer-motion'

function PathAnimationSection () {
  const { scrollY } = useScroll()

  const x = useTransform(scrollY, [800, 1400], [0, 300])
  const y = useTransform(scrollY, [800, 1400], [0, 200])
  const rotate = useTransform(scrollY, [800, 1400], [0, 40])

  return (
    <section className='h-[200vh] relative bg-gray-50'>
      {/* ROAD */}
      <img src='/assets/curved-road.png' className='absolute w-full top-0' />

      {/* TRUCK */}
      <motion.img
        src='/assets/truck-top.png'
        style={{ x, y, rotate }}
        className='absolute w-32 top-20 left-20'
      />
    </section>
  )
}

export default PathAnimationSection
