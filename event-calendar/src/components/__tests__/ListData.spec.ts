import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ListData from '../ListData.vue'

describe('ListData', () => {
  it('renders properly', () => {
    const wrapper = mount(ListData, { props: { } })
    expect(wrapper.text()).toContain('Loading')
  })
})
