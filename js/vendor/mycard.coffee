class @mycard
  @locale = 'zh'
  @types = ['warrior', 'spellcaster', 'fairy', 'fiend', 'zombie', 'machine', 'aqua', 'pyro', 'rock', 'winged_beast', 'plant', 'insect', 'thunder', 'dragon', 'beast', 'beast_warrior', 'dinosaur', 'fish' , 'sea_serpent', 'reptile', 'psychic', 'divine_beast', 'creator_god']
  @_attributes = ['earth', 'water', 'fire', 'wind', 'light', 'dark', 'divine']
  @categories = ['monster', 'spell', 'trap']
  @card_types = [null, null, null, null, 'normal', 'effect', 'fusion', 'ritual', null, 'spirit', 'union', 'gemini','tuner', 'synchro', null, null, 'quick_play', 'continuous', 'equip', 'field', 'counter', 'flip', 'toon', 'xyz']
  @card_types_extra = ['fusion', 'synchro', 'xyz']

  @cards_url: "http://my-card.in/cards"
  @cards_locale_url: "http://my-card.in/cards_#{@locale}"
  @fetch_cards = (query, callback)->
    $.when($.getJSON(@cards_url + '?q=' + JSON.stringify({_id: {$in: query}})), $.getJSON(@cards_locale_url+ '?q=' + JSON.stringify({_id: {$in: query}}))).done (cards, langs)=>
      callback @load_cards(cards[0], langs[0])
  @load_cards = (cards, langs)->
    result = []
    for lang in langs
      for card in cards
        if card._id == lang._id
          result.push @load_card(card, lang)
          break
    result

  @load_card = (card, lang)->
    i=0
    while card.type
      if card.type & 1
        card_type = @card_types[i] if @card_types[i]
        category = @categories[i] if @categories[i]
      card.type >>= 1
      i++

    id: card._id
    alias: card.alias
    name: lang.name
    category: category
    card_type: card_type
    type: (i = 0; (i++ until card.race >> i & 1); @types[i]) if card.race
    attribute: (i = 0; (i++ until card.attribute >> i & 1); @_attributes[i]) if card.attribute
    level: card.level if card.attribute
    atk: card.atk if card.attribute
    def: card.def if card.attribute
    description: lang.desc

  @load_duel_comments = (duel_id, skip=0, limit=0, callback)->
    $.getJSON "https://my-card.in/duels/#{duel_id}/comments?limit=#{limit}&skip=#{skip}", (comments)->
      comments = comments.rows if comments.rows
      callback(comments)

  @new_duel_comment = (comment, callback)->
    $.post "https://my-card.in/duels/#{comment.duel_id}/comments", comment, callback
