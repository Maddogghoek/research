import { Box } from 'theme-ui'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Column, Heading, Row } from '@carbonplan/components'

import { articles, publications, comments, tools } from '../contents/index'
import List from './list'
import Articles from './articles'
import Publications from './publications'
import Tools from './tools'
import Highlights from './highlights'
import Navigation from './navigation'

const sx = {
  heading: {
    mt: [4, 4, 0, 0],
    mb: [3, 3, 4, 5],
    fontSize: [3, 3, 3, 4],
    fontFamily: 'heading',
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
  },
}

const Main = () => {
  const router = useRouter()
  const navRef = useRef(null)
  const sectionRefs = {
    highlights: useRef(null),
    tools: useRef(null),
    articles: useRef(null),
    publications: useRef(null),
    comments: useRef(null),
  }
  const [scrolled, setScrolled] = useState(null)
  const [selected, setSelected] = useState({ id: 'tools', scroll: true })

  const selectSection = (id, scroll = true) => {
    router.push({ pathname: '/research', query: { section: id } }, undefined, {
      scroll: false,
    })
    setSelected({ id, scroll })
  }

  useEffect(() => {
    if (
      router.query.section &&
      selected.id &&
      router.query.section !== selected.id
    ) {
      setSelected({ id: router.query.section, scroll: selected.scroll })
    } else if (selected.scroll && router.query.section) {
      document.querySelector(`#${router.query.section}`).scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [selected, router.query.section])

  useEffect(() => {
    const scrollListener = () => {
      const navBottom = navRef.current?.getBoundingClientRect()?.bottom
      const active =
        Object.keys(sectionRefs)
          .reverse()
          .find((key) => {
            const ref = sectionRefs[key]
            return navBottom > ref.current?.getBoundingClientRect()?.top
          }) || 'highlights'
      setScrolled(active)
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <Box>
      <Heading
        description={
          <span>
            Articles, tools, and commentary on carbon
            <Box
              as='br'
              sx={{ display: ['none', 'initial', 'initial', 'initial'] }}
            />{' '}
            removal and climate solutions.
          </span>
        }
        descriptionStart={[1, 4, 6, 6]}
        descriptionWidth={[6, 5, 5, 5]}
      >
        Research
      </Heading>

      <Row>
        <Column start={[1, 1, 2, 2]} width={[6, 8, 2, 2]}>
          <Navigation
            ref={navRef}
            selected={selected.id}
            scrolled={scrolled}
            selectSection={selectSection}
          />
        </Column>
        <Column start={[1, 1, 5, 5]} width={[6, 8, 7, 7]}>
          <Highlights selected={selected.id === 'highlights'} />
          <List
            label='Tools'
            id='tools'
            selected={selected.id === 'tools'}
            items={tools}
            Entries={Tools}
            width={8}
            limit={6}
            ref={sectionRefs.tools}
          />
          <List
            label='Articles'
            id='articles'
            selected={selected.id === 'articles'}
            items={articles}
            width={8}
            Entries={Articles}
            ref={sectionRefs.articles}
          />
          <List
            label='Publications'
            id='publications'
            selected={selected.id === 'publications'}
            items={publications}
            Entries={Publications}
            ref={sectionRefs.publications}
          />
          <List
            label='Comment letters'
            id='comments'
            selected={selected.id === 'comments'}
            items={comments}
            Entries={Publications}
            ref={sectionRefs.comments}
          />
        </Column>
      </Row>
    </Box>
  )
}

export default Main
