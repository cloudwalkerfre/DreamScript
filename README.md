### A movie script writing tool
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
      {
        titlePage:
        {
          Title: 'LA LA LAND',
          By-line: 'Damien Chazelle'
        },
        Paragraph: [
          ...
          {$Type: 'General'},
          {$Type: 'Action', _ :
            'Mia gathers her nerves. Gets up. And steps in.'
          },
          ...
          {$Type: 'Scene Heading' , _ :
          {
            Location: 'INI. AUDITION OFFICE',
            Time: 'AFTERNOON'
          },
          ...
          {$Type: 'Shot', _ :
            'WE RETURN to the AUDITION ROOM... Brandt and Frank waiting...'
          },
          ...
          },
          {$Type: 'Character', _ :  
            'MIA'
          },
          {$Type: 'Dialogue', _ :
            "
              Here's to the ones who dream, Foolish as they may seem. Here's to the hearts that ache. Here's to the mess we make...
            "
          },
          ...
        ]
      }
    }
