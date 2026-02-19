/* eslint-disable no-console */
import { beforeAll, describe, expect, test } from 'vitest'
import { getLineGraph, getStackedAreaGraph } from '../src/graphing'
import { faker } from '@faker-js/faker'

const BLACK = '#000000'

const arrayRange = (start: number, stop: number, step = 1): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  )

beforeAll(() => {
  faker.seed(123)
  faker.setDefaultRefDate(new Date('2024-01-01T00:00:00.000Z'))
})

describe('getLineGraph', () => {
  test('getLineGraph should return a graph response', async () => {
    const axisColor = BLACK

    const startingTimestamp = faker.date.recent().getTime()

    const networkReadX = arrayRange(1, 19).map(n => ({
      x: n * 1000 + startingTimestamp,
      y: faker.number.int({ min: 1, max: 100 })
    }))

    const result = await getLineGraph({
      label: 'Network I/O Read (MB)',
      axisColor,
      line: {
        label: 'Read',
        color: '#be4d25',
        points: networkReadX
      }
    })

    expect(result.length).toBeGreaterThan(100) // Not empty
    expect(result.length).toBeLessThan(65000) // 65k

    expect(result).toMatchInlineSnapshot(`
      "\`\`\`mermaid
      ---
      config:
        xyChart:
          width: 1200
          height: 400
          xAxis:
            labelFontSize: 10
            showLabel: false
            showTick: true
        themeVariables:
          xyChart:
            plotColorPalette: '#be4d25'
      ---
      xychart
        x-axis "Time" ["02:42:55", "02:42:56", "02:42:57", "02:42:58", "02:42:59", "02:43:00", "02:43:01", "02:43:02", "02:43:03", "02:43:04", "02:43:05", "02:43:06", "02:43:07", "02:43:08", "02:43:09", "02:43:10", "02:43:11", "02:43:12", "02:43:13"]
        y-axis "Network I/O Read (MB)"
        line [29, 23, 56, 72, 43, 99, 69, 49, 40, 35, 73, 44, 6, 40, 74, 19, 18, 54, 54]
      \`\`\`"
    `)
  })
})

describe('getStackedAreaGraph', () => {
  test('getStackedAreaGraph should return a graph response', async () => {
    const axisColor = BLACK

    const startingTimestamp = faker.date.recent().getTime()

    const userLoadX = arrayRange(1, 19).map(n => ({
      x: n * 1000 + startingTimestamp,
      y: faker.number.int({ min: 1, max: 100 })
    }))

    const systemLoadX = arrayRange(1, 19).map(n => ({
      x: n * 1000 + startingTimestamp,
      y: faker.number.int({ min: 1, max: 100 })
    }))

    const result = await getStackedAreaGraph({
      label: 'CPU Load (%)',
      axisColor,
      areas: [
        {
          label: 'User Load',
          color: '#e41a1c99',
          points: userLoadX
        },
        {
          label: 'System Load',
          color: '#ff7f0099',
          points: systemLoadX
        }
      ]
    })

    expect(result.length).toBeGreaterThan(100) // Not empty
    expect(result.length).toBeLessThan(65000) // 65k

    expect(result).toMatchInlineSnapshot(`
      "\`\`\`mermaid
      ---
      config:
        xyChart:
          width: 1200
          height: 400
          xAxis:
            labelFontSize: 10
            showLabel: false
            showTick: true
        themeVariables:
          xyChart:
            plotColorPalette: '#e41a1c99, #ff7f0099'
      ---
      xychart
        x-axis "Time" ["01:13:32", "01:13:33", "01:13:34", "01:13:35", "01:13:36", "01:13:37", "01:13:38", "01:13:39", "01:13:40", "01:13:41", "01:13:42", "01:13:43", "01:13:44", "01:13:45", "01:13:46", "01:13:47", "01:13:48", "01:13:49", "01:13:50"]
        y-axis "CPU Load (%)"
        line [85, 73, 62, 73, 33, 37, 23, 30, 64, 10, 44, 44, 50, 43, 32, 43, 90, 95, 51]
        line [63, 12, 32, 42, 87, 26, 49, 99, 52, 62, 13, 83, 61, 55, 35, 31, 42, 69, 88]
      \`\`\`
      ![User Load](https://placehold.co/14x14/e41a1c/e41a1c) **User Load**
      ![System Load](https://placehold.co/14x14/ff7f00/ff7f00) **System Load**"
    `)
  })
})
