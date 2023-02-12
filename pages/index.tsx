import Head from 'next/head'
import { useRef, useState } from 'react'
type ItemType = {
  id: string | number,
  type: string,
  canNest?: boolean,
  items?: ItemType[],
  props: any
}
const ComponentFromType = ({ type, items, ...props }) => {
  switch(type){
    case 'text': {
      return <pre {...props}/>
    }
    case 'image': {
      return <img {...props}/>
    }
    case 'form': {
      if(items.length){
        delete props.children
        return <form {...props}>{items.map((item) => {
          return <ComponentFromType
            type={item.type}
            items={item.items}
            {...item.props}
          />
        })}</form>
      }
      return <form {...props}/>
    }
    case 'input-text': {
      return <input type="text" {...props}/>
    }
    case 'input-date': {
      return <input type="date" {...props} />
    }
    case 'input-submit': {
      return <input type="submit" {...props}/>
    }
    
    default:
      return <div>type {type} not recognised.</div>
  }
}

const App = ({
  className = ''
}) => {
  const selectedIndex = useRef(0)
  const [tree, setTree] = useState(new Map())
  
  const selectableItems = [
    {
      text: 'text'
    },
    {
      text: 'image'
    },
    {
      text: 'form'
    },
    {
      text: 'input-text'
    },
    {
      text: 'input-date'
    },
    {
      text: 'input-submit'
    }
  ]
  const [selectedItem, setSelectedItem] = useState(selectableItems[0])

  const addItem = (index, item) => {
    setTree(tree => {
      const newTree = new Map(tree)
      const existingItem = newTree.get(index)
      if(existingItem && existingItem.canNest){
        newTree.set(index, {...existingItem, items: [...existingItem.items || [], item]})
        console.log('new tree', newTree)
      } else {
        newTree.set(index, item)
      }
      return newTree
    })
  }
  const createItemFromSelectableItem = (id, selectableItem, index): ItemType => {
    const out = { type: selectableItem.text, id, props: {} } as ItemType
    const onChange = e => {
      const id = out.id
      setTree(tree => {
        const newTree = new Map(tree)
        const item = newTree.get(index)
        console.log('item to update', index, item)
        newTree.set(index, {
          ...item,
          items: item.items?.map((innerItem, index) => {
            if(innerItem.id === id){
              innerItem.props.value = e.target.value
            }
            return innerItem
          })
        })
        return newTree
      })
    }
    switch(out.type){
      case 'text': {
        out.props.children = 'Edit my text'
        break;
      }
      case 'image': {
        out.props.src = 'https://via.placeholder.com/150'
        break;
      }
      case 'form': {
        out.props.children = 'Empty form'
        out.items = []
        out.canNest = true
        break;
      }
      case 'input-text': {
        out.props.value = ''
        out.props.placeholder = 'Enter text here'
        out.props.onChange = onChange
        break;
      }
      case 'input-date': {
        out.props.value = (new Date(Date.now())).toDateString()
        out.props.onChange = onChange
      }
      case 'input-submit': {
        out.props.value = 'Submit'
        break;
      }
      default: {
  
      }
    }
    return out
  }

  return (
    <div
      className={className}
    >
      <div>
        {selectableItems.map(item => {
          return <div key={item.text}><button
            onClick={() => {
              setSelectedItem(item)
            }}
          >Select</button> {item.text} {selectedItem.text === item.text && '- Selected'}</div>
        })}
      </div>
      <div>
        {Array.from(tree, ([index, item]) => {
          console.log('tree item', index, item)
          return (
            <>
              <ComponentFromType
                type={item.type}
                items={item.items}
                {...item.props}
              />
              {item.canNest && <button
                onClick={() => {
                  addItem(index, createItemFromSelectableItem(Math.random(), selectedItem, index))
                }}
              >+ item to form</button>}
            </>
          )
        })}
      </div>
      <button onClick={() => {
        addItem(selectedIndex.current, createItemFromSelectableItem(Math.random(), selectedItem, selectedIndex.current))
        selectedIndex.current ++
      }}>+ item to container</button>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>WYSIWYG</title>
        <meta name="description" content="What you see is what you get." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <App/>
      </main>
    </div>
  )
}
