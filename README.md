### A movie script editing tool
---

*TRY TO:*  
- As simple as possible
- Just writing, no bullshit
- .fdx convert

---

**based-on**:  
`electron` `REACT` `mobx` `nedb`

---

**key component**:  
- **page**: make a standard movie script looking, handling key-map shortcut function, like `cmd+1 => scene`, `cmd+5 => dialogue` and so on ...
- **paragraph**: `General`, `Scene Heading`, `Action`, `Character`, `Parenthetical`, `Dialogue`, `Transition`, `Shot`, `Cast List`
- **title page**
- **tool sider**: open, save, new, convert ...
- **tool script**: collection of `Scene`, `Character`, `Shot` ...

**mobx script**:  

    {script:
      [
        {titlePage: script info},
        {page: [
          ...
          {Paragraph:
            {Scene: [
                {Time: 'AFTERNOON'},
                {Location: 'INI. AUDITION OFFICE'}
            ]}
          },
          {Paragraph: General},
          {Paragraph: Shot},
          {Paragraph: Action},
          ...
          {Paragraph:
            {Character: 'MIA'}
          },
          {Paragraph:
            {Dialogue:
              "
                Here's to the ones who dream, Foolish as they may seem. Here's to the hearts that ache. Here's to the mess we make...
              "
            },
          },
          ...
        ]}
      ]
    }
