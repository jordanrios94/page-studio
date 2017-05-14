<nav class="am-right-sidebar">
    <div class="sb-content">

        @if (!empty($data['page']) && $data['page']->creator_user_id != 0)
        <div class="user-info">
            <img src="{{ $data['creator']->profile_url }}">
            <span class="position">A page by</span>
            <span class="name">{{ $data['creator']->username }}</span>
        </div>
        @endif

        <div class="tab-navigation">
            <ul role="tablist" class="nav nav-tabs nav-justified">
                <li role="presentation" class="active"><a href="#page-info" aria-controls="page info" role="tab" data-toggle="tab"> <span class="icon s7-note"></span></a></li>
                <li role="presentation"><a href="#styles" aria-controls="styles" role="tab" data-toggle="tab"> <span class="icon s7-paint-bucket"></span></a></li>
                <li role="presentation"><a href="#scripts" aria-controls="scripts" role="tab" data-toggle="tab"> <span class="icon s7-file"></span></a></li>
            </ul>
        </div>
        <div class="tab-panel">
            <div class="tab-content">
                <page-info-panel></page-info-panel>
                <source-panel type="styles" title="Styles" placeholder="Add new style link..."></source-panel>
                <source-panel type="scripts" title="Scripts" placeholder="Add new script link..."></source-panel>
            </div>
        </div>
    </div>
</nav>